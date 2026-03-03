import { Button } from "@/components/ui/button";

interface NotificationFiltersProps {
  selected: string;
  onSelect: (type: string) => void;
}

const filterOptions = [
  { value: "all", label: "Tumu" },
  { value: "appointment", label: "Randevular" },
  { value: "meal", label: "Ogunler" },
  { value: "message", label: "Mesajlar" },
  { value: "plan", label: "Planlar" },
  { value: "review", label: "Degerlendirmeler" },
  { value: "system", label: "Sistem" },
];

export function NotificationFilters({ selected, onSelect }: NotificationFiltersProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {filterOptions.map((opt) => (
        <Button
          key={opt.value}
          variant={selected === opt.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(opt.value)}
          className="text-xs"
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
