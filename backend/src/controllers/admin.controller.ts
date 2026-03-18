import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";
import { sendSuccess, sendError } from "../utils";

export async function getDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const stats = await adminService.getDashboardStats();
    sendSuccess({ res, data: stats, message: "Dashboard istatistikleri getirildi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const role = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;
    const isActive =
      req.query.isActive !== undefined
        ? req.query.isActive === "true"
        : undefined;

    const result = await adminService.getUsers({
      role,
      isActive,
      search,
      page,
      limit,
    });
    sendSuccess({ res, data: result, message: "Kullanicilar getirildi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await adminService.getUserById(req.params.id as string);
    sendSuccess({ res, data: user, message: "Kullanici detayi getirildi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function updateUserStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { isActive } = req.body;
    if (isActive === undefined) {
      sendError({
        res,
        message: "isActive alani gerekli",
        statusCode: 400,
      });
      return;
    }

    const user = await adminService.updateUserStatus(
      req.params.id as string,
      isActive
    );
    sendSuccess({
      res,
      data: user,
      message: isActive
        ? "Kullanici aktif edildi"
        : "Kullanici deaktif edildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function approveDietitian(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const profile = await adminService.approveDietitian(
      req.params.id as string
    );
    sendSuccess({
      res,
      data: profile,
      message: "Diyetisyen basvurusu onaylandi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function rejectDietitian(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { reason } = req.body;
    if (!reason) {
      sendError({
        res,
        message: "reason alani gerekli",
        statusCode: 400,
      });
      return;
    }

    const profile = await adminService.rejectDietitian(
      req.params.id as string,
      reason
    );
    sendSuccess({
      res,
      data: profile,
      message: "Diyetisyen basvurusu reddedildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
