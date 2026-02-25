import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Utensils,
  Scale,
  CalendarCheck,
  MessageSquare,
  FileText,
  Pill,
} from "lucide-react";
import type { ElementType } from "react";

interface TimelineEvent {
  id: string;
  type: "meal" | "weight" | "appointment" | "message" | "report" | "plan";
  title: string;
  description: string;
  time: string;
}

interface PatientTimelineProps {
  events?: TimelineEvent[];
}

const iconMap: Record<string, ElementType> = {
  meal: Utensils,
  weight: Scale,
  appointment: CalendarCheck,
  message: MessageSquare,
  report: FileText,
  plan: Pill,
};

const colorMap: Record<string, string> = {
  meal: "bg-green-100 text-green-600",
  weight: "bg-blue-100 text-blue-600",
  appointment: "bg-purple-100 text-purple-600",
  message: "bg-yellow-100 text-yellow-600",
  report: "bg-cyan-100 text-cyan-600",
  plan: "bg-red-100 text-red-600",
};

const defaultEvents: TimelineEvent[] = [
  { id: "1", type: "meal", title: "Ogun kaydedildi", description: "Kahvalti - 420 kcal", time: "08:30" },
  { id: "2", type: "weight", title: "Kilo guncellendi", description: "77.5 kg (-0.3 kg)", time: "07:45" },
  { id: "3", type: "message", title: "Mesaj gonderdi", description: "Plan hakkinda soru", time: "Dun 14:20" },
  { id: "4", type: "appointment", title: "Randevu tamamlandi", description: "Online gorusme", time: "Dun 10:00" },
  { id: "5", type: "report", title: "Rapor olusturuldu", description: "Haftalik ilerleme", time: "22 Sub" },
  { id: "6", type: "plan", title: "Plan guncellendi", description: "Yeni haftalik plan", time: "20 Sub" },
];

export function PatientTimeline({ events = defaultEvents }: PatientTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Aktivite Zamancizgisi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          <div className="absolute left-5 top-0 h-full w-px bg-border" />
          {events.map((event) => {
            const Icon = iconMap[event.type] ?? FileText;
            const color = colorMap[event.type] ?? "bg-gray-100 text-gray-600";
            return (
              <div key={event.id} className="relative flex gap-4 pl-2">
                <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
