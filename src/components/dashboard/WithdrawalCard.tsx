
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Withdrawal } from "@/types";
import { formatDistanceToNow } from "date-fns";
import StatusBadge from "../StatusBadge";

interface WithdrawalCardProps {
  withdrawal: Withdrawal;
}

const WithdrawalCard = ({ withdrawal }: WithdrawalCardProps) => {
  const maskedAccountNumber = withdrawal.accountNumber.replace(
    /^(\d{4})(\d+)(\d{2})$/,
    "$1****$3"
  );

  const createdDate = new Date(withdrawal.createdAt);
  const formattedDate = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">${withdrawal.amount.toFixed(2)}</CardTitle>
          <StatusBadge status={withdrawal.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-muted-foreground">Account:</p>
          <p className="text-right">{withdrawal.accountName}</p>
          <p className="text-muted-foreground">Account Number:</p>
          <p className="text-right">{maskedAccountNumber}</p>
          <p className="text-muted-foreground">Requested:</p>
          <p className="text-right">{formattedDate}</p>
        </div>
      </CardContent>
      {withdrawal.processedAt && (
        <CardFooter className="pt-0 text-xs text-muted-foreground">
          Processed: {formatDistanceToNow(new Date(withdrawal.processedAt), { addSuffix: true })}
        </CardFooter>
      )}
    </Card>
  );
};

export default WithdrawalCard;
