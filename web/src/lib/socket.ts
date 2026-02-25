// ---------------------------------------------------------------------------
// Socket.io Client – Connection Manager
// ---------------------------------------------------------------------------

import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { SOCKET_URL } from "./constants";

/** Lazily-initialised singleton socket instance. */
let socket: Socket | null = null;

/**
 * Return the singleton Socket.io client, creating it on first call.
 *
 * The connection is NOT opened automatically – call `connect()` to open it
 * once the user has authenticated.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 10_000,
      timeout: 10_000,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}

/**
 * Open the socket connection, attaching the user's access token.
 */
export function connectSocket(): void {
  const s = getSocket();
  const token = localStorage.getItem("accessToken");

  if (token) {
    s.auth = { token };
  }

  if (!s.connected) {
    s.connect();
  }
}

/**
 * Gracefully disconnect and destroy the socket instance so a fresh one is
 * created on the next `getSocket()` call (e.g. after logout).
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Subscribe to a socket event with full type safety.
 *
 * Returns an unsubscribe function for easy cleanup in `useEffect`.
 */
export function onSocketEvent<T = unknown>(
  event: string,
  handler: (data: T) => void,
): () => void {
  const s = getSocket();
  s.on(event, handler as (...args: unknown[]) => void);
  return () => {
    s.off(event, handler as (...args: unknown[]) => void);
  };
}

/**
 * Emit a socket event.
 */
export function emitSocketEvent<T = unknown>(event: string, data?: T): void {
  const s = getSocket();
  if (s.connected) {
    s.emit(event, data);
  }
}

// ── Typed event names used across the app ────────────────────────────────────

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "connect_error",

  // Messaging
  NEW_MESSAGE: "new_message",
  MESSAGE_READ: "message_read",
  TYPING: "typing",
  STOP_TYPING: "stop_typing",

  // Notifications
  NEW_NOTIFICATION: "new_notification",

  // Appointments
  APPOINTMENT_UPDATE: "appointment_update",
  APPOINTMENT_REMINDER: "appointment_reminder",

  // Meals
  MEAL_SUBMITTED: "meal_submitted",
  MEAL_REVIEWED: "meal_reviewed",

  // Plans
  PLAN_UPDATED: "plan_updated",

  // Presence
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",
} as const;
