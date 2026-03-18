import { Request, Response, NextFunction } from "express";
import * as aiService from "../services/ai.service";
import { sendSuccess, sendError } from "../utils";

export async function chat(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await aiService.chat(req.user!.userId, req.body.message);
    sendSuccess({
      res,
      data: result,
      message: "AI yaniti basariyla alindi",
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

export async function analyzeMeal(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await aiService.analyzeMeal(
      req.user!.userId,
      req.body.imageUrl
    );
    sendSuccess({
      res,
      data: result,
      message: "Yemek analizi tamamlandi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getChatHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 20;

    const result = await aiService.getChatHistory(
      req.user!.userId,
      page,
      limit
    );
    sendSuccess({
      res,
      data: result.messages,
      message: "Sohbet gecmisi getirildi",
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
