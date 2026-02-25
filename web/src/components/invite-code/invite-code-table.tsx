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
import { Copy, Trash2 } from "lucide-react";

interface InviteCode {
  id: string;
  code: string;
  status: "active" | "used" | "expired";
  createdAt: string;
  usedBy?: string;
  note?: string;
}

interface InviteCodeTableProps {
  codes?: InviteCode[];
  onCopy?: (code: string) => void;
  onDelete?: (id: string) => void;
}

const statusLabels: Record<string, string> = {
  active: "Aktif",
  used: "Kullanildi",
  expired: "Suresi Doldu",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
  active: "default",
  used: "secondary",
  expired: "destructive",
};

const defaultCodes: InviteCode[] = [
  { id: "1", code: "NTR-A1B2C3", status: "active", createdAt: "25 Sub 2026", note: "Ayse icin" },
  { id: "2", code: "NTR-D4E5F6", status: "used", createdAt: "20 Sub 2026", usedBy: "Mehmet Kaya" },
  { id: "3", code: "NTR-G7H8I9", status: "expired", createdAt: "10 Sub 2026" },
  { id: "4", code: "NTR-J0K1L2", status: "active", createdAt: "24 Sub 2026" },
];

export function InviteCodeTable({
  codes = defaultCodes,
  onCopy,
  onDelete,
}: InviteCodeTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kod</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Olusturma Tarihi</TableHead>
            <TableHead>Kullanan</TableHead>
            <TableHead>Not</TableHead>
            <TableHead className="w-[100px]">Islemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {codes.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <code className="font-mono font-medium">{c.code}</code>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[c.status]}>
                  {statusLabels[c.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{c.createdAt}</TableCell>
              <TableCell className="text-sm">{c.usedBy ?? "-"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{c.note ?? "-"}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onCopy?.(c.code)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onDelete?.(c.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
