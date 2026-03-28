import rateLimit from "express-rate-limit";
import { sendError } from "../utils";

/** General API rate limiter — 500 requests per minute per IP (generous for dev). */
export const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError({
      res,
      message: "Cok fazla istek gonderildi. Lutfen biraz bekleyin.",
      statusCode: 429,
      errors: [{ code: "TOO_MANY_REQUESTS", message: "Rate limit asildi" }],
    });
  },
});

/** Strict limiter for auth endpoints — 10 attempts per 15 minutes. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError({
      res,
      message: "Cok fazla giris denemesi. 15 dakika sonra tekrar deneyin.",
      statusCode: 429,
      errors: [{ code: "AUTH_RATE_LIMIT", message: "Giris limiti asildi" }],
    });
  },
});

/** AI endpoint limiter — 30 requests per hour per user. */
export const aiLimiter = rateLimit({
  windowMs: 60 * 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError({
      res,
      message: "AI istek limiti doldu. 1 saat sonra tekrar deneyin.",
      statusCode: 429,
      errors: [{ code: "AI_RATE_LIMIT", message: "AI limiti asildi" }],
    });
  },
});
