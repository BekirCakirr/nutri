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
    const notifications = await notifApi.getNotifications();
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount });
  },

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markRead: async (id) => {
    await notifApi.markNotificationRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllRead: async () => {
    await notifApi.markAllNotificationsRead();
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  setPushToken: (token) => set({ pushToken: token }),
}));
