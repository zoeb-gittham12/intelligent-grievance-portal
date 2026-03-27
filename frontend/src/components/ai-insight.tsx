import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AIInsightProps {
  department?: string | null;
  confidenceScore?: number | null;
  className?: string;
}

export function AIInsight({ department, confidenceScore, className = "" }: AIInsightProps) {
  if (!department) return null;

  return (
    <div className={`p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-100 text-primary rounded-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <h4 className="text-sm font-semibold text-indigo-950">AI Triage Suggestion</h4>
            <p className="text-sm text-indigo-700/80">Routed to <span className="font-semibold text-indigo-900">{department}</span></p>
          </div>
          {confidenceScore !== undefined && confidenceScore !== null && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-indigo-800">
                <span>Confidence Score</span>
                <span>{confidenceScore}%</span>
              </div>
              <Progress value={confidenceScore} className="h-1.5 bg-indigo-100" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
