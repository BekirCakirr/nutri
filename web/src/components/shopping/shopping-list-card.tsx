import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShoppingListCardProps {
  title: string;
  totalItems: number;
  completedItems: number;
  date: string;
  onClick?: () => void;
  className?: string;
}

export function ShoppingListCard({
  title,
  totalItems,
  completedItems,
  date,
  onClick,
  className,
}: ShoppingListCardProps) {
  const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <Card
      className={cn("cursor-pointer transition-shadow hover:shadow-md", className)}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <ShoppingCart className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{title}</p>
          <p className="text-xs text-muted-foreground">
            {completedItems}/{totalItems} urun &middot; {date}
          </p>
          <Progress value={pct} className="mt-2 h-1.5" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">%{pct}</span>
      </CardContent>
    </Card>
  );
}
