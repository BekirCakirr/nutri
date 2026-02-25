import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface PatientOption {
  id: string;
  name: string;
  goal: string;
}

interface PlanPatientSelectorProps {
  patients?: PatientOption[];
  value?: string;
  onSelect?: (patientId: string) => void;
}

const defaultPatients: PatientOption[] = [
  { id: "1", name: "Ayse Yilmaz", goal: "Kilo Verme" },
  { id: "2", name: "Mehmet Kaya", goal: "Kas Kazanimi" },
  { id: "3", name: "Fatma Demir", goal: "Saglikli Beslenme" },
  { id: "4", name: "Ali Celik", goal: "Kilo Verme" },
];

export function PlanPatientSelector({
  patients = defaultPatients,
  value,
  onSelect,
}: PlanPatientSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Hasta secin..." />
        </SelectTrigger>
        <SelectContent>
          {patients.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {p.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.goal}</p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
