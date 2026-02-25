import type { MouseEventHandler } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientCardProps {
  id: string;
  name: string;
  age: number;
  goal: string;
  adherence: number;
  lastActivity: string;
  avatarUrl?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAdherenceColor(adherence: number): string {
  if (adherence >= 80) return "text-green-600";
  if (adherence >= 50) return "text-yellow-600";
  return "text-red-600";
}

export function PatientCard({
  name,
  age,
  goal,
  adherence,
  lastActivity,
  avatarUrl,
  onClick,
  className,
}: PatientCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-shadow hover:shadow-md",
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          {avatarUrl && (
            <img src={avatarUrl} alt={name} className="object-cover" />
          )}
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{name}</p>
          <p className="text-sm text-muted-foreground">
            {age} yas &middot; {goal}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <Badge variant="outline" className={getAdherenceColor(adherence)}>
            <Activity className="mr-1 h-3 w-3" />
            %{adherence} uyum
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {lastActivity}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
