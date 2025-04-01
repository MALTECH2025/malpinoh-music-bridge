
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WithdrawalFormValues } from "@/types";
import WithdrawalForm from "./WithdrawalForm";

interface WithdrawalFormCardProps {
  availableBalance: number;
  onWithdrawalSubmitted: (data: WithdrawalFormValues) => Promise<void>;
}

const WithdrawalFormCard = ({ availableBalance, onWithdrawalSubmitted }: WithdrawalFormCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Withdrawal</CardTitle>
        <CardDescription>Withdraw your earnings to Opay</CardDescription>
      </CardHeader>
      <CardContent>
        <WithdrawalForm
          availableBalance={availableBalance}
          onWithdrawalSubmitted={onWithdrawalSubmitted}
        />
      </CardContent>
    </Card>
  );
};

export default WithdrawalFormCard;
