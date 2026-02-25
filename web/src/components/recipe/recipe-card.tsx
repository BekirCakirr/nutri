import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  title: string;
  calories: number;
  time: number;
  difficulty: "kolay" | "orta" | "zor";
  category?: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

const difficultyColors: Record<string, string> = {
  kolay: "bg-green-100 text-green-800",
  orta: "bg-yellow-100 text-yellow-800",
  zor: "bg-red-100 text-red-800",
};

const difficultyLabels: Record<string, string> = {
  kolay: "Kolay",
  orta: "Orta",
  zor: "Zor",
};

export function RecipeCard({
  title,
  calories,
  time,
  difficulty,
  category,
  imageUrl,
  onClick,
  className,
}: RecipeCardProps) {
  return (
    <Card
      className={cn("cursor-pointer overflow-hidden transition-shadow hover:shadow-md", className)}
      onClick={onClick}
    >
      <div className="h-40 bg-muted flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <ChefHat className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>
        {category && (
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Flame className="h-3 w-3" />
            {calories} kcal
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {time} dk
          </span>
          <Badge variant="outline" className={cn("text-xs", difficultyColors[difficulty])}>
            {difficultyLabels[difficulty]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
