import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
}

interface FoodSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (food: FoodItem, portion: string) => void;
}

const mockFoods: FoodItem[] = [
  { id: "1", name: "Tavuk Gogsu (Izgara)", calories: 165, protein: 31, carbs: 0, fat: 3.6, portion: "100g" },
  { id: "2", name: "Bulgur Pilavi", calories: 83, protein: 3, carbs: 18, fat: 0.2, portion: "100g" },
  { id: "3", name: "Yumurta (Haslanmis)", calories: 155, protein: 13, carbs: 1.1, fat: 11, portion: "1 adet" },
  { id: "4", name: "Tam Bugday Ekmek", calories: 247, protein: 13, carbs: 41, fat: 3.4, portion: "1 dilim" },
  { id: "5", name: "Beyaz Peynir", calories: 264, protein: 18, carbs: 3, fat: 21, portion: "100g" },
  { id: "6", name: "Yesil Salata", calories: 15, protein: 1, carbs: 2.9, fat: 0.2, portion: "1 porsiyon" },
  { id: "7", name: "Mercimek Corbasi", calories: 116, protein: 7, carbs: 20, fat: 0.4, portion: "1 kase" },
  { id: "8", name: "Yogurt (Sade)", calories: 63, protein: 5, carbs: 4.7, fat: 3.3, portion: "1 kase" },
];

export function FoodSearchDialog({ open, onOpenChange, onSelect }: FoodSearchDialogProps) {
  const [query, setQuery] = useState("");

  const filtered = mockFoods.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Yiyecek Ara</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Yiyecek adi yazin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1">
          {filtered.map((food) => (
            <div
              key={food.id}
              className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{food.name}</p>
                <p className="text-xs text-muted-foreground">
                  {food.calories} kcal &middot; P: {food.protein}g &middot; K: {food.carbs}g &middot; Y: {food.fat}g
                </p>
                <p className="text-xs text-muted-foreground">{food.portion}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onSelect?.(food, food.portion);
                  onOpenChange(false);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Sonuc bulunamadi.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
