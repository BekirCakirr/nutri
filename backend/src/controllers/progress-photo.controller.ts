import { Request, Response, NextFunction } from "express";
import * as progressPhotoService from "../services/progress-photo.service";
import { sendSuccess, sendError } from "../utils";

export async function getPhotos(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const photos = await progressPhotoService.getPhotos(req.user!.userId);
    sendSuccess({ res, data: photos, message: "Ilerleme fotolari getirildi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function addPhoto(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const photo = await progressPhotoService.addPhoto(req.user!.userId, req.body);
    sendSuccess({
      res,
      data: photo,
      message: "Ilerleme fotosu eklendi",
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

export async function deletePhoto(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await progressPhotoService.deletePhoto(
      req.user!.userId,
      req.params.id as string
    );
    sendSuccess({ res, data: result, message: "Ilerleme fotosu silindi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
