import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import path from "path";
import { env, pool } from "./config";
import { initSocket } from "./socket";
import { apiLimiter, authLimiter, aiLimiter } from "./middleware/rate-limit";
import { logger } from "./lib/logger";

// ── Route imports ───────────────────────────────────────────────────────────

import authRoutes from "./routes/auth.routes";
import foodRoutes from "./routes/food.routes";
import mealRoutes from "./routes/meal.routes";
import patientRoutes from "./routes/patient.routes";
import dietitianRoutes from "./routes/dietitian.routes";
import appointmentRoutes from "./routes/appointment.routes";
import messageRoutes from "./routes/message.routes";
import planRoutes from "./routes/plan.routes";
import recipeRoutes from "./routes/recipe.routes";
import shoppingRoutes from "./routes/shopping.routes";
import reviewRoutes from "./routes/review.routes";
import notificationRoutes from "./routes/notification.routes";
import reportRoutes from "./routes/report.routes";
import trackingRoutes from "./routes/tracking.routes";
import adminRoutes from "./routes/admin.routes";
import aiRoutes from "./routes/ai.routes";

import { sendSuccess, sendError } from "./utils";

const app = express();
const server = http.createServer(app);

// ── Security middleware ─────────────────────────────────────────────────────

app.use(helmet());
app.use(apiLimiter);

// ── Core middleware ─────────────────────────────────────────────────────────

const corsOrigin =
  env.nodeEnv === "production"
    ? env.corsOrigin.filter((o) => o !== "*")
    : env.corsOrigin;

app.use(
  cors({
    origin: corsOrigin.length > 0 ? corsOrigin : false,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static file serving (uploads) ───────────────────────────────────────────

app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// ── Request logging ─────────────────────────────────────────────────────────

app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, "request");
  next();
});

// ── Health check ────────────────────────────────────────────────────────────

app.get("/api/health", async (_req, res) => {
  try {
    const dbStart = Date.now();
    await pool.query("SELECT 1");
    const dbLatency = Date.now() - dbStart;

    sendSuccess({
      res,
      data: {
        status: "ok",
        uptime: process.uptime(),
        database: {
          status: "connected",
          latencyMs: dbLatency,
        },
        version: "1.0.0",
        environment: env.nodeEnv,
      },
      message: "Sunucu calisiyor",
    });
  } catch {
    sendError({
      res,
      message: "Veritabani baglantisi kurulamadi",
      statusCode: 503,
      errors: [{ code: "DB_UNREACHABLE", message: "Database disconnected" }],
    });
  }
});

// ── Routes ──────────────────────────────────────────────────────────────────

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/dietitians", dietitianRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/shopping-lists", shoppingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);

// ── 404 handler ─────────────────────────────────────────────────────────────

app.use((_req, res) => {
  sendError({ res, message: "Endpoint bulunamadi", statusCode: 404 });
});

// ── Global error handler ────────────────────────────────────────────────────

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    logger.error({ err: err.message, stack: err.stack }, "unhandled error");
    sendError({
      res,
      message:
        env.nodeEnv === "development" ? err.message : "Sunucu hatasi",
      statusCode: err.statusCode || 500,
    });
  }
);

// ── Socket.io ───────────────────────────────────────────────────────────────

initSocket(server);

// ── Start server ────────────────────────────────────────────────────────────

if (require.main === module || !process.env.JEST_WORKER_ID) {
  server.listen(env.port, () => {
    logger.info(
      { port: env.port, env: env.nodeEnv },
      "NutriAI Backend v1.0.0 started"
    );
    console.log(`
╔══════════════════════════════════════════╗
║   NutriAI Backend v1.0.0                 ║
║   Port: ${env.port}                            ║
║   Env:  ${env.nodeEnv.padEnd(20)}       ║
║   DB:   PostgreSQL                       ║
║   WS:   Socket.io                        ║
║   Routes: 16                             ║
╚══════════════════════════════════════════╝
    `);
  });
}

export default app;
