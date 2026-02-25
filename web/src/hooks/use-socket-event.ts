import { useEffect } from "react";
import { useSocketStore } from "@/stores/socket-store";

/**
 * Subscribe to a specific socket event.
 * The handler is automatically registered and cleaned up.
 *
 * @param event  - The socket event name to listen for.
 * @param handler - Callback invoked when the event fires.
 */
export function useSocketEvent<T = unknown>(
  event: string,
  handler: (data: T) => void,
) {
  const socket = useSocketStore((s) => s.socket);

  useEffect(() => {
    if (!socket) return;

    socket.on(event, handler as (...args: unknown[]) => void);

    return () => {
      socket.off(event, handler as (...args: unknown[]) => void);
    };
  }, [socket, event, handler]);
}
