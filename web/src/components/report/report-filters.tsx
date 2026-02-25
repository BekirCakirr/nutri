import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ReportFiltersProps {
  patientId: string;
  onPatientChange: (id: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  metrics: string[];
  onMetricsChange: (metrics: string[]) => void;
  patients?: { id: string; name: string }[];
}

const defaultPatients = [
  { id: "all", name: "Tum Hastalar" },
  { id: "1", name: "Ayse Yilmaz" },
  { id: "2", name: "Mehmet Kaya" },
  { id: "3", name: "Fatma Demir" },
];

const metricOptions = [
  { id: "calories", label: "Kalori" },
  { id: "macros", label: "Makrolar" },
  { id: "weight", label: "Kilo" },
  { id: "water", label: "Su Tuketimi" },
  { id: "adherence", label: "Uyum Orani" },
  { id: "meals", label: "Ogun Kayitlari" },
];

export function ReportFilters({
  patientId,
  onPatientChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  metrics,
  onMetricsChange,
  patients = defaultPatients,
}: ReportFiltersProps) {
  function toggleMetric(id: string) {
    if (metrics.includes(id)) {
      onMetricsChange(metrics.filter((m) => m !== id));
    } else {
      onMetricsChange([...metrics, id]);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label>Hasta</Label>
          <Select value={patientId} onValueChange={onPatientChange}>
            <SelectTrigger>
              <SelectValue placeholder="Hasta secin" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="start-date">Baslangic Tarihi</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="end-date">Bitis Tarihi</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Metrikler</Label>
        <div className="flex flex-wrap gap-4">
          {metricOptions.map((opt) => (
            <label key={opt.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={metrics.includes(opt.id)}
                onCheckedChange={() => toggleMetric(opt.id)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
