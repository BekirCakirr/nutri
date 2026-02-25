import { Button } from "@/components/ui/button";
import {
  Utensils,
  Scale,
  ClipboardList,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import type { ElementType } from "react";

interface Prompt {
  id: string;
  label: string;
  text: string;
  icon: ElementType;
}

interface AiPromptButtonsProps {
  onSelect?: (text: string) => void;
  prompts?: Prompt[];
}

const defaultPrompts: Prompt[] = [
  { id: "1", label: "Ogun Onerisi", text: "Bu hasta icin saglikli bir ogle yemegi oner.", icon: Utensils },
  { id: "2", label: "Kilo Analizi", text: "Hastanin kilo trendini analiz et ve onerilerde bulun.", icon: Scale },
  { id: "3", label: "Plan Olustur", text: "Bu hastanin hedefine uygun haftalik beslenme plani olustur.", icon: ClipboardList },
  { id: "4", label: "Ilerleme Raporu", text: "Hastanin son 1 aylik ilerlemesini ozetle.", icon: TrendingUp },
];

export function AiPromptButtons({
  onSelect,
  prompts = defaultPrompts,
}: AiPromptButtonsProps) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        Hizli Sorular
      </p>
      <div className="grid grid-cols-2 gap-2">
        {prompts.map((p) => (
          <Button
            key={p.id}
            variant="outline"
            size="sm"
            className="justify-start text-xs h-auto py-2"
            onClick={() => onSelect?.(p.text)}
          >
            <p.icon className="mr-2 h-3.5 w-3.5 shrink-0" />
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
