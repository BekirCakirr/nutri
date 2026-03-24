import { create } from "zustand";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;

  connect: (url?: string, token?: string) => void;
  disconnect: () => void;
  emit: (event: string, data?: unknown) => void;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000";

export const useSocketStore = create<SocketState>()((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (url?: string, token?: string) => {
    const existing = get().socket;
    if (existing?.connected) return;

    const socket = io(url ?? SOCKET_URL, {
      auth: token ? { token } : undefined,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    socket.on("connect_error", () => {
      set({ isConnected: false });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  emit: (event: string, data?: unknown) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit(event, data);
    }
  },
}));
