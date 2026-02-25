import { Card, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface QrCodeDisplayProps {
  code: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-24 w-24",
  md: "h-40 w-40",
  lg: "h-56 w-56",
};

const iconSize = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-24 w-24",
};

export function QrCodeDisplay({ code, size = "md", className }: QrCodeDisplayProps) {
  return (
    <Card className={cn("inline-block", className)}>
      <CardContent className="p-4 flex flex-col items-center gap-2">
        <div
          className={cn(
            "flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50",
            sizeMap[size],
          )}
        >
          <QrCode className={cn("text-muted-foreground", iconSize[size])} />
        </div>
        <code className="text-xs font-mono text-muted-foreground">{code}</code>
      </CardContent>
    </Card>
  );
}
