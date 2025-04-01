
import WithdrawalCard from "@/components/dashboard/WithdrawalCard";
import WithdrawalForm from "@/components/dashboard/WithdrawalForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { DashboardStats, Withdrawal } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Earnings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      // Fetch artist financial data
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('total_earnings, available_balance')
        .eq('id', user.id)
        .single();
      
      if (artistError) throw artistError;
      
      // Fetch counts for stats
      const { count: totalReleasesCount, error: totalReleasesError } = await supabase
        .from('releases')
        .select('*', { count: 'exact', head: true })
        .eq('artist_id', user.id);
        
      if (totalReleasesError) throw totalReleasesError;
      
      const { count: pendingReleasesCount, error: pendingReleasesError } = await supabase
        .from('releases')
        .select('*', { count: 'exact', head: true })
        .eq('artist_id', user.id)
        .eq('status', 'Pending');
        
      if (pendingReleasesError) throw pendingReleasesError;

      const { count: approvedReleasesCount, error: approvedReleasesError } = await supabase
        .from('releases')
        .select('*', { count: 'exact', head: true })
        .eq('artist_id', user.id)
        .eq('status', 'Approved');
        
      if (approvedReleasesError) throw approvedReleasesError;
      
      const { count: rejectedReleasesCount, error: rejectedReleasesError } = await supabase
        .from('releases')
        .select('*', { count: 'exact', head: true })
        .eq('artist_id', user.id)
        .eq('status', 'Rejected');
        
      if (rejectedReleasesError) throw rejectedReleasesError;
      
      const statsData: DashboardStats = {
        totalReleases: totalReleasesCount || 0,
        pendingReleases: pendingReleasesCount || 0,
        approvedReleases: approvedReleasesCount || 0,
        rejectedReleases: rejectedReleasesCount || 0,
        totalEarnings: artistData?.total_earnings || 0,
        availableBalance: artistData?.available_balance || 0
      };
      
      setStats(statsData);
      
      // Fetch all withdrawals for this user
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (withdrawalsError) throw withdrawalsError;
      
      if (withdrawalsData) {
        const formattedWithdrawals = withdrawalsData.map(item => ({
          id: item.id,
          userId: item.user_id,
          amount: item.amount,
          status: item.status,
          createdAt: item.created_at,
          processedAt: item.processed_at,
          accountName: item.account_name,
          accountNumber: item.account_number
        }));
        
        setWithdrawals(formattedWithdrawals);
      }
    } catch (error) {
      console.error("Error fetching earnings data:", error);
      toast.error("Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleWithdrawalSubmitted = async (withdrawalData: {
    amount: number;
    accountName: string;
    accountNumber: string;
  }) => {
    try {
      if (!user) return;

      // Insert withdrawal request
      const { data, error } = await supabase
        .from('withdrawals')
        .insert([
          {
            user_id: user.id,
            artist_id: user.id,
            amount: withdrawalData.amount,
            account_name: withdrawalData.accountName,
            account_number: withdrawalData.accountNumber,
            status: 'PENDING'
          }
        ])
        .select();

      if (error) throw error;
      
      // Update available balance
      const { error: updateError } = await supabase
        .from('artists')
        .update({ available_balance: (stats?.availableBalance || 0) - withdrawalData.amount })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      toast.success("Withdrawal Request Submitted", {
        description: `Your request for $${withdrawalData.amount.toFixed(2)} is being processed.`,
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Withdrawal request error:", error);
      toast.error("Withdrawal request failed", {
        description: "There was a problem processing your withdrawal. Please try again.",
      });
    }
  };

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
        <h2 className="text-3xl font-bold tracking-tight">Earnings & Withdrawals</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Balance Summary</CardTitle>
              <CardDescription>Your current earnings and balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold">${stats?.totalEarnings.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold">${stats?.availableBalance.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
              <CardDescription>Withdraw your earnings to Opay</CardDescription>
            </CardHeader>
            <CardContent>
              <WithdrawalForm 
                availableBalance={stats?.availableBalance || 0}
                onWithdrawalSubmitted={handleWithdrawalSubmitted}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Withdrawal History</h3>
          {withdrawals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {withdrawals.map((withdrawal) => (
                <WithdrawalCard key={withdrawal.id} withdrawal={withdrawal} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-6 text-center">
              <p className="text-muted-foreground">
                You haven't made any withdrawal requests yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Earnings;
