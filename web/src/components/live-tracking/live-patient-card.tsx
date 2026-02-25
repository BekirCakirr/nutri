import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LiveStatusIndicator } from "./live-status-indicator";
import { LiveCalorieProgress } from "./live-calorie-progress";

interface LivePatientCardProps {
  name: string;
  status: "online" | "offline" | "eating";
  caloriesConsumed: number;
  calorieTarget: number;
  lastMeal?: string;
  lastMealTime?: string;
  onClick?: () => void;
}

export function LivePatientCard({
  name,
  status,
  caloriesConsumed,
  calorieTarget,
  lastMeal,
  lastMealTime,
  onClick,
}: LivePatientCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <LiveStatusIndicator status={status} className="absolute -bottom-0.5 -right-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{name}</p>
            <p className="text-xs text-muted-foreground">
              {status === "online"
                ? "Cevrimici"
                : status === "eating"
                  ? "Ogun kaydediyor..."
                  : "Cevrimdisi"}
            </p>
          </div>
        </div>

        <LiveCalorieProgress consumed={caloriesConsumed} target={calorieTarget} />

        {lastMeal && (
          <p className="text-xs text-muted-foreground">
            Son ogun: {lastMeal} ({lastMealTime})
          </p>
        )}
      </CardContent>
    </Card>
  );
}
