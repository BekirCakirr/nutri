import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Server } from "lucide-react";

interface HealthMetric {
  id: string;
  name: string;
  status: "healthy" | "warning" | "error";
  value: string;
  description?: string;
}

interface AdminSystemHealthProps {
  metrics?: HealthMetric[];
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  healthy: { icon: CheckCircle2, color: "text-green-600", label: "Saglikli" },
  warning: { icon: AlertTriangle, color: "text-yellow-600", label: "Uyari" },
  error: { icon: XCircle, color: "text-red-600", label: "Hata" },
};

const defaultMetrics: HealthMetric[] = [
  { id: "1", name: "API Sunucusu", status: "healthy", value: "99.9% uptime", description: "Yanit suresi: 45ms" },
  { id: "2", name: "Veritabani", status: "healthy", value: "Normal", description: "Baglanti havuzu: 12/50" },
  { id: "3", name: "WebSocket", status: "healthy", value: "Aktif", description: "142 baglanti" },
  { id: "4", name: "AI Servisi", status: "warning", value: "Yavasliyor", description: "Yanit suresi: 2.1s" },
  { id: "5", name: "Depolama", status: "healthy", value: "%34 kullanımda", description: "18.2 GB / 50 GB" },
  { id: "6", name: "E-posta Servisi", status: "healthy", value: "Normal", description: "Kuyruk: 0" },
];

export function AdminSystemHealth({ metrics = defaultMetrics }: AdminSystemHealthProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Server className="h-4 w-4" />
          Sistem Durumu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics.map((m) => {
          const config = statusConfig[m.status];
          const Icon = config.icon;
          return (
            <div key={m.id} className="flex items-center gap-3 rounded-lg border p-3">
              <Icon className={`h-5 w-5 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{m.name}</span>
                  <Badge variant="outline" className="text-xs">{m.value}</Badge>
                </div>
                {m.description && (
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
