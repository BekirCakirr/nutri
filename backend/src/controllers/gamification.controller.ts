import { Request, Response, NextFunction } from "express";
import * as gamificationService from "../services/gamification.service";
import { sendSuccess, sendError } from "../utils";

export async function getStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const status = await gamificationService.getStatus(req.user!.userId);
    sendSuccess({ res, data: status, message: "Oyunlastirma durumu getirildi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getBadges(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const badges = await gamificationService.getBadges(req.user!.userId);
    sendSuccess({ res, data: badges, message: "Rozetler getirildi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getChallenges(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const challenges = await gamificationService.getChallenges(req.user!.userId);
    sendSuccess({ res, data: challenges, message: "Gorevler getirildi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
