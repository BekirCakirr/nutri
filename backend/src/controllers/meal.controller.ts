import { Request, Response, NextFunction } from "express";
import * as mealService from "../services/meal.service";
import { sendSuccess, sendError } from "../utils";

export async function getTodayMeals(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const meals = await mealService.getTodayMeals(req.user!.userId);
    sendSuccess({
      res,
      data: meals,
      message: "Bugunun ogunleri getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getMealHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { startDate, endDate, patientId } = req.query;
    if (!startDate || !endDate) {
      sendError({
        res,
        message: "startDate ve endDate parametreleri gerekli",
        statusCode: 400,
      });
      return;
    }

    // Role tabanli erisim kontrolu
    // - Hasta: kendi öğünleri
    // - Diyetisyen + patientId: o hastanın öğünleri
    // - Diyetisyen + patientId yok: tüm bağlı hastalarının öğünleri (Öğün İnceleme sayfası için)
    const meals =
      req.user!.role === "dietitian" && !patientId
        ? await mealService.getDietitianAllMeals(
            req.user!.userId,
            startDate as string,
            endDate as string
          )
        : await mealService.getMealHistory(
            req.user!.userId,
            startDate as string,
            endDate as string,
            (patientId as string) || ""
          );
    sendSuccess({
      res,
      data: meals,
      message: "Ogun gecmisi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getMealById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const meal = await mealService.getMealById(req.params.id as string);
    sendSuccess({
      res,
      data: meal,
      message: "Ogun detayi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function createMeal(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const meal = await mealService.createMeal(req.user!.userId, req.body);
    sendSuccess({
      res,
      data: meal,
      message: "Ogun basariyla olusturuldu",
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

export async function updateMeal(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const meal = await mealService.updateMeal(
      req.params.id as string,
      req.user!.userId,
      req.body
    );
    sendSuccess({
      res,
      data: meal,
      message: "Ogun basariyla guncellendi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function deleteMeal(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await mealService.deleteMeal(req.params.id as string, req.user!.userId);
    sendSuccess({
      res,
      data: null,
      message: "Ogun basariyla silindi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
