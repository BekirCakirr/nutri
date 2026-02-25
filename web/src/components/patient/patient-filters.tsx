import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface PatientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  goalType: string;
  onGoalTypeChange: (value: string) => void;
  onClear?: () => void;
}

const statusOptions = [
  { value: "all", label: "Tum Durumlar" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Pasif" },
  { value: "new", label: "Yeni" },
];

const goalOptions = [
  { value: "all", label: "Tum Hedefler" },
  { value: "weight_loss", label: "Kilo Verme" },
  { value: "weight_gain", label: "Kilo Alma" },
  { value: "maintenance", label: "Kilo Koruma" },
  { value: "muscle_gain", label: "Kas Kazanimi" },
  { value: "health", label: "Saglikli Beslenme" },
];

export function PatientFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  goalType,
  onGoalTypeChange,
  onClear,
}: PatientFiltersProps) {
  const hasFilters = search || status !== "all" || goalType !== "all";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Hasta ara..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={goalType} onValueChange={onGoalTypeChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Hedef" />
        </SelectTrigger>
        <SelectContent>
          {goalOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && onClear && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-1 h-4 w-4" />
          Temizle
        </Button>
      )}
    </div>
  );
}
