import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/constants';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });
  }
  return socket;
}

export function connectSocket(token: string): void {
  const s = getSocket();
  s.auth = { token };
  s.connect();
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function onSocketEvent<T>(event: string, callback: (data: T) => void): void {
  getSocket().on(event, callback);
}

export function offSocketEvent(event: string): void {
  getSocket().off(event);
}

export function emitSocketEvent<T>(event: string, data: T): void {
  getSocket().emit(event, data);
}
