import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { PLAN_STATUS_LABELS } from "@/lib/constants";

interface PlanHeaderProps {
  name: string;
  dateRange: string;
  status: string;
  patientName?: string;
}

const statusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  active: "default",
  paused: "secondary",
  completed: "secondary",
  archived: "destructive",
};

export function PlanHeader({ name, dateRange, status, patientName }: PlanHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">{name}</h2>
        <Badge variant={statusVariants[status] ?? "outline"}>
          {PLAN_STATUS_LABELS[status] ?? status}
        </Badge>
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {dateRange}
        </span>
        {patientName && <span>&middot; {patientName}</span>}
      </div>
    </div>
  );
}
