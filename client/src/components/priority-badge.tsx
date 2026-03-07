import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";

export function PriorityBadge({ priority }: { priority?: string | null }) {
  if (!priority) return null;

  switch (priority.toLowerCase()) {
    case "high":
      return (
        <Badge variant="destructive" className="gap-1 shadow-sm">
          <AlertTriangle className="w-3 h-3" /> High
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100 gap-1">
          <MinusIcon className="w-3 h-3" /> Medium
        </Badge>
      );
    case "low":
      return (
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 gap-1">
          <ArrowDownIcon className="w-3 h-3" /> Low
        </Badge>
      );
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}
