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

interface AddPatientFormData {
  name: string;
  email: string;
  phone: string;
  goal: string;
  weight: string;
  height: string;
}

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: AddPatientFormData) => void;
}

const goalOptions = [
  { value: "weight_loss", label: "Kilo Verme" },
  { value: "weight_gain", label: "Kilo Alma" },
  { value: "maintenance", label: "Kilo Koruma" },
  { value: "muscle_gain", label: "Kas Kazanimi" },
  { value: "health", label: "Saglikli Beslenme" },
];

export function AddPatientDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddPatientDialogProps) {
  const [form, setForm] = useState<AddPatientFormData>({
    name: "",
    email: "",
    phone: "",
    goal: "",
    weight: "",
    height: "",
  });

  function handleChange(field: keyof AddPatientFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    onSubmit?.(form);
    setForm({ name: "", email: "", phone: "", goal: "", weight: "", height: "" });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Hasta Ekle</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input
              id="name"
              placeholder="Hasta adi"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="hasta@email.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="05XX XXX XX XX"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Hedef</Label>
            <Select value={form.goal} onValueChange={(v) => handleChange("goal", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Hedef secin" />
              </SelectTrigger>
              <SelectContent>
                {goalOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="weight">Kilo (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={form.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="height">Boy (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={form.height}
                onChange={(e) => handleChange("height", e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Iptal
          </Button>
          <Button onClick={handleSubmit}>Hasta Ekle</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
