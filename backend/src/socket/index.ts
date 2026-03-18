import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { JwtPayload } from "../middleware";

let io: Server;

const onlineUsers = new Map<string, string>(); // userId -> socketId

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.corsOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60_000,
    pingInterval: 25_000,
  });

  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Kimlik dogrulama gerekli"));
    }
    try {
      const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
      (socket as any).user = payload;
      next();
    } catch {
      next(new Error("Gecersiz token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = (socket as any).user as JwtPayload;
    console.log(`[WS] ${user.email} (${user.role}) connected — ${socket.id}`);

    // Track online status
    onlineUsers.set(user.userId, socket.id);

    // Join personal room
    socket.join(`user:${user.userId}`);

    // Join role-based room
    socket.join(`role:${user.role}`);

    // Broadcast online status to all connected users
    io.emit("user:online", {
      userId: user.userId,
      timestamp: new Date().toISOString(),
    });

    // ── Conversation events ──────────────────────────────────────────────

    socket.on("join:conversation", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("leave:conversation", (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("message:send", (data) => {
      // Broadcast to conversation participants
      io.to(`conversation:${data.conversationId}`).emit("message:new", {
        ...data,
        senderId: user.userId,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("typing:start", (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit("typing:start", {
        userId: user.userId,
      });
    });

    socket.on("typing:stop", (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit("typing:stop", {
        userId: user.userId,
      });
    });

    // ── Live tracking events ─────────────────────────────────────────────

    socket.on("tracking:update", (data: { type: string; value: any }) => {
      // Broadcast tracking updates to the patient's dietitian(s)
      io.to(`role:dietitian`).emit("tracking:patient-update", {
        patientUserId: user.userId,
        trackingType: data.type,
        value: data.value,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("tracking:water", (data: { glasses: number; total: number }) => {
      io.to(`role:dietitian`).emit("tracking:water-update", {
        patientUserId: user.userId,
        glasses: data.glasses,
        total: data.total,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("tracking:meal-logged", (data: { mealType: string; calories: number }) => {
      io.to(`role:dietitian`).emit("tracking:meal-update", {
        patientUserId: user.userId,
        mealType: data.mealType,
        calories: data.calories,
        timestamp: new Date().toISOString(),
      });
    });

    // ── Notification events ──────────────────────────────────────────────

    socket.on("notification:seen", (notificationId: string) => {
      // Client confirms they saw a notification
      socket.emit("notification:ack", { notificationId });
    });

    // ── Disconnect ───────────────────────────────────────────────────────

    socket.on("disconnect", () => {
      console.log(`[WS] ${user.email} disconnected`);
      onlineUsers.delete(user.userId);

      // Broadcast offline status
      io.emit("user:offline", {
        userId: user.userId,
        timestamp: new Date().toISOString(),
      });
    });
  });

  return io;
}

/** Get the Socket.io server instance. */
export function getIO(): Server {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

/** Emit an event to a specific user. */
export function emitToUser(userId: string, event: string, data: any) {
  io?.to(`user:${userId}`).emit(event, {
    type: event,
    payload: data,
    timestamp: new Date().toISOString(),
  });
}

/** Emit a notification to a user. */
export function pushNotification(userId: string, notification: { id: string; type: string; title: string; body?: string }) {
  emitToUser(userId, "notification:new", notification);
}

/** Broadcast appointment reminder. */
export function sendAppointmentReminder(userId: string, appointment: { id: string; date: string; time: string; dietitianName?: string; patientName?: string }) {
  emitToUser(userId, "appointment:reminder", appointment);
}

/** Check if a user is online. */
export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}

/** Get all online user IDs. */
export function getOnlineUsers(): string[] {
  return Array.from(onlineUsers.keys());
}
