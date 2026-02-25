import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ShoppingItemProps {
  name: string;
  quantity: string;
  checked: boolean;
  onToggle?: () => void;
}

export function ShoppingItem({ name, quantity, checked, onToggle }: ShoppingItemProps) {
  return (
    <label className="flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors">
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <span className={cn("flex-1 text-sm", checked && "line-through text-muted-foreground")}>
        {name}
      </span>
      <span className={cn("text-xs text-muted-foreground", checked && "line-through")}>
        {quantity}
      </span>
    </label>
  );
}
