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

interface CreateShoppingListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: { title: string; source: string }) => void;
}

export function CreateShoppingListDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateShoppingListDialogProps) {
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");

  function handleSubmit() {
    onSubmit?.({ title, source });
    setTitle("");
    setSource("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Alisveris Listesi</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="list-title">Liste Adi</Label>
            <Input
              id="list-title"
              placeholder="Orn: Haftalik alisveris"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Kaynak</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue placeholder="Liste kaynagi secin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manuel Olustur</SelectItem>
                <SelectItem value="plan">Beslenme Planindan</SelectItem>
                <SelectItem value="recipe">Tariflerden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Iptal
          </Button>
          <Button onClick={handleSubmit}>Olustur</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
