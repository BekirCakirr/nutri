import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://nutriai_user:nutriai_pass@localhost:5432/nutriai",
  jwtSecret: process.env.JWT_SECRET || "nutriai-dev-secret",
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || "nutriai-dev-refresh-secret",
  jwtAccessExpiresIn: "15m",
  jwtRefreshExpiresIn: "7d",
  corsOrigin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
} as const;

// ── Production safety checks ──────────────────────────────────────────────────

if (env.nodeEnv === "production") {
  if (env.jwtSecret.includes("dev") || env.jwtSecret.length < 20) {
    console.error(
      "WARNING: JWT_SECRET is weak for production! Use a strong, unique secret (20+ chars, no 'dev')."
    );
  }
  if (
    env.jwtRefreshSecret.includes("dev") ||
    env.jwtRefreshSecret.length < 20
  ) {
    console.error(
      "WARNING: JWT_REFRESH_SECRET is weak for production! Use a strong, unique secret (20+ chars, no 'dev')."
    );
  }
  if (env.corsOrigin.includes("*")) {
    console.error(
      "WARNING: CORS_ORIGIN is set to '*' in production! Set explicit allowed origins."
    );
  }
}
