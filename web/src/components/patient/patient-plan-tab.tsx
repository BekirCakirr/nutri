import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import { DAY_LABELS, PLAN_STATUS_LABELS } from "@/lib/constants";

interface PlanDay {
  day: string;
  meals: { type: string; description: string; calories: number }[];
  totalCalories: number;
  completed: boolean;
}

interface PatientPlanTabProps {
  planName?: string;
  status?: string;
  dateRange?: string;
  compliance?: number;
  completedDays?: number;
  totalDays?: number;
  weeklyPlan?: PlanDay[];
}

const defaultPlan: PlanDay[] = [
  { day: "monday", meals: [{ type: "Kahvalti", description: "Yulaf, meyve", calories: 350 }, { type: "Ogle", description: "Tavuk salata", calories: 500 }, { type: "Aksam", description: "Balik, sebze", calories: 450 }], totalCalories: 1300, completed: true },
  { day: "tuesday", meals: [{ type: "Kahvalti", description: "Omlet, ekmek", calories: 400 }, { type: "Ogle", description: "Mercimek, pilav", calories: 550 }, { type: "Aksam", description: "Et sote", calories: 500 }], totalCalories: 1450, completed: true },
  { day: "wednesday", meals: [{ type: "Kahvalti", description: "Peynir tabagi", calories: 380 }, { type: "Ogle", description: "Makarna", calories: 520 }, { type: "Aksam", description: "Corba, salata", calories: 400 }], totalCalories: 1300, completed: true },
  { day: "thursday", meals: [{ type: "Kahvalti", description: "Granola, yogurt", calories: 360 }, { type: "Ogle", description: "Kofte, bulgur", calories: 580 }, { type: "Aksam", description: "Sebze yemegi", calories: 380 }], totalCalories: 1320, completed: false },
  { day: "friday", meals: [{ type: "Kahvalti", description: "Tost", calories: 320 }, { type: "Ogle", description: "Tavuk wrap", calories: 480 }, { type: "Aksam", description: "Pizza (ev yapimi)", calories: 550 }], totalCalories: 1350, completed: false },
  { day: "saturday", meals: [], totalCalories: 0, completed: false },
  { day: "sunday", meals: [], totalCalories: 0, completed: false },
];

export function PatientPlanTab({
  planName = "Haftalik Beslenme Plani",
  status = "active",
  dateRange = "17 - 23 Subat 2026",
  compliance = 72,
  completedDays = 3,
  totalDays = 7,
  weeklyPlan = defaultPlan,
}: PatientPlanTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{planName}</h3>
              <Badge>{PLAN_STATUS_LABELS[status] ?? status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateRange}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">%{compliance}</p>
              <p className="text-xs text-muted-foreground">Uyum</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {completedDays}/{totalDays}
              </p>
              <p className="text-xs text-muted-foreground">Tamamlanan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weeklyPlan.map((dayPlan) => (
          <Card key={dayPlan.day} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{DAY_LABELS[dayPlan.day] ?? dayPlan.day}</span>
                {dayPlan.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {dayPlan.meals.length > 0 ? (
                dayPlan.meals.map((meal, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground">{meal.type}</span>
                    <span>{meal.calories} kcal</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-xs">Henuz planlanmadi</p>
              )}
              {dayPlan.totalCalories > 0 && (
                <>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Toplam</span>
                    <span>{dayPlan.totalCalories} kcal</span>
                  </div>
                  <Progress
                    value={Math.min((dayPlan.totalCalories / 2000) * 100, 100)}
                  />
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
