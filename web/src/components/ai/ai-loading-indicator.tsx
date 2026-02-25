import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiLoadingIndicatorProps {
  text?: string;
  className?: string;
}

export function AiLoadingIndicator({
  text = "NutriAI dusunuyor...",
  className,
}: AiLoadingIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl bg-muted px-4 py-3", className)}>
      <Sparkles className="h-4 w-4 animate-pulse text-purple-500" />
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted-foreground">{text}</span>
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  );
}
