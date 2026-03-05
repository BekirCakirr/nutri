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
