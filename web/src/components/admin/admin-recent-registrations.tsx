import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { ROLE_LABELS } from "@/lib/constants";

interface Registration {
  id: string;
  name: string;
  email: string;
  role: string;
  date: string;
}

interface AdminRecentRegistrationsProps {
  registrations?: Registration[];
}

const defaultRegistrations: Registration[] = [
  { id: "1", name: "Elif Sahin", email: "elif@email.com", role: "patient", date: "25 Sub 2026" },
  { id: "2", name: "Baris Akin", email: "baris@email.com", role: "patient", date: "24 Sub 2026" },
  { id: "3", name: "Dr. Gul Kara", email: "gul@email.com", role: "dietitian", date: "23 Sub 2026" },
  { id: "4", name: "Canan Yurt", email: "canan@email.com", role: "patient", date: "22 Sub 2026" },
  { id: "5", name: "Emre Tas", email: "emre@email.com", role: "patient", date: "21 Sub 2026" },
];

export function AdminRecentRegistrations({
  registrations = defaultRegistrations,
}: AdminRecentRegistrationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserPlus className="h-4 w-4" />
          Son Kayitlar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {registrations.map((r) => {
          const initials = r.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
          return (
            <div key={r.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.email}</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-xs">
                  {ROLE_LABELS[r.role] ?? r.role}
                </Badge>
                <p className="text-xs text-muted-foreground mt-0.5">{r.date}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
