
import { useState, useEffect } from "react";
import AdminStats from "@/components/admin/AdminStats";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import ReleaseReviewCard from "@/components/admin/ReleaseReviewCard";
import { ReleaseStatus } from "@/types";
import { Release } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAdminStats } from "@/lib/mock-data";

const AdminDashboard = () => {
  const [pendingReleases, setPendingReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [adminStats, setAdminStats] = useState(getAdminStats());

  const fetchPendingReleases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('releases')
        .select(`
          *,
          artists: artist_id (
            name
          )
        `)
        .eq('status', 'Pending')
        .order('created_at', { ascending: false })
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
          createdAt: new Date(item.release_date).toISOString(),
          platforms: item.platforms || [],
          // Use what's available in the database or provide default values
          userId: item.artist_id, // Using artist_id instead of user_id
          audioFile: null, // Not available in the response
          genre: "Unknown", // Not available in the response
          releaseDate: item.release_date,
          upc: undefined, // Not available in the response
          isrc: undefined, // Not available in the response
        }));

        setPendingReleases(formattedReleases);
      }
    } catch (error) {
      console.error('Error fetching pending releases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending releases. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReleases();
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
