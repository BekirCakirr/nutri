import {
  CalendarCheck,
  Utensils,
  FileText,
  MessageSquare,
  Bell,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElementType } from "react";

interface NotificationItemProps {
  type: "appointment" | "meal" | "plan" | "message" | "system" | "review";
  title: string;
  description: string;
  time: string;
  read: boolean;
  onClick?: () => void;
}

const iconMap: Record<string, ElementType> = {
  appointment: CalendarCheck,
  meal: Utensils,
  plan: FileText,
  message: MessageSquare,
  system: Bell,
  review: Star,
};

const colorMap: Record<string, string> = {
  appointment: "bg-purple-100 text-purple-600",
  meal: "bg-green-100 text-green-600",
  plan: "bg-blue-100 text-blue-600",
  message: "bg-yellow-100 text-yellow-600",
  system: "bg-gray-100 text-gray-600",
  review: "bg-orange-100 text-orange-600",
};

export function NotificationItem({
  type,
  title,
  description,
  time,
  read,
  onClick,
}: NotificationItemProps) {
  const Icon = iconMap[type] ?? Bell;
  const color = colorMap[type] ?? "bg-gray-100 text-gray-600";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50",
        !read && "bg-primary/5",
      )}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("text-sm truncate", !read && "font-semibold")}>{title}</p>
          {!read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
      </div>
    </button>
  );
}
