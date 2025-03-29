
import AdminStats from "@/components/admin/AdminStats";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { getAdminStats, mockReleases, mockWithdrawals } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { AdminStats as AdminStatsType, ReleaseStatus } from "@/types";
import ReleaseReviewCard from "@/components/admin/ReleaseReviewCard";
import WithdrawalReviewCard from "@/components/admin/WithdrawalReviewCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API request delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const adminStats = getAdminStats();
        setStats(adminStats);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingReleases = mockReleases.filter(r => r.status === ReleaseStatus.PENDING);
  const pendingWithdrawals = mockWithdrawals.filter(w => w.status === 'PENDING');

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
