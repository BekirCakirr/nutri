import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Dumbbell, Moon } from "lucide-react";

interface TrackingEntry {
  date: string;
  value: number;
}

interface ExerciseLog {
  id: string;
  date: string;
  type: string;
  duration: number;
  caloriesBurned: number;
}

interface SleepLog {
  date: string;
  hours: number;
  quality: "iyi" | "orta" | "kotu";
}

interface PatientTrackingTabProps {
  weightData?: TrackingEntry[];
  waterData?: TrackingEntry[];
  exerciseLogs?: ExerciseLog[];
  sleepLogs?: SleepLog[];
}

const defaultWeight: TrackingEntry[] = [
  { date: "1 Sub", value: 79.0 },
  { date: "5 Sub", value: 78.6 },
  { date: "10 Sub", value: 78.2 },
  { date: "15 Sub", value: 77.9 },
  { date: "20 Sub", value: 77.5 },
  { date: "25 Sub", value: 77.2 },
];

const defaultWater: TrackingEntry[] = [
  { date: "Pzt", value: 2.1 },
  { date: "Sal", value: 1.8 },
  { date: "Car", value: 2.5 },
  { date: "Per", value: 2.3 },
  { date: "Cum", value: 1.9 },
  { date: "Cmt", value: 2.4 },
  { date: "Paz", value: 2.0 },
];

const defaultExercise: ExerciseLog[] = [
  { id: "1", date: "25 Sub", type: "Yuruyus", duration: 45, caloriesBurned: 250 },
  { id: "2", date: "24 Sub", type: "Yogа", duration: 30, caloriesBurned: 120 },
  { id: "3", date: "23 Sub", type: "Kosu", duration: 30, caloriesBurned: 320 },
  { id: "4", date: "22 Sub", type: "Agirlik", duration: 60, caloriesBurned: 400 },
];

const defaultSleep: SleepLog[] = [
  { date: "Pzt", hours: 7.5, quality: "iyi" },
  { date: "Sal", hours: 6.0, quality: "kotu" },
  { date: "Car", hours: 7.0, quality: "orta" },
  { date: "Per", hours: 8.0, quality: "iyi" },
  { date: "Cum", hours: 6.5, quality: "orta" },
  { date: "Cmt", hours: 8.5, quality: "iyi" },
  { date: "Paz", hours: 7.0, quality: "iyi" },
];

const qualityColor: Record<string, string> = {
  iyi: "text-green-600",
  orta: "text-yellow-600",
  kotu: "text-red-600",
};

export function PatientTrackingTab({
  weightData = defaultWeight,
  waterData = defaultWater,
  exerciseLogs = defaultExercise,
  sleepLogs = defaultSleep,
}: PatientTrackingTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kilo Degisimi</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis domain={["auto", "auto"]} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Su Tuketimi (L)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Egzersiz Kayitlari</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {exerciseLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                <Dumbbell className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{log.type}</p>
                <p className="text-xs text-muted-foreground">{log.date}</p>
              </div>
              <div className="text-right text-sm">
                <p>{log.duration} dk</p>
                <p className="text-xs text-muted-foreground">{log.caloriesBurned} kcal</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Uyku Kalitesi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sleepLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                <Moon className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{log.date}</p>
                <p className="text-xs text-muted-foreground">{log.hours} saat</p>
              </div>
              <span className={`text-sm font-medium capitalize ${qualityColor[log.quality]}`}>
                {log.quality === "iyi" ? "Iyi" : log.quality === "orta" ? "Orta" : "Kotu"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
