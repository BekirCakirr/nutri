import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, Clock, Utensils } from "lucide-react";
import { MEAL_TYPE_LABELS } from "@/lib/constants";

interface Meal {
  id: string;
  type: string;
  foods: string[];
  calories: number;
  time: string;
  status: "pending" | "approved" | "rejected";
}

interface NutritionSummary {
  calories: number;
  calorieTarget: number;
  protein: number;
  proteinTarget: number;
  carbs: number;
  carbsTarget: number;
  fat: number;
  fatTarget: number;
}

interface PatientNutritionTabProps {
  meals?: Meal[];
  summary?: NutritionSummary;
  onApproveMeal?: (id: string) => void;
  onRejectMeal?: (id: string) => void;
}

const defaultMeals: Meal[] = [
  { id: "1", type: "breakfast", foods: ["Yumurta", "Tam bugday ekmek", "Peynir"], calories: 420, time: "08:30", status: "approved" },
  { id: "2", type: "lunch", foods: ["Tavuk gogsu", "Bulgur pilavi", "Salata"], calories: 650, time: "12:45", status: "pending" },
  { id: "3", type: "snack", foods: ["Yesil elma", "Badem"], calories: 180, time: "15:30", status: "pending" },
  { id: "4", type: "dinner", foods: ["Mercimek corbasi", "Izgara balik", "Sote sebze"], calories: 550, time: "19:00", status: "approved" },
];

const defaultSummary: NutritionSummary = {
  calories: 1800,
  calorieTarget: 2000,
  protein: 95,
  proteinTarget: 120,
  carbs: 210,
  carbsTarget: 250,
  fat: 60,
  fatTarget: 67,
};

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  pending: { label: "Bekliyor", variant: "outline" },
  approved: { label: "Onaylandi", variant: "default" },
  rejected: { label: "Reddedildi", variant: "secondary" },
};

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = Math.min(Math.round((value / target) * 100), 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}g / {target}g</span>
      </div>
      <Progress value={pct} className={color} />
    </div>
  );
}

export function PatientNutritionTab({
  meals = defaultMeals,
  summary = defaultSummary,
  onApproveMeal,
  onRejectMeal,
}: PatientNutritionTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gunun Ogunleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Utensils className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {MEAL_TYPE_LABELS[meal.type] ?? meal.type}
                    </span>
                    <Badge variant={statusBadge[meal.status].variant} className="text-xs">
                      {statusBadge[meal.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {meal.foods.join(", ")}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    <Clock className="mr-1 inline h-3 w-3" />
                    {meal.time} &middot; {meal.calories} kcal
                  </span>
                </div>
                {meal.status === "pending" && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600"
                      onClick={() => onApproveMeal?.(meal.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => onRejectMeal?.(meal.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gunluk Ozet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{summary.calories}</p>
              <p className="text-sm text-muted-foreground">
                / {summary.calorieTarget} kcal
              </p>
            </div>
            <MacroBar label="Protein" value={summary.protein} target={summary.proteinTarget} color="" />
            <MacroBar label="Karbonhidrat" value={summary.carbs} target={summary.carbsTarget} color="" />
            <MacroBar label="Yag" value={summary.fat} target={summary.fatTarget} color="" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
