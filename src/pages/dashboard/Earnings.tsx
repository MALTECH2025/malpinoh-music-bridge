
import WithdrawalFormCard from "@/components/dashboard/WithdrawalFormCard";
import WithdrawalHistory from "@/components/dashboard/WithdrawalHistory";
import BalanceSummaryCard from "@/components/dashboard/BalanceSummaryCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { WithdrawalFormValues } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEarningsData } from "@/hooks/useEarningsData";

const Earnings = () => {
  const { user } = useAuth();
  const { loading, stats, withdrawals, fetchData } = useEarningsData();

  const handleWithdrawalSubmitted = async (withdrawalData: WithdrawalFormValues) => {
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
        .update({ 
          available_balance: (stats?.availableBalance || 0) - withdrawalData.amount 
        })
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
          <BalanceSummaryCard stats={stats} />
          <WithdrawalFormCard 
            availableBalance={stats?.availableBalance || 0}
            onWithdrawalSubmitted={handleWithdrawalSubmitted}
          />
        </div>

        <WithdrawalHistory withdrawals={withdrawals} />
      </div>
    </MainLayout>
  );
};

export default Earnings;
