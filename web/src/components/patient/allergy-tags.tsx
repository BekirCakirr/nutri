import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AllergyTagsProps {
  allergies: string[];
  className?: string;
}

const allergyColors: Record<string, string> = {
  gluten: "bg-amber-100 text-amber-800 border-amber-200",
  laktoz: "bg-blue-100 text-blue-800 border-blue-200",
  fistik: "bg-red-100 text-red-800 border-red-200",
  yumurta: "bg-yellow-100 text-yellow-800 border-yellow-200",
  soya: "bg-green-100 text-green-800 border-green-200",
  balik: "bg-cyan-100 text-cyan-800 border-cyan-200",
  kabuklu: "bg-orange-100 text-orange-800 border-orange-200",
  sut: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

const defaultColor = "bg-gray-100 text-gray-800 border-gray-200";

export function AllergyTags({ allergies, className }: AllergyTagsProps) {
  if (allergies.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {allergies.map((allergy) => (
        <Badge
          key={allergy}
          variant="outline"
          className={cn(
            "text-xs",
            allergyColors[allergy.toLowerCase()] ?? defaultColor,
          )}
        >
          {allergy}
        </Badge>
      ))}
    </div>
  );
}
