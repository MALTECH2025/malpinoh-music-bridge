
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminStats as AdminStatsType } from "@/types";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

const StatsCard = ({ title, value, description, icon }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
);

interface AdminStatsProps {
  stats: AdminStatsType;
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Users"
        value={stats.totalUsers}
        description="Registered artists"
      />
      <StatsCard
        title="Pending Releases"
        value={stats.pendingReleases}
        description="Releases awaiting review"
      />
      <StatsCard
        title="Approved Releases"
        value={stats.approvedReleases}
        description="Live releases"
      />
      <StatsCard
        title="Pending Withdrawals"
        value={stats.pendingWithdrawals}
        description="Withdrawal requests"
      />
      <StatsCard
        title="Total Earnings"
        value={`$${stats.totalEarnings.toFixed(2)}`}
        description="All artists' earnings"
      />
      <StatsCard
        title="Available Balance"
        value={`$${stats.availableBalance.toFixed(2)}`}
        description="Total available balance"
      />
      <StatsCard
        title="Total Releases"
        value={stats.totalReleases}
        description="All releases"
      />
      <StatsCard
        title="Rejected Releases"
        value={stats.rejectedReleases}
        description="Rejected releases"
      />
    </div>
  );
};

export default AdminStats;
