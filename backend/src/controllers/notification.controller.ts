import { Request, Response, NextFunction } from "express";
import * as notificationService from "../services/notification.service";
import { sendSuccess, sendError } from "../utils";

export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 20;
    const unreadOnly = req.query.unreadOnly === "true";

    const result = await notificationService.getNotifications(
      req.user!.userId,
      page,
      limit,
      unreadOnly
    );
    sendSuccess({
      res,
      data: result.notifications,
      message: "Bildirimler getirildi",
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        unreadCount: result.unreadCount,
      },
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getUnreadCount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await notificationService.getUnreadCount(
      req.user!.userId
    );
    sendSuccess({
      res,
      data: result,
      message: "Okunmamis bildirim sayisi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function markAsRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id as string,
      req.user!.userId
    );
    sendSuccess({
      res,
      data: notification,
      message: "Bildirim okundu olarak isaretlendi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function markAllAsRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await notificationService.markAllAsRead(
      req.user!.userId
    );
    sendSuccess({
      res,
      data: result,
      message: "Tum bildirimler okundu olarak isaretlendi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function deleteNotification(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await notificationService.deleteNotification(
      req.params.id as string,
      req.user!.userId
    );
    sendSuccess({
      res,
      data: result,
      message: "Bildirim basariyla silindi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
