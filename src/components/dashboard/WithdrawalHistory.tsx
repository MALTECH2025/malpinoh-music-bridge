
import WithdrawalCard from "@/components/dashboard/WithdrawalCard";
import { Withdrawal } from "@/types";

interface WithdrawalHistoryProps {
  withdrawals: Withdrawal[];
}

const WithdrawalHistory = ({ withdrawals }: WithdrawalHistoryProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Withdrawal History</h3>
      {withdrawals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {withdrawals.map((withdrawal) => (
            <WithdrawalCard key={withdrawal.id} withdrawal={withdrawal} />
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            You haven't made any withdrawal requests yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistory;
