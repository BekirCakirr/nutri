// ---------------------------------------------------------------------------
// Notification Service
// ---------------------------------------------------------------------------

import { mockNotifications, simulateApiCall } from "@/mock";

type Notification = (typeof mockNotifications)[number];

// ── Public API ───────────────────────────────────────────────────────────────

export async function getNotifications(): Promise<Notification[]> {
  return simulateApiCall([...mockNotifications], 300);
}

export async function markAsRead(
  notificationId: string,
): Promise<Notification> {
  const notif =
    mockNotifications.find((n) => n.id === notificationId) ??
    mockNotifications[0];
  return simulateApiCall({ ...notif, isRead: true }, 300);
}

export async function markAllRead(): Promise<{ success: boolean }> {
  return simulateApiCall({ success: true }, 300);
}

export async function getUnreadCount(): Promise<{ count: number }> {
  const count = mockNotifications.filter((n) => !n.isRead).length;
  return simulateApiCall({ count }, 300);
}
