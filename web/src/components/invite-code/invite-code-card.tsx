import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, QrCode } from "lucide-react";

interface InviteCodeCardProps {
  code: string;
  status: "active" | "used" | "expired";
  createdAt: string;
  note?: string;
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

export function InviteCodeCard({ code, status, createdAt, note }: InviteCodeCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
          <QrCode className="h-7 w-7 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <code className="font-mono text-lg font-bold tracking-wider">{code}</code>
            <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {createdAt}
            {note && <> &middot; {note}</>}
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
