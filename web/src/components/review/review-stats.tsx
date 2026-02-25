import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface ReviewStatsProps {
  average?: number;
  total?: number;
  distribution?: Record<number, number>;
}

const defaultDistribution: Record<number, number> = {
  5: 45,
  4: 28,
  3: 15,
  2: 8,
  1: 4,
};

export function ReviewStats({
  average = 4.3,
  total = 86,
  distribution = defaultDistribution,
}: ReviewStatsProps) {
  const maxCount = Math.max(...Object.values(distribution));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Degerlendirme Istatistikleri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold">{average.toFixed(1)}</p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(average) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{total} degerlendirme</p>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] ?? 0;
              const pct = maxCount > 0 ? (count / total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3 text-right">{star}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <Progress value={pct} className="flex-1 h-2" />
                  <span className="w-8 text-right text-xs text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
