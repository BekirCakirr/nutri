import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PlanDayColumnProps {
  dayName: string;
  totalCalories: number;
  calorieTarget?: number;
  isToday?: boolean;
  children: ReactNode;
  className?: string;
}

export function PlanDayColumn({
  dayName,
  totalCalories,
  calorieTarget = 2000,
  isToday = false,
  children,
  className,
}: PlanDayColumnProps) {
  const pct = Math.round((totalCalories / calorieTarget) * 100);
  const overTarget = totalCalories > calorieTarget;

  return (
    <Card className={cn("min-w-[200px]", isToday && "ring-2 ring-primary", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{dayName}</span>
          {isToday && (
            <span className="text-xs font-normal text-primary">Bugun</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {children}
        <div className="border-t pt-2 text-xs text-muted-foreground flex justify-between">
          <span>Toplam</span>
          <span className={cn("font-medium", overTarget && "text-red-600")}>
            {totalCalories} / {calorieTarget} kcal ({pct}%)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
