import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
}

interface AdminFoodTableProps {
  foods?: FoodItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const defaultFoods: FoodItem[] = [
  { id: "1", name: "Tavuk Gogsu (Izgara)", category: "Et", calories: 165, protein: 31, carbs: 0, fat: 3.6, portion: "100g" },
  { id: "2", name: "Bulgur Pilavi", category: "Tahil", calories: 83, protein: 3, carbs: 18, fat: 0.2, portion: "100g" },
  { id: "3", name: "Yumurta (Haslanmis)", category: "Protein", calories: 155, protein: 13, carbs: 1.1, fat: 11, portion: "1 adet" },
  { id: "4", name: "Beyaz Peynir", category: "Sut Urunleri", calories: 264, protein: 18, carbs: 3, fat: 21, portion: "100g" },
  { id: "5", name: "Yesil Salata", category: "Sebze", calories: 15, protein: 1, carbs: 2.9, fat: 0.2, portion: "1 porsiyon" },
];

export function AdminFoodTable({
  foods = defaultFoods,
  onEdit,
  onDelete,
}: AdminFoodTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Yiyecek</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Kalori</TableHead>
            <TableHead className="text-right">Protein</TableHead>
            <TableHead className="text-right">Karb.</TableHead>
            <TableHead className="text-right">Yag</TableHead>
            <TableHead>Porsiyon</TableHead>
            <TableHead className="w-[100px]">Islemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="font-medium">{f.name}</TableCell>
              <TableCell className="text-muted-foreground">{f.category}</TableCell>
              <TableCell className="text-right">{f.calories}</TableCell>
              <TableCell className="text-right">{f.protein}g</TableCell>
              <TableCell className="text-right">{f.carbs}g</TableCell>
              <TableCell className="text-right">{f.fat}g</TableCell>
              <TableCell className="text-muted-foreground">{f.portion}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit?.(f.id)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete?.(f.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
