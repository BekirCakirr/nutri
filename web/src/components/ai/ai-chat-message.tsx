import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiChatMessageProps {
  role: "user" | "assistant";
  content: string;
  time?: string;
}

export function AiChatMessage({ role, content, time }: AiChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div className={cn("flex gap-3", isAssistant ? "" : "flex-row-reverse")}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(isAssistant ? "bg-purple-100" : "bg-primary/10")}>
          {isAssistant ? (
            <Sparkles className="h-4 w-4 text-purple-600" />
          ) : (
            <User className="h-4 w-4 text-primary" />
          )}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5",
          isAssistant
            ? "bg-muted rounded-bl-md"
            : "bg-primary text-primary-foreground rounded-br-md",
        )}
      >
        <div
          className={cn(
            "text-sm whitespace-pre-wrap prose prose-sm max-w-none",
            isAssistant ? "" : "text-primary-foreground prose-invert",
          )}
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n/g, "<br/>"),
          }}
        />
        {time && (
          <p className={cn("text-xs mt-1", isAssistant ? "text-muted-foreground" : "text-primary-foreground/70")}>
            {time}
          </p>
        )}
      </div>
    </div>
  );
}
