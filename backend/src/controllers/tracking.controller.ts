import { Request, Response, NextFunction } from "express";
import * as trackingService from "../services/tracking.service";
import { sendSuccess, sendError } from "../utils";

// ── Weight ───────────────────────────────────────────────────────────────────

export async function logWeight(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const entry = await trackingService.logWeight(req.user!.userId, req.body);
    sendSuccess({
      res,
      data: entry,
      message: "Kilo kaydedildi",
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

export async function getWeightHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const history = await trackingService.getWeightHistory(
      req.user!.userId,
      startDate as string | undefined,
      endDate as string | undefined
    );
    sendSuccess({
      res,
      data: history,
      message: "Kilo gecmisi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

// ── Water ────────────────────────────────────────────────────────────────────

export async function logWater(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const entry = await trackingService.logWater(
      req.user!.userId,
      req.body.glasses
    );
    sendSuccess({
      res,
      data: entry,
      message: "Su tuketimi kaydedildi",
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

export async function getTodayWater(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await trackingService.getTodayWater(req.user!.userId);
    sendSuccess({
      res,
      data,
      message: "Bugunun su tuketimi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getWaterHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const history = await trackingService.getWaterHistory(
      req.user!.userId,
      startDate as string | undefined,
      endDate as string | undefined
    );
    sendSuccess({
      res,
      data: history,
      message: "Su tuketimi gecmisi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

// ── Exercise ─────────────────────────────────────────────────────────────────

export async function logExercise(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const entry = await trackingService.logExercise(req.user!.userId, req.body);
    sendSuccess({
      res,
      data: entry,
      message: "Egzersiz kaydedildi",
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

export async function getExerciseHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const history = await trackingService.getExerciseHistory(
      req.user!.userId,
      startDate as string | undefined,
      endDate as string | undefined
    );
    sendSuccess({
      res,
      data: history,
      message: "Egzersiz gecmisi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

// ── Sleep ────────────────────────────────────────────────────────────────────

export async function logSleep(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const entry = await trackingService.logSleep(req.user!.userId, req.body);
    sendSuccess({
      res,
      data: entry,
      message: "Uyku kaydedildi",
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

export async function getSleepHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const history = await trackingService.getSleepHistory(
      req.user!.userId,
      startDate as string | undefined,
      endDate as string | undefined
    );
    sendSuccess({
      res,
      data: history,
      message: "Uyku gecmisi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────

export async function getTodaySummary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const summary = await trackingService.getTodaySummary(req.user!.userId);
    sendSuccess({
      res,
      data: summary,
      message: "Gunluk ozet getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteEntry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await trackingService.deleteTrackingEntry(
      req.params.table as string,
      req.params.id as string,
      req.user!.userId
    );
    sendSuccess({
      res,
      data: null,
      message: "Kayit basariyla silindi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
