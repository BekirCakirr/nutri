import { create } from "zustand";
import { mockNotifications } from "@/mock";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Notification {
  id: string;
  type: "appointment" | "message" | "alert" | "system" | "review";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  _recalcUnread: () => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: mockNotifications as unknown as Notification[],
  unreadCount: mockNotifications.filter((n) => !(n as unknown as { read: boolean }).read).length,

  setNotifications: (notifications) => {
    set({ notifications });
    get()._recalcUnread();
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
    get()._recalcUnread();
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
    get()._recalcUnread();
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
    get()._recalcUnread();
  },

  _recalcUnread: () => {
    set((state) => ({
      unreadCount: state.notifications.filter((n) => !n.read).length,
    }));
  },
}));
