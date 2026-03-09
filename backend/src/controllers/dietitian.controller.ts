import { Request, Response, NextFunction } from "express";
import * as dietitianService from "../services/dietitian.service";
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

    const profile = await dietitianService.getMyProfile(req.user.userId);
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

    const profile = await dietitianService.updateMyProfile(
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

export async function getDietitianById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError({ res, message: "Yetkisiz", statusCode: 401 });
      return;
    }

    const profile = await dietitianService.getDietitianById(req.params.id as string);
    sendSuccess({ res, data: profile });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getMyPatients(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError({ res, message: "Yetkisiz", statusCode: 401 });
      return;
    }

    const patients = await dietitianService.getMyPatients(req.user.userId);
    sendSuccess({ res, data: patients });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function pairWithPatient(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError({ res, message: "Yetkisiz", statusCode: 401 });
      return;
    }

    const dietitian = await dietitianService.pairWithPatient(
      req.user.userId,
      req.body.inviteCode
    );
    sendSuccess({
      res,
      data: dietitian,
      message: "Diyetisyen ile eslestirme basarili",
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

export async function getMyInviteCode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError({ res, message: "Yetkisiz", statusCode: 401 });
      return;
    }

    const inviteCode = await dietitianService.getMyInviteCode(req.user.userId);
    sendSuccess({ res, data: { inviteCode } });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function regenerateInviteCode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError({ res, message: "Yetkisiz", statusCode: 401 });
      return;
    }

    const inviteCode = await dietitianService.regenerateInviteCode(
      req.user.userId
    );
    sendSuccess({
      res,
      data: { inviteCode },
      message: "Davet kodu yenilendi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
