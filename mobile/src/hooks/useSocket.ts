import { useEffect, useRef, useCallback } from 'react';
import { connectSocket, disconnectSocket, onSocketEvent, offSocketEvent, emitSocketEvent } from '@/services/socket';
import { useAuthStore } from '@/stores';

export function useSocket() {
  const token = useAuthStore((state) => state.token);
  const isConnected = useRef(false);

  useEffect(() => {
    if (token && !isConnected.current) {
      connectSocket(token);
      isConnected.current = true;
    }

    return () => {
      if (isConnected.current) {
        disconnectSocket();
        isConnected.current = false;
      }
    };
  }, [token]);

  const subscribe = useCallback(<T>(event: string, callback: (data: T) => void) => {
    onSocketEvent(event, callback);
    return () => offSocketEvent(event);
  }, []);

  const emit = useCallback(<T>(event: string, data: T) => {
    emitSocketEvent(event, data);
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
    isConnected.current = false;
  }, []);

  return {
    isConnected: isConnected.current,
    subscribe,
    emit,
    disconnect,
  };
}
