import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileStack } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
}

interface PlanTemplateSelectorProps {
  templates?: Template[];
  value?: string;
  onSelect?: (templateId: string) => void;
}

const defaultTemplates: Template[] = [
  { id: "1", name: "Dengeli Beslenme", description: "Standart 2000 kcal plan" },
  { id: "2", name: "Kilo Verme", description: "Dusuk kalorili diyet plani" },
  { id: "3", name: "Kilo Alma", description: "Yuksek kalorili plan" },
  { id: "4", name: "Kas Yapimi", description: "Yuksek proteinli plan" },
  { id: "5", name: "Vejetaryen", description: "Etsiz beslenme plani" },
  { id: "6", name: "Diyabet Dostu", description: "Dusuk glisemik indeks" },
];

export function PlanTemplateSelector({
  templates = defaultTemplates,
  value,
  onSelect,
}: PlanTemplateSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <FileStack className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Sablondan baslat..." />
        </SelectTrigger>
        <SelectContent>
          {templates.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
