import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, CalendarRange, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElementType } from "react";

interface ReportType {
  id: string;
  label: string;
  description: string;
  icon: ElementType;
}

interface ReportTypeSelectorProps {
  selected?: string;
  onSelect?: (typeId: string) => void;
}

const reportTypes: ReportType[] = [
  { id: "weekly", label: "Haftalik Rapor", description: "Son 7 gunluk beslenme ve ilerleme ozeti", icon: CalendarDays },
  { id: "monthly", label: "Aylik Rapor", description: "Aylik detayli analiz ve karsilastirma", icon: CalendarRange },
  { id: "custom", label: "Ozel Rapor", description: "Belirli tarih araligi ve metriklerle rapor", icon: FileText },
];

export function ReportTypeSelector({ selected, onSelect }: ReportTypeSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {reportTypes.map((type) => {
        const Icon = type.icon;
        const isActive = selected === type.id;
        return (
          <Card
            key={type.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              isActive && "ring-2 ring-primary",
            )}
            onClick={() => onSelect?.(type.id)}
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-semibold">{type.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{type.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
