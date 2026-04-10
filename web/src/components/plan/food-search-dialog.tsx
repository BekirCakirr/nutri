import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2 } from "lucide-react";
import { searchFoods } from "@/services/food.service";

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

export function FoodSearchDialog({ open, onOpenChange, onSelect }: FoodSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setFoods([]);
      return;
    }
    // Load popular foods on open
    setLoading(true);
    searchFoods("").then((results) => {
      setFoods(results.map(mapToFoodItem));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      setLoading(true);
      searchFoods(query).then((results) => {
        setFoods(results.map(mapToFoodItem));
        setLoading(false);
      }).catch(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, open]);

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
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && foods.map((food) => (
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
          {!loading && foods.length === 0 && (
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

function mapToFoodItem(f: any): FoodItem {
  return {
    id: String(f.id),
    name: f.name || "",
    calories: Math.round(f.caloriesPer100g ?? f.calories ?? 0),
    protein: Math.round((f.proteinPer100g ?? f.protein ?? 0) * 10) / 10,
    carbs: Math.round((f.carbsPer100g ?? f.carbs ?? 0) * 10) / 10,
    fat: Math.round((f.fatPer100g ?? f.fat ?? 0) * 10) / 10,
    portion: f.servingDescription || f.portion || "100g",
  };
}
