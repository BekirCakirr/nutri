/**
 * Application error with HTTP status code.
 */
export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "AppError";
  }
}

// ── 400 Bad Request ─────────────────────────────────────────────────────────

export const BadRequest = (message = "Gecersiz istek", code = "BAD_REQUEST") =>
  new AppError(message, 400, code);

export const ValidationError = (message = "Dogrulama hatasi") =>
  new AppError(message, 422, "VALIDATION_ERROR");

// ── 401 Unauthorized ────────────────────────────────────────────────────────

export const Unauthorized = (message = "Kimlik dogrulama gerekli") =>
  new AppError(message, 401, "UNAUTHORIZED");

export const TokenExpired = () =>
  new AppError("Token suresi dolmus", 401, "TOKEN_EXPIRED");

export const InvalidToken = () =>
  new AppError("Gecersiz token", 401, "INVALID_TOKEN");

// ── 403 Forbidden ───────────────────────────────────────────────────────────

export const Forbidden = (message = "Bu islemi gerceklestirme yetkiniz yok") =>
  new AppError(message, 403, "FORBIDDEN");

// ── 404 Not Found ───────────────────────────────────────────────────────────

export const NotFound = (resource = "Kaynak") =>
  new AppError(`${resource} bulunamadi`, 404, "NOT_FOUND");

// ── 409 Conflict ────────────────────────────────────────────────────────────

export const Conflict = (message = "Kaynak zaten mevcut") =>
  new AppError(message, 409, "CONFLICT");

// ── 429 Too Many Requests ───────────────────────────────────────────────────

export const TooManyRequests = (message = "Cok fazla istek gonderildi") =>
  new AppError(message, 429, "TOO_MANY_REQUESTS");

// ── 500 Internal ────────────────────────────────────────────────────────────

export const InternalError = (message = "Sunucu hatasi") =>
  new AppError(message, 500, "INTERNAL_ERROR");
