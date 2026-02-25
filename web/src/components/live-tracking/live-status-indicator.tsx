import { cn } from "@/lib/utils";

interface LiveStatusIndicatorProps {
  status: "online" | "offline" | "eating";
  className?: string;
}

const statusColors: Record<string, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  eating: "bg-orange-500",
};

export function LiveStatusIndicator({ status, className }: LiveStatusIndicatorProps) {
  return (
    <span
      className={cn(
        "block h-3 w-3 rounded-full border-2 border-background",
        statusColors[status],
        status === "eating" && "animate-pulse",
        className,
      )}
    />
  );
}
