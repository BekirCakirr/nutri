import { Badge } from "@/components/ui/badge";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AppointmentStatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  no_show: "bg-orange-100 text-orange-800 border-orange-200",
};

export function AppointmentStatusBadge({ status, className }: AppointmentStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs", statusStyles[status], className)}
    >
      {APPOINTMENT_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
