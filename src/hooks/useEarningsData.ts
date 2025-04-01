
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats, Withdrawal } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useEarningsData = () => {
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

  return {
    loading,
    stats,
    withdrawals,
    fetchData
  };
};
