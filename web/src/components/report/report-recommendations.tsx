import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import type { ElementType } from "react";

interface Recommendation {
  id: string;
  type: "success" | "warning" | "suggestion";
  text: string;
}

interface ReportRecommendationsProps {
  recommendations?: Recommendation[];
}

const iconMap: Record<string, ElementType> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  suggestion: Lightbulb,
};

const colorMap: Record<string, string> = {
  success: "bg-green-100 text-green-600",
  warning: "bg-yellow-100 text-yellow-600",
  suggestion: "bg-blue-100 text-blue-600",
};

const defaultRecommendations: Recommendation[] = [
  { id: "1", type: "success", text: "Protein alimi hedefle uyumlu. Bu seviyeyi korumaya devam edin." },
  { id: "2", type: "warning", text: "Aksam yemeklerinde kalori asimi gorulmektedir. Porsiyon kontrolune dikkat edilmeli." },
  { id: "3", type: "suggestion", text: "Su tuketimini artirmak icin sabah kalktiktan sonra bir bardak su icmeyi aliskanlik haline getirin." },
  { id: "4", type: "suggestion", text: "Ara ogunlere meyve ve kuruyemis eklenmesi ogun arasi acilik hissini azaltabilir." },
  { id: "5", type: "warning", text: "Hafta sonu kalori alimi hafta icine gore %15 daha yuksek. Tutarlilik onemli." },
];

export function ReportRecommendations({
  recommendations = defaultRecommendations,
}: ReportRecommendationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-purple-500" />
          AI Onerileri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => {
          const Icon = iconMap[rec.type];
          const color = colorMap[rec.type];
          return (
            <div key={rec.id} className="flex gap-3 rounded-lg border p-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm">{rec.text}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
