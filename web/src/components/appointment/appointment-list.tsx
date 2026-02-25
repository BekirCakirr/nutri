import { AppointmentCard } from "./appointment-card";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: "online" | "yuz_yuze";
  status: string;
  dateGroup: string;
}

interface AppointmentListProps {
  appointments?: Appointment[];
  onSelect?: (id: string) => void;
}

const defaultAppointments: Appointment[] = [
  { id: "1", patientName: "Ayse Yilmaz", date: "25 Sub 2026", time: "09:00", type: "online", status: "confirmed", dateGroup: "Bugun" },
  { id: "2", patientName: "Mehmet Kaya", date: "25 Sub 2026", time: "11:00", type: "yuz_yuze", status: "scheduled", dateGroup: "Bugun" },
  { id: "3", patientName: "Fatma Demir", date: "26 Sub 2026", time: "10:00", type: "online", status: "scheduled", dateGroup: "Yarin" },
  { id: "4", patientName: "Ali Celik", date: "27 Sub 2026", time: "14:00", type: "online", status: "scheduled", dateGroup: "27 Subat" },
];

export function AppointmentList({
  appointments = defaultAppointments,
  onSelect,
}: AppointmentListProps) {
  const groups = appointments.reduce<Record<string, Appointment[]>>((acc, appt) => {
    if (!acc[appt.dateGroup]) acc[appt.dateGroup] = [];
    acc[appt.dateGroup].push(appt);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">{group}</h3>
          <div className="space-y-2">
            {items.map((appt) => (
              <AppointmentCard
                key={appt.id}
                patientName={appt.patientName}
                date={appt.date}
                time={appt.time}
                type={appt.type}
                status={appt.status}
                onClick={() => onSelect?.(appt.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
