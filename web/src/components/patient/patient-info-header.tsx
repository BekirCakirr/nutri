import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  CalendarPlus,
  FileText,
  Phone,
  Mail,
} from "lucide-react";

interface PatientInfoHeaderProps {
  name: string;
  age: number;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: "active" | "inactive" | "new";
  onMessage?: () => void;
  onSchedule?: () => void;
  onReport?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

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

export function PatientInfoHeader({
  name,
  age,
  email,
  phone,
  avatarUrl,
  status,
  onMessage,
  onSchedule,
  onReport,
}: PatientInfoHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          {avatarUrl && (
            <img src={avatarUrl} alt={name} className="object-cover" />
          )}
          <AvatarFallback className="text-xl">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{name}</h2>
            <Badge variant={statusVariants[status]}>
              {statusLabels[status]}
            </Badge>
          </div>
          <p className="text-muted-foreground">{age} yasinda</p>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onMessage}>
          <MessageSquare className="mr-1 h-4 w-4" />
          Mesaj
        </Button>
        <Button variant="outline" size="sm" onClick={onSchedule}>
          <CalendarPlus className="mr-1 h-4 w-4" />
          Randevu
        </Button>
        <Button variant="outline" size="sm" onClick={onReport}>
          <FileText className="mr-1 h-4 w-4" />
          Rapor
        </Button>
      </div>
    </div>
  );
}
