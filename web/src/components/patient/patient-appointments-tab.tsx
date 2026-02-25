import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Clock, Video, MapPin } from "lucide-react";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/constants";

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: "online" | "yuz_yuze";
  status: string;
  notes?: string;
}

interface PatientAppointmentsTabProps {
  upcoming?: Appointment[];
  past?: Appointment[];
  onSchedule?: () => void;
}

const defaultUpcoming: Appointment[] = [
  { id: "1", date: "28 Subat 2026", time: "10:00", type: "online", status: "confirmed", notes: "Haftalik kontrol" },
  { id: "2", date: "7 Mart 2026", time: "14:30", type: "yuz_yuze", status: "scheduled" },
];

const defaultPast: Appointment[] = [
  { id: "3", date: "21 Subat 2026", time: "10:00", type: "online", status: "completed", notes: "Plan guncelleme" },
  { id: "4", date: "14 Subat 2026", time: "11:00", type: "yuz_yuze", status: "completed", notes: "Ilk gorusme" },
  { id: "5", date: "10 Subat 2026", time: "09:30", type: "online", status: "no_show" },
];

const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  scheduled: "outline",
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  no_show: "destructive",
};

function AppointmentItem({ appointment }: { appointment: Appointment }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        {appointment.type === "online" ? (
          <Video className="h-5 w-5 text-primary" />
        ) : (
          <MapPin className="h-5 w-5 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{appointment.date}</span>
          <Badge variant={statusColors[appointment.status] ?? "outline"}>
            {APPOINTMENT_STATUS_LABELS[appointment.status] ?? appointment.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {appointment.time} &middot;{" "}
          {appointment.type === "online" ? "Online" : "Yuz yuze"}
        </p>
        {appointment.notes && (
          <p className="text-xs text-muted-foreground mt-0.5">{appointment.notes}</p>
        )}
      </div>
    </div>
  );
}

export function PatientAppointmentsTab({
  upcoming = defaultUpcoming,
  past = defaultPast,
  onSchedule,
}: PatientAppointmentsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Randevular</h3>
        <Button size="sm" onClick={onSchedule}>
          <CalendarPlus className="mr-1 h-4 w-4" />
          Yeni Randevu
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Yaklasan Randevular</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcoming.length > 0 ? (
            upcoming.map((a) => <AppointmentItem key={a.id} appointment={a} />)
          ) : (
            <p className="text-sm text-muted-foreground">Yaklasan randevu yok.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gecmis Randevular</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {past.length > 0 ? (
            past.map((a) => <AppointmentItem key={a.id} appointment={a} />)
          ) : (
            <p className="text-sm text-muted-foreground">Gecmis randevu yok.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
