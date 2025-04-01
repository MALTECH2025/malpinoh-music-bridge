
import { useState, useEffect } from "react";
import AdminStats from "@/components/admin/AdminStats";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import ReleaseReviewCard from "@/components/admin/ReleaseReviewCard";
import { ReleaseStatus } from "@/types";
import { Release } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminStats as AdminStatsType } from "@/types";

const AdminDashboard = () => {
  const [pendingReleases, setPendingReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState<AdminStatsType>({
    totalUsers: 0,
    totalReleases: 0,
    pendingReleases: 0,
    approvedReleases: 0,
    rejectedReleases: 0,
    pendingWithdrawals: 0,
    totalEarnings: 0,
    availableBalance: 0
  });
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch total users count
      const { count: usersCount, error: usersError } = await supabase
        .from('artists')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;
      
      // Fetch total releases count
      const { count: totalReleasesCount, error: totalReleasesError } = await supabase
        .from('releases')
        .select('*', { count: 'exact', head: true });
      
      if (totalReleasesError) throw totalReleasesError;
      
      // Fetch pending releases count
      const { count: pendingReleasesCount, error: pendingReleasesError } = await supabase
        .from('releases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');
      
      if (pendingReleasesError) throw pendingReleasesError;
      
      // Fetch approved releases count
      const { count: approvedReleasesCount, error: approvedReleasesError } = await supabase
        .from('releases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Approved');
      
      if (approvedReleasesError) throw approvedReleasesError;
      
      // Fetch rejected releases count
      const { count: rejectedReleasesCount, error: rejectedReleasesError } = await supabase
        .from('releases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Rejected');
      
      if (rejectedReleasesError) throw rejectedReleasesError;
      
      // Fetch pending withdrawals count
      const { count: pendingWithdrawalsCount, error: pendingWithdrawalsError } = await supabase
        .from('withdrawals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');
      
      if (pendingWithdrawalsError) throw pendingWithdrawalsError;
      
      // Fetch total earnings
      const { data: artistsData, error: artistsError } = await supabase
        .from('artists')
        .select('total_earnings, available_balance');
      
      if (artistsError) throw artistsError;
      
      const totalEarnings = artistsData?.reduce((sum, artist) => sum + (artist.total_earnings || 0), 0) || 0;
      const totalAvailableBalance = artistsData?.reduce((sum, artist) => sum + (artist.available_balance || 0), 0) || 0;

      setAdminStats({
        totalUsers: usersCount || 0,
        totalReleases: totalReleasesCount || 0,
        pendingReleases: pendingReleasesCount || 0,
        approvedReleases: approvedReleasesCount || 0,
        rejectedReleases: rejectedReleasesCount || 0,
        pendingWithdrawals: pendingWithdrawalsCount || 0,
        totalEarnings: totalEarnings,
        availableBalance: totalAvailableBalance
      });

      // Fetch pending releases
      const { data, error } = await supabase
        .from('releases')
        .select(`
          *,
          artists: artist_id (
            name
          )
        `)
        .eq('status', 'Pending')
        .order('release_date', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      if (data) {
        const formattedReleases = data.map(item => ({
          id: item.id,
          title: item.title,
          artist: item.artists?.name || 'Unknown Artist',
          status: item.status as ReleaseStatus,
          coverArt: item.cover_art_url || null,
          audioFile: item.audio_file_url || null,
          createdAt: item.release_date,
          platforms: item.platforms || [],
          userId: item.artist_id,
          genre: item.genre || "Unknown",
          releaseDate: item.release_date,
          upc: item.upc,
          isrc: item.isrc,
        }));

        setPendingReleases(formattedReleases);
      }
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string, codes?: { upc?: string; isrc?: string }) => {
    try {
      const updateData: Record<string, any> = { status: newStatus };
      
      if (codes?.upc) updateData.upc = codes.upc;
      if (codes?.isrc) updateData.isrc = codes.isrc;
      
      const { error } = await supabase
        .from('releases')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setPendingReleases(prevReleases => 
        prevReleases.filter(release => release.id !== id)
      );

      toast({
        title: "Success",
        description: `Release has been marked as ${newStatus}`,
      });
      
      // Refresh stats
      fetchData();
    } catch (error) {
      console.error('Error updating release status:', error);
      toast({
        title: "Error",
        description: "Failed to update release status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout requireAuth adminOnly>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminStats stats={adminStats} />

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Pending Releases</h2>
        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size={40} />
          </div>
        ) : pendingReleases.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {pendingReleases.map((release) => (
              <ReleaseReviewCard 
                key={release.id} 
                release={release} 
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center p-8">
            No pending releases to review at this time.
          </p>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
