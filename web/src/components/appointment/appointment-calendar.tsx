import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DateRange } from "react-day-picker";

interface CalendarAppointment {
  id: string;
  date: Date;
  time: string;
  patientName: string;
  type: "online" | "yuz_yuze";
}

interface AppointmentCalendarProps {
  appointments?: CalendarAppointment[];
  onDateSelect?: (date: Date | undefined) => void;
}

const today = new Date();

const defaultAppointments: CalendarAppointment[] = [
  { id: "1", date: today, time: "09:00", patientName: "Ayse Yilmaz", type: "online" },
  { id: "2", date: today, time: "11:00", patientName: "Mehmet Kaya", type: "yuz_yuze" },
  { id: "3", date: new Date(today.getTime() + 86400000), time: "10:00", patientName: "Fatma Demir", type: "online" },
];

export function AppointmentCalendar({
  appointments = defaultAppointments,
  onDateSelect,
}: AppointmentCalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(today);

  function handleSelect(date: Date | undefined) {
    setSelected(date);
    onDateSelect?.(date);
  }

  const dayAppointments = selected
    ? appointments.filter(
        (a) => a.date.toDateString() === selected.toDateString(),
      )
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Randevu Takvimi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          className="rounded-md border"
        />

        {selected && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">
              {selected.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
            </h4>
            {dayAppointments.length > 0 ? (
              dayAppointments.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded border p-2 text-sm">
                  <div>
                    <span className="font-medium">{a.time}</span>
                    <span className="text-muted-foreground"> - {a.patientName}</span>
                  </div>
                  <Badge variant="outline">
                    {a.type === "online" ? "Online" : "Yuz yuze"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Bu gun randevu yok.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
