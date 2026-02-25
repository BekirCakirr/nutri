import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RecipeNutritionInfoProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export function RecipeNutritionInfo({
  calories,
  protein,
  carbs,
  fat,
  fiber,
}: RecipeNutritionInfoProps) {
  const total = protein + carbs + fat;
  const macros = [
    { label: "Protein", value: protein, pct: Math.round((protein / total) * 100), color: "text-red-600" },
    { label: "Karbonhidrat", value: carbs, pct: Math.round((carbs / total) * 100), color: "text-amber-600" },
    { label: "Yag", value: fat, pct: Math.round((fat / total) * 100), color: "text-blue-600" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Besin Degerleri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold">{calories}</p>
          <p className="text-sm text-muted-foreground">kcal / porsiyon</p>
        </div>

        <div className="space-y-3">
          {macros.map((m) => (
            <div key={m.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className={m.color}>{m.label}</span>
                <span>{m.value}g (%{m.pct})</span>
              </div>
              <Progress value={m.pct} />
            </div>
          ))}
        </div>

        {fiber !== undefined && (
          <div className="flex justify-between text-sm border-t pt-3">
            <span>Lif</span>
            <span>{fiber}g</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
