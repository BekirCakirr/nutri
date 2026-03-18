import api from "@/lib/axios";

import type { Notification } from "@/types/notification";
export type { Notification };

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get("/notifications");
  // Backend may return { notifications, total, ... } or array
  const result = data as any;
  return (result.notifications ?? (Array.isArray(result) ? result : [])) as Notification[];
}

export async function markAsRead(notificationId: string): Promise<Notification> {
  const { data } = await api.patch(`/notifications/${notificationId}/read`);
  return data as Notification;
}

export async function markAllRead(): Promise<{ success: boolean }> {
  await api.patch("/notifications/read-all");
  return { success: true };
}

export async function getUnreadCount(): Promise<{ count: number }> {
  const { data } = await api.get("/notifications/unread-count");
  const result = data as any;
  return { count: result.unreadCount ?? result.count ?? 0 };
}
