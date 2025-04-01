
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types";

interface BalanceSummaryCardProps {
  stats: DashboardStats | null;
}

const BalanceSummaryCard = ({ stats }: BalanceSummaryCardProps) => {
  return (
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
  );
};

export default BalanceSummaryCard;
