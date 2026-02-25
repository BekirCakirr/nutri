import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Video, MapPin } from "lucide-react";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
  patientName: string;
  date: string;
  time: string;
  type: "online" | "yuz_yuze";
  status: string;
  onClick?: () => void;
  className?: string;
}

const statusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  scheduled: "outline",
  confirmed: "default",
  in_progress: "default",
  completed: "secondary",
  cancelled: "destructive",
  no_show: "destructive",
};

export function AppointmentCard({
  patientName,
  date,
  time,
  type,
  status,
  onClick,
  className,
}: AppointmentCardProps) {
  return (
    <Card
      className={cn("cursor-pointer transition-shadow hover:shadow-md", className)}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          {type === "online" ? (
            <Video className="h-5 w-5 text-primary" />
          ) : (
            <MapPin className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{patientName}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {date} &middot; {time}
          </p>
        </div>
        <Badge variant={statusVariants[status] ?? "outline"}>
          {APPOINTMENT_STATUS_LABELS[status] ?? status}
        </Badge>
      </CardContent>
    </Card>
  );
}
