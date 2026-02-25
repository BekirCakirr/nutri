import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  text: string;
  time: string;
  variant: "sent" | "received";
}

export function ChatBubble({ text, time, variant }: ChatBubbleProps) {
  const isSent = variant === "sent";

  return (
    <div className={cn("flex", isSent ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2",
          isSent
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted rounded-bl-md",
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{text}</p>
        <p
          className={cn(
            "mt-1 text-xs",
            isSent ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {time}
        </p>
      </div>
    </div>
  );
}
