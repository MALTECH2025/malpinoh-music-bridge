
// Stats Types
export interface DashboardStats {
  totalReleases: number;
  pendingReleases: number;
  approvedReleases: number;
  rejectedReleases: number;
  totalEarnings: number;
  availableBalance: number;
}

export interface AdminStats extends DashboardStats {
  totalUsers: number;
  pendingWithdrawals: number;
}
