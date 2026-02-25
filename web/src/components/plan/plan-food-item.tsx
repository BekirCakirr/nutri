import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PlanFoodItemProps {
  name: string;
  portion: string;
  calories: number;
  onRemove?: () => void;
}

export function PlanFoodItem({ name, portion, calories, onRemove }: PlanFoodItemProps) {
  return (
    <div className="flex items-center gap-2 rounded bg-muted/50 px-2 py-1 text-xs">
      <div className="flex-1 min-w-0">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground"> &middot; {portion}</span>
      </div>
      <span className="text-muted-foreground whitespace-nowrap">{calories} kcal</span>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
