import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Flame, Droplets, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface OverviewStat {
  label: string;
  value: string;
  change?: string;
  icon: typeof Scale;
}

interface PatientOverviewTabProps {
  bmi: number;
  weight: number;
  dailyCalories: number;
  waterIntake: number;
  weightTrend?: { date: string; value: number }[];
  calorieTrend?: { date: string; value: number }[];
}

function StatCard({ label, value, change, icon: Icon }: OverviewStat) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
          {change && (
            <p className="text-xs text-muted-foreground">{change}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const defaultWeightTrend = [
  { date: "Pzt", value: 78.5 },
  { date: "Sal", value: 78.3 },
  { date: "Car", value: 78.1 },
  { date: "Per", value: 77.9 },
  { date: "Cum", value: 78.0 },
  { date: "Cmt", value: 77.7 },
  { date: "Paz", value: 77.5 },
];

const defaultCalorieTrend = [
  { date: "Pzt", value: 1850 },
  { date: "Sal", value: 2100 },
  { date: "Car", value: 1950 },
  { date: "Per", value: 1800 },
  { date: "Cum", value: 2200 },
  { date: "Cmt", value: 2050 },
  { date: "Paz", value: 1900 },
];

export function PatientOverviewTab({
  bmi,
  weight,
  dailyCalories,
  waterIntake,
  weightTrend = defaultWeightTrend,
  calorieTrend = defaultCalorieTrend,
}: PatientOverviewTabProps) {
  const stats: OverviewStat[] = [
    { label: "BMI", value: bmi.toFixed(1), change: "Normal aralik", icon: Activity },
    { label: "Kilo", value: `${weight} kg`, change: "-0.5 kg bu hafta", icon: Scale },
    { label: "Gunluk Kalori", value: `${dailyCalories} kcal`, change: "Hedef: 2000 kcal", icon: Flame },
    { label: "Su Tuketimi", value: `${waterIntake} L`, change: "Hedef: 2.5 L", icon: Droplets },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kilo Takibi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightTrend}>
                <XAxis dataKey="date" fontSize={12} />
                <YAxis domain={["auto", "auto"]} fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kalori Takibi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={calorieTrend}>
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
