
import { Badge } from "@/components/ui/badge";
import { ReleaseStatus } from "@/types";

interface StatusBadgeProps {
  status: string | ReleaseStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case ReleaseStatus.PENDING:
    case "Pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case ReleaseStatus.APPROVED:
    case "Approved":
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
    case ReleaseStatus.REJECTED:
    case "Rejected":
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default StatusBadge;
