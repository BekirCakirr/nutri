import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatarUrl?: string;
  online?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function ConversationItem({
  name,
  lastMessage,
  time,
  unreadCount,
  online = false,
  isActive = false,
  onClick,
}: ConversationItemProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50",
        isActive && "bg-muted",
      )}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold truncate">{name}</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {time}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{lastMessage}</p>
      </div>

      {unreadCount > 0 && (
        <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-xs">
          {unreadCount}
        </Badge>
      )}
    </button>
  );
}
