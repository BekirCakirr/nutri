import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LiveCalorieProgressProps {
  consumed: number;
  target: number;
  className?: string;
}

export function LiveCalorieProgress({
  consumed,
  target,
  className,
}: LiveCalorieProgressProps) {
  const pct = target > 0 ? Math.min(Math.round((consumed / target) * 100), 100) : 0;
  const overTarget = consumed > target;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Kalori</span>
        <span className={cn("font-medium", overTarget && "text-red-600")}>
          {consumed} / {target} kcal
        </span>
      </div>
      <Progress
        value={pct}
        className={cn(overTarget && "[&>div]:bg-red-500")}
      />
      <p className="text-xs text-right text-muted-foreground">%{pct}</p>
    </div>
  );
}
