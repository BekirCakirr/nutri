import type { AppNotification } from '@/types';
import apiClient from './client';

export async function getNotifications(): Promise<AppNotification[]> {
  try {
    const { data } = await apiClient.get('/notifications');
    const result = data?.data ?? data;
    if (Array.isArray(result)) return result as AppNotification[];
    if (result && Array.isArray(result.notifications)) return result.notifications as AppNotification[];
    return [];
  } catch {
    return [];
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all');
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`/notifications/${id}`);
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await apiClient.get('/notifications/unread-count');
  const result = data.data ?? data;
  return result?.count ?? result?.unreadCount ?? 0;
}
