import { Request, Response, NextFunction } from "express";
import * as planService from "../services/plan.service";
import { sendSuccess, sendError } from "../utils";

export async function getMyPlans(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const role = req.user!.role;
    const plans =
      role === "dietitian"
        ? await planService.getPlansByDietitian(req.user!.userId)
        : await planService.getPlansByPatient(req.user!.userId);

    sendSuccess({
      res,
      data: plans,
      message: "Beslenme planlari getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getPlanById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const plan = await planService.getPlanById(req.params.id as string);
    sendSuccess({
      res,
      data: plan,
      message: "Beslenme plani detayi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function createPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const plan = await planService.createPlan(req.user!.userId, req.body);
    sendSuccess({
      res,
      data: plan,
      message: "Beslenme plani basariyla olusturuldu",
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

export async function updatePlanStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const plan = await planService.updatePlanStatus(
      req.params.id as string,
      req.user!.userId,
      req.body.status
    );
    sendSuccess({
      res,
      data: plan,
      message: "Plan durumu basariyla guncellendi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function deletePlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await planService.deletePlan(req.params.id as string, req.user!.userId);
    sendSuccess({
      res,
      data: null,
      message: "Beslenme plani basariyla silindi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
