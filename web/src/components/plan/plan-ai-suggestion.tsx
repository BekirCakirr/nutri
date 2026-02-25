import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, X, RefreshCw } from "lucide-react";

interface MealSuggestion {
  id: string;
  mealType: string;
  foods: { name: string; portion: string; calories: number }[];
  totalCalories: number;
  reason: string;
}

interface PlanAiSuggestionProps {
  suggestions?: MealSuggestion[];
  loading?: boolean;
  onAccept?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onRefresh?: () => void;
}

const defaultSuggestions: MealSuggestion[] = [
  {
    id: "1",
    mealType: "Kahvalti",
    foods: [
      { name: "Yulaf ezmesi", portion: "50g", calories: 190 },
      { name: "Muz", portion: "1 adet", calories: 105 },
      { name: "Bal", portion: "1 tatli kasigi", calories: 64 },
    ],
    totalCalories: 359,
    reason: "Yuksek lif icerigi ile tok tutar, sabah enerjisi saglar.",
  },
  {
    id: "2",
    mealType: "Ogle Yemegi",
    foods: [
      { name: "Izgara somon", portion: "150g", calories: 280 },
      { name: "Kinoa salatasi", portion: "1 porsiyon", calories: 180 },
      { name: "Limonlu sos", portion: "1 yk", calories: 35 },
    ],
    totalCalories: 495,
    reason: "Omega-3 aciklari kapatir, protein hedefine yaklastirir.",
  },
];

export function PlanAiSuggestion({
  suggestions = defaultSuggestions,
  loading = false,
  onAccept,
  onDismiss,
  onRefresh,
}: PlanAiSuggestionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-purple-500" />
          AI Onerileri
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-pulse text-purple-500" />
              AI oneriler hazirliyor...
            </div>
          </div>
        ) : (
          suggestions.map((s) => (
            <div key={s.id} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{s.mealType}</Badge>
                <span className="text-sm font-medium">{s.totalCalories} kcal</span>
              </div>
              <div className="space-y-1">
                {s.foods.map((food, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{food.name} ({food.portion})</span>
                    <span className="text-muted-foreground">{food.calories} kcal</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">{s.reason}</p>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onAccept?.(s.id)}
                >
                  <Check className="mr-1 h-3 w-3" />
                  Kabul Et
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss?.(s.id)}
                >
                  <X className="mr-1 h-3 w-3" />
                  Reddet
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
