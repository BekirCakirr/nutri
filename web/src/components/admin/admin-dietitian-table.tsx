import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Star } from "lucide-react";

interface Dietitian {
  id: string;
  name: string;
  email: string;
  patientCount: number;
  rating: number;
  status: "active" | "inactive";
  joinedAt: string;
}

interface AdminDietitianTableProps {
  dietitians?: Dietitian[];
  onAction?: (id: string) => void;
}

const defaultDietitians: Dietitian[] = [
  { id: "1", name: "Dr. Ayse Koc", email: "ayse.koc@email.com", patientCount: 24, rating: 4.8, status: "active", joinedAt: "1 Ara 2025" },
  { id: "2", name: "Dr. Mehmet Oz", email: "mehmet@email.com", patientCount: 18, rating: 4.5, status: "active", joinedAt: "15 Oca 2026" },
  { id: "3", name: "Dr. Zehra Yildiz", email: "zehra@email.com", patientCount: 12, rating: 4.2, status: "inactive", joinedAt: "1 Sub 2026" },
];

export function AdminDietitianTable({
  dietitians = defaultDietitians,
  onAction,
}: AdminDietitianTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Diyetisyen</TableHead>
            <TableHead className="text-right">Hasta Sayisi</TableHead>
            <TableHead>Puan</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Katilim Tarihi</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {dietitians.map((d) => (
            <TableRow key={d.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {d.name.split(" ").slice(-1)[0]?.[0] ?? "D"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">{d.patientCount}</TableCell>
              <TableCell>
                <span className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {d.rating}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={d.status === "active" ? "default" : "secondary"}>
                  {d.status === "active" ? "Aktif" : "Pasif"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{d.joinedAt}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onAction?.(d.id)}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
