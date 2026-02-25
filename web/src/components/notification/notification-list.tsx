import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./notification-item";

interface Notification {
  id: string;
  type: "appointment" | "meal" | "plan" | "message" | "system" | "review";
  title: string;
  description: string;
  time: string;
  read: boolean;
  dateGroup: string;
}

interface NotificationListProps {
  notifications?: Notification[];
  onSelect?: (id: string) => void;
}

const defaultNotifications: Notification[] = [
  { id: "1", type: "meal", title: "Yeni ogun kaydedildi", description: "Ayse Yilmaz kahvalti ogununu kaydetti.", time: "5 dk once", read: false, dateGroup: "Bugun" },
  { id: "2", type: "appointment", title: "Randevu hatirlatma", description: "Mehmet Kaya ile 11:00 randevunuz var.", time: "30 dk once", read: false, dateGroup: "Bugun" },
  { id: "3", type: "message", title: "Yeni mesaj", description: "Fatma Demir size mesaj gonderdi.", time: "1 saat once", read: true, dateGroup: "Bugun" },
  { id: "4", type: "plan", title: "Plan suresi doluyor", description: "Ali Celik'in beslenme plani 2 gun sonra sona eriyor.", time: "3 saat once", read: true, dateGroup: "Bugun" },
  { id: "5", type: "review", title: "Yeni degerlendirme", description: "Zeynep Ozturk sizi 5 yildiz ile degerlendirdi.", time: "Dun", read: true, dateGroup: "Dun" },
  { id: "6", type: "system", title: "Sistem guncellendi", description: "NutriAI v2.1 guncellendi.", time: "Dun", read: true, dateGroup: "Dun" },
];

export function NotificationList({
  notifications = defaultNotifications,
  onSelect,
}: NotificationListProps) {
  const groups = notifications.reduce<Record<string, Notification[]>>((acc, n) => {
    if (!acc[n.dateGroup]) acc[n.dateGroup] = [];
    acc[n.dateGroup].push(n);
    return acc;
  }, {});

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-2">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground px-3 py-1">
              {group}
            </h4>
            {items.map((n) => (
              <NotificationItem
                key={n.id}
                type={n.type}
                title={n.title}
                description={n.description}
                time={n.time}
                read={n.read}
                onClick={() => onSelect?.(n.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
