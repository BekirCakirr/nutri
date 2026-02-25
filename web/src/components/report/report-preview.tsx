import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ReportPreviewProps {
  title?: string;
  patientName?: string;
  dateRange?: string;
  summary?: string;
  sections?: { title: string; content: string }[];
}

const defaultSections = [
  { title: "Beslenme Ozeti", content: "Gunluk ortalama 1850 kcal alinmis. Hedef: 2000 kcal. Protein alimi yeterli, karbonhidrat alimi hedefin altinda." },
  { title: "Kilo Degisimi", content: "Baslangic: 78.5 kg, Son: 77.2 kg. Toplam 1.3 kg kayip. Hedeflenen hiz ile uyumlu." },
  { title: "Uyum Orani", content: "Genel uyum: %78. Kahvalti uyumu en yuksek (%92), aksam yemegi uyumu en dusuk (%65)." },
];

export function ReportPreview({
  title = "Haftalik Beslenme Raporu",
  patientName = "Ayse Yilmaz",
  dateRange = "17 - 23 Subat 2026",
  summary = "Bu rapor hastanin haftalik beslenme ve ilerleme verilerini icermektedir.",
  sections = defaultSections,
}: ReportPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {patientName} &middot; {dateRange}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{summary}</p>
        <Separator />
        {sections.map((section, i) => (
          <div key={i} className="space-y-1">
            <h4 className="text-sm font-semibold">{section.title}</h4>
            <p className="text-sm text-muted-foreground">{section.content}</p>
            {i < sections.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
