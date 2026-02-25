import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Percent, Flame } from "lucide-react";

interface HealthMetricsCardProps {
  bmi: number;
  bodyFat?: number;
  metabolicRate?: number;
  className?: string;
}

function getBmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Zayif", color: "text-blue-600" };
  if (bmi < 25) return { label: "Normal", color: "text-green-600" };
  if (bmi < 30) return { label: "Fazla Kilolu", color: "text-yellow-600" };
  return { label: "Obez", color: "text-red-600" };
}

export function HealthMetricsCard({
  bmi,
  bodyFat,
  metabolicRate,
  className,
}: HealthMetricsCardProps) {
  const bmiCat = getBmiCategory(bmi);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Saglik Metrikleri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">BMI (Vucut Kitle Indeksi)</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold">{bmi.toFixed(1)}</p>
              <span className={`text-sm font-medium ${bmiCat.color}`}>
                {bmiCat.label}
              </span>
            </div>
          </div>
        </div>

        {bodyFat !== undefined && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <Percent className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Vucut Yag Orani</p>
              <p className="text-xl font-bold">%{bodyFat.toFixed(1)}</p>
            </div>
          </div>
        )}

        {metabolicRate !== undefined && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <Flame className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Bazal Metabolizma Hizi</p>
              <p className="text-xl font-bold">{metabolicRate} kcal</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
