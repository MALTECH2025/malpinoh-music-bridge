
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Withdrawal } from "@/types";
import { formatDistanceToNow } from "date-fns";
import StatusBadge from "../StatusBadge";

interface WithdrawalReviewCardProps {
  withdrawal: Withdrawal;
  onStatusChange?: (id: string, newStatus: 'APPROVED' | 'REJECTED') => void;
}

const WithdrawalReviewCard = ({ withdrawal, onStatusChange }: WithdrawalReviewCardProps) => {
  const createdDate = new Date(withdrawal.createdAt);
  const formattedDate = formatDistanceToNow(createdDate, { addSuffix: true });

  const handleApprove = () => {
    onStatusChange?.(withdrawal.id, 'APPROVED');
    toast.success(`Withdrawal of $${withdrawal.amount.toFixed(2)} has been approved`);
  };

  const handleReject = () => {
    onStatusChange?.(withdrawal.id, 'REJECTED');
    toast.info(`Withdrawal of $${withdrawal.amount.toFixed(2)} has been rejected`);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">${withdrawal.amount.toFixed(2)}</CardTitle>
          <StatusBadge status={withdrawal.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-muted-foreground">User:</p>
          <p className="text-right">{withdrawal.accountName}</p>
          <p className="text-muted-foreground">Account Number:</p>
          <p className="text-right">{withdrawal.accountNumber}</p>
          <p className="text-muted-foreground">Requested:</p>
          <p className="text-right">{formattedDate}</p>
        </div>
      </CardContent>
      {withdrawal.status === 'PENDING' && (
        <CardFooter className="pt-2 border-t flex justify-end gap-2">
          <Button variant="destructive" size="sm" onClick={handleReject}>
            Reject
          </Button>
          <Button size="sm" onClick={handleApprove}>
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WithdrawalReviewCard;
