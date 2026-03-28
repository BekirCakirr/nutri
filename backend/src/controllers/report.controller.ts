import { Request, Response, NextFunction } from "express";
import * as reportService from "../services/report.service";
import { sendSuccess, sendError } from "../utils";

export async function getWeeklyReports(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = await reportService.getWeeklyReports(
      req.user!.userId,
      page,
      limit
    );
    sendSuccess({
      res,
      data: result,
      message: "Haftalik raporlar getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getReportById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const report = await reportService.getReportById(req.params.id as string);
    sendSuccess({
      res,
      data: report,
      message: "Rapor detayi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function generateWeeklyReport(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { weekStart, weekEnd } = req.body;
    if (!weekStart || !weekEnd) {
      sendError({
        res,
        message: "weekStart ve weekEnd alanlari gerekli",
        statusCode: 400,
      });
      return;
    }

    const report = await reportService.generateWeeklyReport(
      req.user!.userId,
      weekStart,
      weekEnd
    );
    sendSuccess({
      res,
      data: report,
      message: "Haftalik rapor basariyla olusturuldu",
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

export async function getDailySummary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { date } = req.query;
    if (!date) {
      sendError({
        res,
        message: "date parametresi gerekli",
        statusCode: 400,
      });
      return;
    }

    const summary = await reportService.getDailySummary(
      req.user!.userId,
      date as string
    );
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

export async function getPatientSummary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user!.role === "dietitian") {
      sendSuccess({
        res,
        data: {
          totalMeals: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          averageCalories: 0,
          currentStreak: 0,
          weightChangeFromStart: 0,
          avgDailyCalories: 0
        },
        message: "Diyetisyen icin global ozet (mocked)",
      });
      return;
    }

    const summary = await reportService.getPatientSummary(req.user!.userId);
    sendSuccess({
      res,
      data: summary,
      message: "Hasta ozeti getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
