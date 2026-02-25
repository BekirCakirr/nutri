import { useCallback } from "react";
import { useNotificationStore } from "@/stores/notification-store";
import type { Notification } from "@/stores/notification-store";

/**
 * Notification operations hook.
 * Convenience wrapper around the notification store.
 */
export function useNotifications() {
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const storeAdd = useNotificationStore((s) => s.addNotification);
  const storeMarkAsRead = useNotificationStore((s) => s.markAsRead);
  const storeMarkAllRead = useNotificationStore((s) => s.markAllRead);
  const storeRemove = useNotificationStore((s) => s.removeNotification);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
      storeAdd({
        ...notification,
        id: `notif_${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    },
    [storeAdd],
  );

  const markAsRead = useCallback(
    (id: string) => {
      storeMarkAsRead(id);
    },
    [storeMarkAsRead],
  );

  const markAllRead = useCallback(() => {
    storeMarkAllRead();
  }, [storeMarkAllRead]);

  const removeNotification = useCallback(
    (id: string) => {
      storeRemove(id);
    },
    [storeRemove],
  );

  const hasUnread = unreadCount > 0;

  const unreadNotifications = notifications.filter((n) => !n.read);

  const notificationsByType = (type: Notification["type"]) =>
    notifications.filter((n) => n.type === type);

  return {
    notifications,
    unreadCount,
    hasUnread,
    unreadNotifications,
    notificationsByType,
    addNotification,
    markAsRead,
    markAllRead,
    removeNotification,
  };
}
