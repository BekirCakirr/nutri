import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Video, MapPin, User, Pencil, Trash2 } from "lucide-react";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/constants";

interface AppointmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: {
    id: string;
    patientName: string;
    date: string;
    time: string;
    type: "online" | "yuz_yuze";
    status: string;
    notes?: string;
  };
  onEdit?: () => void;
  onCancel?: () => void;
}

export function AppointmentDetailDialog({
  open,
  onOpenChange,
  appointment,
  onEdit,
  onCancel,
}: AppointmentDetailDialogProps) {
  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Randevu Detayi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{appointment.patientName}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {appointment.date} &middot; {appointment.time}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {appointment.type === "online" ? (
              <Video className="h-4 w-4 text-muted-foreground" />
            ) : (
              <MapPin className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm">
              {appointment.type === "online" ? "Online Gorusme" : "Yuz Yuze Gorusme"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Durum:</span>
            <Badge>
              {APPOINTMENT_STATUS_LABELS[appointment.status] ?? appointment.status}
            </Badge>
          </div>

          {appointment.notes && (
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Notlar</p>
              <p className="text-sm">{appointment.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="destructive" size="sm" onClick={onCancel}>
            <Trash2 className="mr-1 h-4 w-4" />
            Iptal Et
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="mr-1 h-4 w-4" />
            Duzenle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
