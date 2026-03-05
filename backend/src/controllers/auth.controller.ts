import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { sendSuccess, sendError } from "../utils";

export async function registerPatient(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.registerPatient(req.body);
    sendSuccess({
      res,
      data: {
        user: result.user,
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn,
          tokenType: "Bearer" as const,
        },
      },
      message: "Kayit basarili",
      statusCode: 201,
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function registerDietitian(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.registerDietitian(req.body);
    sendSuccess({
      res,
      data: {
        user: result.user,
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn,
          tokenType: "Bearer" as const,
        },
      },
      message: "Diyetisyen kaydi basarili. Onay bekleniyor.",
      statusCode: 201,
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.login(req.body);
    sendSuccess({
      res,
      data: {
        user: result.user,
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn,
          tokenType: "Bearer" as const,
        },
      },
      message: "Giris basarili",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      sendError({
        res,
        message: "Refresh token gerekli",
        statusCode: 400,
      });
      return;
    }

    const tokens = await authService.refreshAccessToken(refreshToken);
    sendSuccess({
      res,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        tokenType: "Bearer" as const,
      },
      message: "Token yenilendi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError({ res, message: "Yetkisiz", statusCode: 401 });
      return;
    }

    const profile = await authService.getProfile(
      req.user.userId,
      req.user.role
    );

    sendSuccess({
      res,
      data: {
        id: req.user.userId,
        email: req.user.email,
        role: req.user.role,
        profile,
      },
    });
  } catch (err) {
    next(err);
  }
}
