import { useCallback } from 'react';
import { useNotificationStore } from '@/stores';
import type { AppNotification } from '@/types';

export function useNotifications() {
  const store = useNotificationStore();

  const loadNotifications = useCallback(async () => {
    await store.loadNotifications();
  }, [store.loadNotifications]);

  const markRead = useCallback(
    async (id: string) => {
      await store.markRead(id);
    },
    [store.markRead],
  );

  const markAllRead = useCallback(async () => {
    await store.markAllRead();
  }, [store.markAllRead]);

  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    loadNotifications,
    addNotification: store.addNotification,
    markRead,
    markAllRead,
  };
}
