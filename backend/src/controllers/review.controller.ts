import { Request, Response, NextFunction } from "express";
import * as reviewService from "../services/review.service";
import { sendSuccess, sendError } from "../utils";

export async function getReviews(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await reviewService.getReviewsByDietitian(
      req.params.dietitianId as string,
      page,
      limit
    );

    sendSuccess({
      res,
      data: result,
      message: "Degerlendirmeler getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function createReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const review = await reviewService.createReview(
      req.user!.userId,
      req.body
    );

    sendSuccess({
      res,
      data: review,
      message: "Degerlendirme basariyla olusturuldu",
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

export async function deleteReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await reviewService.deleteReview(
      req.params.id as string,
      req.user!.userId
    );

    sendSuccess({
      res,
      data: result,
      message: "Degerlendirme basariyla silindi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
