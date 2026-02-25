import { Card, CardContent } from "@/components/ui/card";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: ElementType;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: AdminStatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-start justify-between p-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-green-600" : "text-red-600",
              )}
            >
              {trend.positive ? "+" : ""}{trend.value}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
