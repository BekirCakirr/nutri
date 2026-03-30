import api from "@/lib/axios";

import type { Notification } from "@/types/notification";
export type { Notification };

interface ApiNotificationResponse {
  notifications?: Notification[];
  total?: number;
}
interface ApiUnreadResponse {
  unreadCount?: number;
  count?: number;
}

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get("/notifications");
  const result = data as ApiNotificationResponse;
  return result.notifications ?? (Array.isArray(data) ? (data as Notification[]) : []);
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
  const result = data as ApiUnreadResponse;
  return { count: result.unreadCount ?? result.count ?? 0 };
}
