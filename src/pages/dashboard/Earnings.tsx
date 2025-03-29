
import WithdrawalCard from "@/components/dashboard/WithdrawalCard";
import WithdrawalForm from "@/components/dashboard/WithdrawalForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardStats, getWithdrawalsForUser } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { DashboardStats, Withdrawal } from "@/types";

const Earnings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const fetchData = async () => {
    try {
      // Simulating API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (user) {
        const userStats = getDashboardStats(user.id);
        const userWithdrawals = getWithdrawalsForUser(user.id);
        
        setStats(userStats);
        setWithdrawals(userWithdrawals);
      }
    } catch (error) {
      console.error("Error fetching earnings data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
                onWithdrawalSubmitted={fetchData}
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
