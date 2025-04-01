
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminStats as AdminStatsType } from "@/types";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Wallet, 
  Music, 
  XCircle 
} from "lucide-react";

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
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Pending Releases"
        value={stats.pendingReleases}
        description="Releases awaiting review"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Approved Releases"
        value={stats.approvedReleases}
        description="Live releases"
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Pending Withdrawals"
        value={stats.pendingWithdrawals}
        description="Withdrawal requests"
        icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Earnings"
        value={`$${stats.totalEarnings.toFixed(2)}`}
        description="All artists' earnings"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Available Balance"
        value={`$${stats.availableBalance.toFixed(2)}`}
        description="Total available balance"
        icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Releases"
        value={stats.totalReleases}
        description="All releases"
        icon={<Music className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Rejected Releases"
        value={stats.rejectedReleases}
        description="Rejected releases"
        icon={<XCircle className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};

export default AdminStats;
