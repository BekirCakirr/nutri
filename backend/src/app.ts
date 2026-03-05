import express from "express";
import cors from "cors";
import http from "http";
import { env, pool } from "./config";
import { initSocket } from "./socket";
import authRoutes from "./routes/auth.routes";
import { sendError } from "./utils";

const app = express();
const server = http.createServer(app);

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────────────────────

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected",
    });
  }
});

// ── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);

// ── 404 handler ──────────────────────────────────────────────────────────────

app.use((_req, res) => {
  sendError({ res, message: "Endpoint bulunamadi", statusCode: 404 });
});

// ── Global error handler ─────────────────────────────────────────────────────

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[ERROR]", err);
    sendError({
      res,
      message:
        env.nodeEnv === "development" ? err.message : "Sunucu hatasi",
      statusCode: err.statusCode || 500,
    });
  }
);

// ── Socket.io ────────────────────────────────────────────────────────────────

initSocket(server);

// ── Start server ─────────────────────────────────────────────────────────────

server.listen(env.port, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   NutriAI Backend v1.0.0                 ║
║   Port: ${env.port}                            ║
║   Env:  ${env.nodeEnv.padEnd(20)}       ║
║   DB:   PostgreSQL                       ║
║   WS:   Socket.io                        ║
╚══════════════════════════════════════════╝
  `);
});

export default app;
