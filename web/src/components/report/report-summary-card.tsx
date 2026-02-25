import { Card, CardContent } from "@/components/ui/card";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

interface ReportSummaryCardProps {
  title: string;
  value: string;
  description?: string;
  icon: ElementType;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const trendColors: Record<string, string> = {
  up: "text-green-600",
  down: "text-red-600",
  neutral: "text-muted-foreground",
};

export function ReportSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  trend = "neutral",
  className,
}: ReportSummaryCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={cn("text-xl font-bold", trendColors[trend])}>{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
