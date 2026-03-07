import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1.5 px-2.5 py-0.5">
          <Clock className="w-3.5 h-3.5" /> Pending
        </Badge>
      );
    case "in progress":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1.5 px-2.5 py-0.5">
          <AlertCircle className="w-3.5 h-3.5" /> In Progress
        </Badge>
      );
    case "resolved":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 px-2.5 py-0.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1.5 px-2.5 py-0.5">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
