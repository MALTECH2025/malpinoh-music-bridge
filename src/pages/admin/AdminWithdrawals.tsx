
import WithdrawalReviewCard from "@/components/admin/WithdrawalReviewCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { Withdrawal } from "@/types";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminWithdrawals = () => {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [activeTab, setActiveTab] = useState<string>("pending");

  const fetchWithdrawals = async (status?: string) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('withdrawals')
        .select(`
          *,
          artists: artist_id (
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (status && status !== "all") {
        query = query.eq('status', status.toUpperCase());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        const formattedWithdrawals = data.map(item => ({
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
      console.error("Error fetching withdrawals:", error);
      toast.error("Failed to load withdrawal data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(activeTab);
  }, [activeTab]);

  const handleStatusChange = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const withdrawal = withdrawals.find(w => w.id === id);
      if (!withdrawal) return;
      
      // First get the artist data
      const { data: artistData, error: artistError } = await supabase
        .from('withdrawals')
        .select('artist_id, amount')
        .eq('id', id)
        .single();
      
      if (artistError) throw artistError;
      
      const { artist_id, amount } = artistData;
      
      // Begin transaction-like operations
      // 1. Update withdrawal status
      const { error: withdrawalError } = await supabase
        .from('withdrawals')
        .update({
          status: newStatus,
          processed_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (withdrawalError) throw withdrawalError;
      
      // 2. If rejected, add the amount back to available_balance
      if (newStatus === 'REJECTED') {
        const { data: artistData, error: getArtistError } = await supabase
          .from('artists')
          .select('available_balance')
          .eq('id', artist_id)
          .single();
        
        if (getArtistError) throw getArtistError;
        
        const currentBalance = artistData.available_balance || 0;
        
        const { error: updateBalanceError } = await supabase
          .from('artists')
          .update({ available_balance: currentBalance + amount })
          .eq('id', artist_id);
        
        if (updateBalanceError) throw updateBalanceError;
      }
      
      toast.success(`Withdrawal of $${withdrawal.amount.toFixed(2)} has been ${newStatus.toLowerCase()}`);
      
      // Refresh data
      fetchWithdrawals(activeTab);
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      toast.error("Failed to update withdrawal status");
    }
  };

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

        <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingWithdrawals.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedWithdrawals.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedWithdrawals.length})</TabsTrigger>
            <TabsTrigger value="all">All ({withdrawals.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
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
                  No {activeTab !== 'all' ? activeTab : ''} withdrawals found.
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
