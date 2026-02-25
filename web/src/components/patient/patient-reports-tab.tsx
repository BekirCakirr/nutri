import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Plus } from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: "weekly" | "monthly" | "custom";
  date: string;
  status: "ready" | "generating";
}

interface PatientReportsTabProps {
  reports?: Report[];
  onGenerate?: () => void;
  onDownload?: (id: string) => void;
}

const typeLabels: Record<string, string> = {
  weekly: "Haftalik",
  monthly: "Aylik",
  custom: "Ozel",
};

const defaultReports: Report[] = [
  { id: "1", title: "Haftalik Beslenme Raporu", type: "weekly", date: "24 Subat 2026", status: "ready" },
  { id: "2", title: "Aylik Ilerleme Raporu", type: "monthly", date: "1 Subat 2026", status: "ready" },
  { id: "3", title: "Ozel Analiz Raporu", type: "custom", date: "15 Ocak 2026", status: "ready" },
];

export function PatientReportsTab({
  reports = defaultReports,
  onGenerate,
  onDownload,
}: PatientReportsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Raporlar</h3>
        <Button size="sm" onClick={onGenerate}>
          <Plus className="mr-1 h-4 w-4" />
          Yeni Rapor Olustur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Olusturulan Raporlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{report.title}</p>
                <p className="text-xs text-muted-foreground">
                  {report.date} &middot;{" "}
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[report.type]}
                  </Badge>
                </p>
              </div>
              {report.status === "ready" ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDownload?.(report.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              ) : (
                <Badge variant="secondary">Hazirlaniyor...</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
