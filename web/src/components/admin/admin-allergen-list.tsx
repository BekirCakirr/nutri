import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Allergen {
  id: string;
  name: string;
  count: number;
}

interface AdminAllergenListProps {
  allergens?: Allergen[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const defaultAllergens: Allergen[] = [
  { id: "1", name: "Gluten", count: 12 },
  { id: "2", name: "Laktoz", count: 18 },
  { id: "3", name: "Fistik", count: 8 },
  { id: "4", name: "Yumurta", count: 5 },
  { id: "5", name: "Soya", count: 3 },
  { id: "6", name: "Balik", count: 7 },
  { id: "7", name: "Kabuklu Deniz Urunleri", count: 4 },
  { id: "8", name: "Sut", count: 15 },
];

export function AdminAllergenList({
  allergens = defaultAllergens,
  onAdd,
  onEdit,
  onDelete,
}: AdminAllergenListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Alerjenler</CardTitle>
        <Button size="sm" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Ekle
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {allergens.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{a.name}</span>
              <Badge variant="secondary" className="text-xs">{a.count} hasta</Badge>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(a.id)}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete?.(a.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
