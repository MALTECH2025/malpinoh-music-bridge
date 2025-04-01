
import DashboardStats from "@/components/dashboard/DashboardStats";
import ReleaseCard from "@/components/dashboard/ReleaseCard";
import WithdrawalCard from "@/components/dashboard/WithdrawalCard";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardStats as DashboardStatsType } from "@/types";
import { Release, Withdrawal } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (user) {
          // Fetch artist details
          const { data: artistData, error: artistError } = await supabase
            .from('artists')
            .select('total_earnings, available_balance')
            .eq('id', user.id)
            .single();
          
          if (artistError) {
            throw artistError;
          }
          
          // Fetch releases count
          const { count: totalReleasesCount, error: totalReleasesError } = await supabase
            .from('releases')
            .select('*', { count: 'exact', head: true })
            .eq('artist_id', user.id);
            
          if (totalReleasesError) {
            throw totalReleasesError;
          }
          
          // Fetch pending releases count
          const { count: pendingReleasesCount, error: pendingReleasesError } = await supabase
            .from('releases')
            .select('*', { count: 'exact', head: true })
            .eq('artist_id', user.id)
            .eq('status', 'Pending');
            
          if (pendingReleasesError) {
            throw pendingReleasesError;
          }
          
          // Fetch approved releases count
          const { count: approvedReleasesCount, error: approvedReleasesError } = await supabase
            .from('releases')
            .select('*', { count: 'exact', head: true })
            .eq('artist_id', user.id)
            .eq('status', 'Approved');
            
          if (approvedReleasesError) {
            throw approvedReleasesError;
          }
          
          // Fetch rejected releases count
          const { count: rejectedReleasesCount, error: rejectedReleasesError } = await supabase
            .from('releases')
            .select('*', { count: 'exact', head: true })
            .eq('artist_id', user.id)
            .eq('status', 'Rejected');
            
          if (rejectedReleasesError) {
            throw rejectedReleasesError;
          }
          
          const statsData: DashboardStatsType = {
            totalReleases: totalReleasesCount || 0,
            pendingReleases: pendingReleasesCount || 0,
            approvedReleases: approvedReleasesCount || 0,
            rejectedReleases: rejectedReleasesCount || 0,
            totalEarnings: artistData?.total_earnings || 0,
            availableBalance: artistData?.available_balance || 0
          };
          
          setStats(statsData);
          
          // Fetch recent releases (limit to 3)
          const { data: releasesData, error: releasesError } = await supabase
            .from('releases')
            .select(`
              *,
              artists: artist_id (
                name
              )
            `)
            .eq('artist_id', user.id)
            .order('release_date', { ascending: false })
            .limit(3);
          
          if (releasesError) {
            throw releasesError;
          }
          
          if (releasesData) {
            const formattedReleases = releasesData.map(item => ({
              id: item.id,
              title: item.title,
              artist: item.artists?.name || 'Unknown Artist',
              status: item.status,
              coverArt: item.cover_art_url,
              audioFile: item.audio_file_url,
              createdAt: new Date(item.release_date).toISOString(),
              userId: item.artist_id,
              genre: "Unknown",
              releaseDate: item.release_date,
              platforms: item.platforms || [],
              upc: item.upc || null,
              isrc: item.isrc || null
            }));
            
            setReleases(formattedReleases);
          }
          
          // Fetch recent withdrawals (limit to 2)
          const { data: withdrawalsData, error: withdrawalsError } = await supabase
            .from('withdrawals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(2);
            
          if (withdrawalsError) {
            throw withdrawalsError;
          }
          
          if (withdrawalsData) {
            const formattedWithdrawals: Withdrawal[] = withdrawalsData.map(item => ({
              id: item.id,
              userId: item.user_id,
              amount: item.amount,
              status: item.status as 'PENDING' | 'APPROVED' | 'REJECTED',
              createdAt: item.created_at,
              processedAt: item.processed_at || undefined,
              accountName: item.account_name,
              accountNumber: item.account_number
            }));
            
            setWithdrawals(formattedWithdrawals);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <MainLayout requireAuth>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link to="/upload">Upload New Release</Link>
            </Button>
          </div>
        </div>

        {stats && <DashboardStats stats={stats} />}

        <div className="grid gap-8">
          {/* Recent Releases */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Recent Releases</h3>
              <Button variant="link" asChild>
                <Link to="/releases">View All</Link>
              </Button>
            </div>
            {releases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {releases.map((release) => (
                  <ReleaseCard key={release.id} release={release} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <h4 className="font-medium mb-2">No releases yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Start uploading your music to distribute it worldwide.
                </p>
                <Button asChild>
                  <Link to="/upload">Upload Your First Release</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Recent Withdrawals */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Recent Withdrawals</h3>
              <Button variant="link" asChild>
                <Link to="/earnings">View All</Link>
              </Button>
            </div>
            {withdrawals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {withdrawals.map((withdrawal) => (
                  <WithdrawalCard key={withdrawal.id} withdrawal={withdrawal} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <h4 className="font-medium mb-2">No withdrawal history</h4>
                <p className="text-sm text-muted-foreground">
                  Your withdrawal requests will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
