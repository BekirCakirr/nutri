import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GoalBadgeProps {
  goalType: string;
  className?: string;
}

const goalConfig: Record<string, { label: string; color: string }> = {
  weight_loss: { label: "Kilo Verme", color: "bg-red-100 text-red-800 border-red-200" },
  weight_gain: { label: "Kilo Alma", color: "bg-blue-100 text-blue-800 border-blue-200" },
  maintenance: { label: "Kilo Koruma", color: "bg-green-100 text-green-800 border-green-200" },
  muscle_gain: { label: "Kas Kazanimi", color: "bg-purple-100 text-purple-800 border-purple-200" },
  health: { label: "Saglikli Beslenme", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

export function GoalBadge({ goalType, className }: GoalBadgeProps) {
  const config = goalConfig[goalType] ?? { label: goalType, color: "bg-gray-100 text-gray-800 border-gray-200" };

  return (
    <Badge variant="outline" className={cn("text-xs", config.color, className)}>
      {config.label}
    </Badge>
  );
}
