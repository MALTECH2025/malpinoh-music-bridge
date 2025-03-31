
import AdminStats from "@/components/admin/AdminStats";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { getAdminStats } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { AdminStats as AdminStatsType, ReleaseStatus, Release, Withdrawal } from "@/types";
import ReleaseReviewCard from "@/components/admin/ReleaseReviewCard";
import WithdrawalReviewCard from "@/components/admin/WithdrawalReviewCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  const [pendingReleases, setPendingReleases] = useState<Release[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<Withdrawal[]>([]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get admin stats (still using mock for now)
      const adminStats = getAdminStats();
      setStats(adminStats);
      
      // Fetch real pending releases from Supabase
      const { data: releasesData, error: releasesError } = await supabase
        .from('releases')
        .select(`
          id,
          title,
          release_date,
          status,
          cover_art_url,
          platforms,
          artists (
            name
          )
        `)
        .eq('status', 'Pending')
        .limit(4) // Only get a few for the dashboard
        .order('release_date', { ascending: false });
        
      if (releasesError) throw releasesError;
      
      if (releasesData) {
        const formattedReleases: Release[] = releasesData.map(item => ({
          id: item.id,
          title: item.title,
          artist: item.artists?.name || 'Unknown Artist',
          status: item.status,
          coverArt: item.cover_art_url || null,
          createdAt: new Date(item.release_date).toISOString(),
          platforms: item.platforms || [],
        }));
        
        setPendingReleases(formattedReleases);
      }
      
      // For now, we'll keep using mock data for withdrawals since it's not implemented yet
      setPendingWithdrawals([]);
      
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string, codes?: { upc?: string; isrc?: string }) => {
    try {
      const { error } = await supabase
        .from('releases')
        .update({
          status: newStatus,
          ...(codes ? { upc: codes.upc, isrc: codes.isrc } : {})
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Remove the release from the pending list
      setPendingReleases(current => current.filter(release => release.id !== id));
      toast.success(`Release status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Error updating release status:", error);
      toast.error("Failed to update release status");
    }
  };

  if (loading) {
    return (
      <MainLayout requireAuth adminOnly>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth adminOnly>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        </div>

        {stats && <AdminStats stats={stats} />}

        <div className="grid gap-8">
          {/* Pending Releases */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Pending Releases</h3>
              <Button variant="link" asChild>
                <Link to="/admin/releases">View All</Link>
              </Button>
            </div>
            {pendingReleases.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingReleases.map((release) => (
                  <ReleaseReviewCard
                    key={release.id}
                    release={release}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  No pending releases to review.
                </p>
              </div>
            )}
          </div>

          {/* Pending Withdrawals */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Pending Withdrawals</h3>
              <Button variant="link" asChild>
                <Link to="/admin/withdrawals">View All</Link>
              </Button>
            </div>
            {pendingWithdrawals.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingWithdrawals.map((withdrawal) => (
                  <WithdrawalReviewCard
                    key={withdrawal.id}
                    withdrawal={withdrawal}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  No pending withdrawals to process.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
