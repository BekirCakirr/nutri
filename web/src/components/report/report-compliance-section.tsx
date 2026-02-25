import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

interface ComplianceMetric {
  label: string;
  value: number;
  target: number;
}

interface ReportComplianceSectionProps {
  overall?: number;
  metrics?: ComplianceMetric[];
}

const defaultMetrics: ComplianceMetric[] = [
  { label: "Kahvalti Uyumu", value: 92, target: 100 },
  { label: "Ogle Yemegi Uyumu", value: 78, target: 100 },
  { label: "Aksam Yemegi Uyumu", value: 65, target: 100 },
  { label: "Ara Ogun Uyumu", value: 70, target: 100 },
  { label: "Su Tuketimi Uyumu", value: 85, target: 100 },
  { label: "Kalori Hedefi Uyumu", value: 80, target: 100 },
];

export function ReportComplianceSection({
  overall = 78,
  metrics = defaultMetrics,
}: ReportComplianceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Uyum Metrikleri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold">%{overall}</p>
            <p className="text-sm text-muted-foreground">Genel Uyum</p>
          </div>
          {overall >= 70 ? (
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          ) : (
            <XCircle className="h-8 w-8 text-red-600" />
          )}
        </div>

        <div className="space-y-3">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{m.label}</span>
                <span className="font-medium">%{m.value}</span>
              </div>
              <Progress value={m.value} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
