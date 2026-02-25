import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Flame, Beef, Wheat, Droplet } from "lucide-react";

interface PlanSummarySidebarProps {
  totalCalories?: number;
  calorieTarget?: number;
  protein?: number;
  proteinTarget?: number;
  carbs?: number;
  carbsTarget?: number;
  fat?: number;
  fatTarget?: number;
  compliancePrediction?: number;
  className?: string;
}

export function PlanSummarySidebar({
  totalCalories = 1850,
  calorieTarget = 2000,
  protein = 95,
  proteinTarget = 120,
  carbs = 220,
  carbsTarget = 250,
  fat = 55,
  fatTarget = 67,
  compliancePrediction = 82,
  className,
}: PlanSummarySidebarProps) {
  const macros = [
    { label: "Protein", value: protein, target: proteinTarget, icon: Beef, color: "text-red-600" },
    { label: "Karbonhidrat", value: carbs, target: carbsTarget, icon: Wheat, color: "text-amber-600" },
    { label: "Yag", value: fat, target: fatTarget, icon: Droplet, color: "text-blue-600" },
  ];

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan Ozeti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-3xl font-bold">{totalCalories}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              / {calorieTarget} kcal (gunluk)
            </p>
            <Progress
              value={Math.min((totalCalories / calorieTarget) * 100, 100)}
              className="mt-2"
            />
          </div>

          <div className="space-y-4">
            {macros.map((m) => {
              const pct = Math.round((m.value / m.target) * 100);
              return (
                <div key={m.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <m.icon className={`h-4 w-4 ${m.color}`} />
                      {m.label}
                    </span>
                    <span className="text-muted-foreground">
                      {m.value}g / {m.target}g
                    </span>
                  </div>
                  <Progress value={Math.min(pct, 100)} />
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-green-600" />
            <p className="mt-1 text-sm font-semibold">Uyum Tahmini</p>
            <p className="text-2xl font-bold text-green-600">%{compliancePrediction}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
