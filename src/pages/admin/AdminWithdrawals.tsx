
import WithdrawalReviewCard from "@/components/admin/WithdrawalReviewCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { mockWithdrawals } from "@/lib/mock-data";
import { Withdrawal } from "@/types";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminWithdrawals = () => {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const handleStatusChange = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setWithdrawals(currentWithdrawals => 
      currentWithdrawals.map(withdrawal => 
        withdrawal.id === id 
          ? { 
              ...withdrawal, 
              status: newStatus,
              processedAt: new Date().toISOString()
            } 
          : withdrawal
      )
    );
  };

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        // Simulating API request delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setWithdrawals(mockWithdrawals);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'PENDING');
  const approvedWithdrawals = withdrawals.filter(w => w.status === 'APPROVED');
  const rejectedWithdrawals = withdrawals.filter(w => w.status === 'REJECTED');

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
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Manage Withdrawals</h2>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingWithdrawals.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedWithdrawals.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedWithdrawals.length})</TabsTrigger>
            <TabsTrigger value="all">All ({withdrawals.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            {pendingWithdrawals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingWithdrawals.map((withdrawal) => (
                  <WithdrawalReviewCard 
                    key={withdrawal.id} 
                    withdrawal={withdrawal}
                    onStatusChange={handleStatusChange}
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
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            {approvedWithdrawals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedWithdrawals.map((withdrawal) => (
                  <WithdrawalReviewCard 
                    key={withdrawal.id} 
                    withdrawal={withdrawal}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  No approved withdrawals.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-6">
            {rejectedWithdrawals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rejectedWithdrawals.map((withdrawal) => (
                  <WithdrawalReviewCard 
                    key={withdrawal.id} 
                    withdrawal={withdrawal}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  No rejected withdrawals.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            {withdrawals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {withdrawals.map((withdrawal) => (
                  <WithdrawalReviewCard 
                    key={withdrawal.id} 
                    withdrawal={withdrawal}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  No withdrawals found.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminWithdrawals;
