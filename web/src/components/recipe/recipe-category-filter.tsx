import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecipeCategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function RecipeCategoryFilter({
  categories,
  selected,
  onSelect,
}: RecipeCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={selected === cat ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(cat)}
          className={cn("text-xs")}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
