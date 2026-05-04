import { useEffect, useRef } from "react";
import { useSocketStore } from "@/stores/socket-store";

/**
 * Subscribe to a specific socket event.
 * The handler is automatically registered and cleaned up.
 * Uses a ref to keep the latest handler so caller is not forced to
 * memoize it; otherwise inline functions would cause register/unregister
 * loops on every render.
 */
export function useSocketEvent<T = unknown>(
  event: string,
  handler: (data: T) => void,
) {
  const socket = useSocketStore((s) => s.socket);
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!socket) return;
    const wrapped = (...args: unknown[]) => {
      handlerRef.current(args[0] as T);
    };
    socket.on(event, wrapped);
    return () => {
      socket.off(event, wrapped);
    };
  }, [socket, event]);
}
