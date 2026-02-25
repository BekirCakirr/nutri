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
import { MoreVertical } from "lucide-react";
import { ROLE_LABELS } from "@/lib/constants";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "banned";
  createdAt: string;
}

interface AdminUserTableProps {
  users?: User[];
  onAction?: (userId: string, action: string) => void;
}

const statusLabels: Record<string, string> = {
  active: "Aktif",
  inactive: "Pasif",
  banned: "Engellendi",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
  active: "default",
  inactive: "secondary",
  banned: "destructive",
};

const defaultUsers: User[] = [
  { id: "1", name: "Ayse Yilmaz", email: "ayse@email.com", role: "patient", status: "active", createdAt: "15 Oca 2026" },
  { id: "2", name: "Dr. Mehmet Oz", email: "mehmet@email.com", role: "dietitian", status: "active", createdAt: "10 Oca 2026" },
  { id: "3", name: "Fatma Demir", email: "fatma@email.com", role: "patient", status: "inactive", createdAt: "20 Ara 2025" },
  { id: "4", name: "Admin User", email: "admin@nutriai.com", role: "admin", status: "active", createdAt: "1 Ara 2025" },
];

export function AdminUserTable({ users = defaultUsers, onAction }: AdminUserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kullanici</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Kayit Tarihi</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ROLE_LABELS[u.role] ?? u.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[u.status]}>{statusLabels[u.status]}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{u.createdAt}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onAction?.(u.id, "menu")}
                >
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
