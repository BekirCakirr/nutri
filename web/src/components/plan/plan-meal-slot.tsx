import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PlanMealSlotProps {
  mealType: string;
  children?: ReactNode;
  onAddFood?: () => void;
}

export function PlanMealSlot({ mealType, children, onAddFood }: PlanMealSlotProps) {
  return (
    <div className="rounded-lg border p-2 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {mealType}
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddFood}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
