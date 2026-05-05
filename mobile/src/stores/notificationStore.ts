import { create } from 'zustand';
import type { AppNotification } from '@/types';
import * as notifApi from '@/services/api/notification';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  pushToken: string | null;
}

interface NotificationActions {
  loadNotifications: () => Promise<void>;
  addNotification: (notification: AppNotification) => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  setPushToken: (token: string) => void;
}

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  pushToken: null,

  loadNotifications: async () => {
    try {
      const notifications = await notifApi.getNotifications();
      const safeList = Array.isArray(notifications) ? notifications : [];
      const unreadCount = safeList.filter((n) => !n?.read).length;
      set({ notifications: safeList, unreadCount });
    } catch {
      set({ notifications: [], unreadCount: 0 });
    }
  },

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markRead: async (id) => {
    if (!id) return;
    // Optimistic update first to keep UI responsive even if API fails
    set((state) => {
      const wasUnread = state.notifications.find((n) => n.id === id && !n?.read);
      return {
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        ),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
    try {
      await notifApi.markNotificationRead(id);
    } catch {
      // ignore — local state already updated
    }
  },

  markAllRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
    try {
      await notifApi.markAllNotificationsRead();
    } catch {
      // ignore — local state already updated
    }
  },

  setPushToken: (token) => set({ pushToken: token }),
}));
