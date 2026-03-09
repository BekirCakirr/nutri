import { Request, Response, NextFunction } from "express";
import * as patientService from "../services/patient.service";
import { sendSuccess, sendError } from "../utils";

export async function getMyProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError({ res, message: "Yetkisiz", statusCode: 401 });
      return;
    }

    const profile = await patientService.getMyProfile(req.user.userId);
    sendSuccess({ res, data: profile });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function updateMyProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError({ res, message: "Yetkisiz", statusCode: 401 });
      return;
    }

    const profile = await patientService.updateMyProfile(
      req.user.userId,
      req.body
    );
    sendSuccess({ res, data: profile, message: "Profil guncellendi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getPatientById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError({ res, message: "Yetkisiz", statusCode: 401 });
      return;
    }

    const profile = await patientService.getPatientById(req.params.id as string);
    sendSuccess({ res, data: profile });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getPatientsByDietitian(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError({ res, message: "Yetkisiz", statusCode: 401 });
      return;
    }

    const patients = await patientService.getPatientsByDietitian(
      req.user.userId
    );
    sendSuccess({ res, data: patients });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
