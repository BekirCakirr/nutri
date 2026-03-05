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

    // ── Event handlers ───────────────────────────────────────────────────

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

    socket.on("disconnect", () => {
      console.log(`[WS] ${user.email} disconnected`);
      onlineUsers.delete(user.userId);
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

/** Check if a user is online. */
export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}
