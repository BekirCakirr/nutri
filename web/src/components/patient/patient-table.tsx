import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  goal: string;
  adherence: number;
  status: "active" | "inactive" | "new";
  lastActivity: string;
}

interface PatientTableProps {
  patients?: Patient[];
  pageSize?: number;
  onRowClick?: (id: string) => void;
}

const defaultPatients: Patient[] = [
  { id: "1", name: "Ayse Yilmaz", email: "ayse@email.com", age: 28, goal: "Kilo Verme", adherence: 85, status: "active", lastActivity: "2 saat once" },
  { id: "2", name: "Mehmet Kaya", email: "mehmet@email.com", age: 35, goal: "Kas Kazanimi", adherence: 72, status: "active", lastActivity: "1 gun once" },
  { id: "3", name: "Fatma Demir", email: "fatma@email.com", age: 42, goal: "Saglikli Beslenme", adherence: 91, status: "active", lastActivity: "3 saat once" },
  { id: "4", name: "Ali Celik", email: "ali@email.com", age: 31, goal: "Kilo Verme", adherence: 45, status: "inactive", lastActivity: "5 gun once" },
  { id: "5", name: "Zeynep Ozturk", email: "zeynep@email.com", age: 25, goal: "Kilo Koruma", adherence: 68, status: "new", lastActivity: "1 saat once" },
];

const statusLabels: Record<string, string> = {
  active: "Aktif",
  inactive: "Pasif",
  new: "Yeni",
};

const statusVariants: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  inactive: "secondary",
  new: "outline",
};

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function PatientTable({
  patients = defaultPatients,
  pageSize = 10,
  onRowClick,
}: PatientTableProps) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<keyof Patient>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function toggleSort(key: keyof Patient) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...patients].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const cmp = typeof aVal === "string" ? aVal.localeCompare(String(bVal)) : Number(aVal) - Number(bVal);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("name")}>
                  Hasta <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("age")}>
                  Yas <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Hedef</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("adherence")}>
                  Uyum <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Son Aktivite</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((p) => (
              <TableRow
                key={p.id}
                className="cursor-pointer"
                onClick={() => onRowClick?.(p.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{getInitials(p.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell>{p.goal}</TableCell>
                <TableCell>
                  <span className={p.adherence >= 70 ? "text-green-600" : p.adherence >= 50 ? "text-yellow-600" : "text-red-600"}>
                    %{p.adherence}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariants[p.status]}>{statusLabels[p.status]}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{p.lastActivity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Toplam {patients.length} hasta
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
