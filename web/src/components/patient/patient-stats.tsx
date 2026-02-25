import { Card, CardContent } from "@/components/ui/card";
import { Utensils, TrendingUp, CalendarDays, Activity } from "lucide-react";

interface PatientStatsProps {
  totalMeals?: number;
  avgAdherence?: number;
  daysActive?: number;
  currentStreak?: number;
}

export function PatientStats({
  totalMeals = 124,
  avgAdherence = 78,
  daysActive = 42,
  currentStreak = 7,
}: PatientStatsProps) {
  const stats = [
    { label: "Toplam Ogun", value: totalMeals.toString(), icon: Utensils, color: "bg-blue-100 text-blue-600" },
    { label: "Ort. Uyum", value: `%${avgAdherence}`, icon: TrendingUp, color: "bg-green-100 text-green-600" },
    { label: "Aktif Gun", value: daysActive.toString(), icon: CalendarDays, color: "bg-purple-100 text-purple-600" },
    { label: "Mevcut Seri", value: `${currentStreak} gun`, icon: Activity, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
