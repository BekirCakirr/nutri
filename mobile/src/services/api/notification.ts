import type { AppNotification } from '@/types';
import { mockNotifications } from '@/mock';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function getNotifications(): Promise<AppNotification[]> {
  await delay();
  return mockNotifications;
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(200);
}

export async function markAllNotificationsRead(): Promise<void> {
  await delay(300);
}

export async function deleteNotification(id: string): Promise<void> {
  await delay(200);
}

export async function getUnreadCount(): Promise<number> {
  await delay(200);
  return mockNotifications.filter((n) => !n.read).length;
}
