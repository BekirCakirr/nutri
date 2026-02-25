import { Card, CardContent } from "@/components/ui/card";
import { Hash, CheckCircle, XCircle, Clock } from "lucide-react";

interface InviteCodeStatsProps {
  total?: number;
  active?: number;
  used?: number;
  expired?: number;
}

export function InviteCodeStats({
  total = 24,
  active = 8,
  used = 12,
  expired = 4,
}: InviteCodeStatsProps) {
  const stats = [
    { label: "Toplam", value: total, icon: Hash, color: "bg-blue-100 text-blue-600" },
    { label: "Aktif", value: active, icon: CheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Kullanildi", value: used, icon: Clock, color: "bg-purple-100 text-purple-600" },
    { label: "Suresi Doldu", value: expired, icon: XCircle, color: "bg-red-100 text-red-600" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
