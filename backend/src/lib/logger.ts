import pino from "pino";
import { env } from "../config";

export const logger = pino({
  level: env.nodeEnv === "production" ? "info" : "debug",
  transport:
    env.nodeEnv === "development"
      ? { target: "pino/file", options: { destination: 1 } }
      : undefined,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: { service: "nutriai-backend" },
});
