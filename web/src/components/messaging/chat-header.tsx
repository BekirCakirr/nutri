import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video, MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  online?: boolean;
  lastSeen?: string;
  onVideoCall?: () => void;
  onMore?: () => void;
}

export function ChatHeader({
  name,
  online = false,
  lastSeen,
  onVideoCall,
  onMore,
}: ChatHeaderProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
          )}
        </div>
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">
            {online ? "Cevrimici" : lastSeen ?? "Cevrimdisi"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onVideoCall}>
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onMore}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
