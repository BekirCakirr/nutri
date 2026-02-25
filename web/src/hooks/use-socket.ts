import { useEffect } from "react";
import { useSocketStore } from "@/stores/socket-store";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Manages the Socket.io connection lifecycle.
 * Connects when the user is authenticated and disconnects on cleanup.
 */
export function useSocket() {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const socket = useSocketStore((s) => s.socket);
  const isConnected = useSocketStore((s) => s.isConnected);
  const connect = useSocketStore((s) => s.connect);
  const disconnect = useSocketStore((s) => s.disconnect);
  const emit = useSocketStore((s) => s.emit);

  useEffect(() => {
    if (isAuthenticated && token) {
      connect(undefined, token);
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, token, connect, disconnect]);

  return {
    socket,
    isConnected,
    emit,
    connect,
    disconnect,
  };
}
