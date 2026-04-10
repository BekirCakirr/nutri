import { Request, Response, NextFunction } from "express";
import * as familyService from "../services/family.service";
import { sendSuccess, sendError } from "../utils";

export async function getMembers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const members = await familyService.getMembers(req.user!.userId);
    sendSuccess({ res, data: members, message: "Aile uyeleri getirildi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function addMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const member = await familyService.addMember(req.user!.userId, req.body);
    sendSuccess({
      res,
      data: member,
      message: "Aile uyesi eklendi",
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

export async function removeMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await familyService.removeMember(
      req.user!.userId,
      req.params.id as string
    );
    sendSuccess({ res, data: result, message: "Aile uyesi silindi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
