import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { sendError } from "../utils";

export interface JwtPayload {
  userId: string;
  email: string;
  role: "patient" | "dietitian" | "admin" | "support";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Verify JWT access token from Authorization header.
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    sendError({
      res,
      message: "Kimlik dogrulama gerekli",
      statusCode: 401,
      errors: [{ code: "UNAUTHORIZED", message: "Token bulunamadi" }],
    });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      sendError({
        res,
        message: "Token suresi dolmus",
        statusCode: 401,
        errors: [{ code: "TOKEN_EXPIRED", message: "Access token suresi dolmus" }],
      });
      return;
    }
    sendError({
      res,
      message: "Gecersiz token",
      statusCode: 401,
      errors: [{ code: "INVALID_TOKEN", message: "Token dogrulanamadi" }],
    });
  }
}

/**
 * Restrict access to specific roles.
 */
export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError({
        res,
        message: "Kimlik dogrulama gerekli",
        statusCode: 401,
      });
      return;
    }
    if (!roles.includes(req.user.role)) {
      sendError({
        res,
        message: "Bu islemi gerceklestirme yetkiniz yok",
        statusCode: 403,
        errors: [{ code: "FORBIDDEN", message: `Gerekli rol: ${roles.join(", ")}` }],
      });
      return;
    }
    next();
  };
}
