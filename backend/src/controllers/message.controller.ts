import { Request, Response, NextFunction } from "express";
import * as messageService from "../services/message.service";
import { sendSuccess, sendError } from "../utils";

export async function getConversations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const conversations = await messageService.getConversations(
      req.user!.userId
    );
    sendSuccess({
      res,
      data: conversations,
      message: "Konusmalar getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getMessages(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 50;

    const result = await messageService.getMessages(
      req.params.id as string,
      req.user!.userId,
      page,
      limit
    );
    sendSuccess({
      res,
      data: result.messages,
      message: "Mesajlar getirildi",
      meta: result.pagination,
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function sendMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const message = await messageService.sendMessage(
      req.user!.userId,
      req.body
    );
    sendSuccess({
      res,
      data: message,
      message: "Mesaj basariyla gonderildi",
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

export async function markAsRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await messageService.markAsRead(
      req.params.id as string,
      req.user!.userId
    );
    sendSuccess({
      res,
      data: result,
      message: "Mesajlar okundu olarak isaretlendi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
