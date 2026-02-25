import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FoodFormData {
  name: string;
  category: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  portion: string;
}

interface AdminFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: FoodFormData) => void;
  initialData?: Partial<FoodFormData>;
  mode?: "add" | "edit";
}

const categories = ["Et", "Balik", "Sut Urunleri", "Sebze", "Meyve", "Tahil", "Baklagil", "Yag", "Protein", "Icecek", "Diger"];

export function AdminFoodDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = "add",
}: AdminFoodDialogProps) {
  const [form, setForm] = useState<FoodFormData>({
    name: initialData?.name ?? "",
    category: initialData?.category ?? "",
    calories: initialData?.calories ?? "",
    protein: initialData?.protein ?? "",
    carbs: initialData?.carbs ?? "",
    fat: initialData?.fat ?? "",
    portion: initialData?.portion ?? "",
  });

  function handleChange(field: keyof FoodFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    onSubmit?.(form);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Yeni Yiyecek Ekle" : "Yiyecegi Duzenle"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="food-name">Yiyecek Adi</Label>
            <Input id="food-name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Kategori</Label>
            <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
              <SelectTrigger><SelectValue placeholder="Kategori secin" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="food-cal">Kalori</Label>
              <Input id="food-cal" type="number" value={form.calories} onChange={(e) => handleChange("calories", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="food-portion">Porsiyon</Label>
              <Input id="food-portion" value={form.portion} onChange={(e) => handleChange("portion", e.target.value)} placeholder="Orn: 100g" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="food-protein">Protein (g)</Label>
              <Input id="food-protein" type="number" value={form.protein} onChange={(e) => handleChange("protein", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="food-carbs">Karb. (g)</Label>
              <Input id="food-carbs" type="number" value={form.carbs} onChange={(e) => handleChange("carbs", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="food-fat">Yag (g)</Label>
              <Input id="food-fat" type="number" value={form.fat} onChange={(e) => handleChange("fat", e.target.value)} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Iptal</Button>
          <Button onClick={handleSubmit}>{mode === "add" ? "Ekle" : "Kaydet"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
