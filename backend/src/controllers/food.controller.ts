import { Request, Response, NextFunction } from "express";
import * as foodService from "../services/food.service";
import { sendSuccess, sendError } from "../utils";

export async function searchFoods(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const q = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = await foodService.searchFoods(q, category, page, limit);
    sendSuccess({ res, data: result });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getFoodById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    const food = await foodService.getFoodById(id);
    sendSuccess({ res, data: food });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getFoodByBarcode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const code = req.params.code as string;
    const food = await foodService.getFoodByBarcode(code);

    if (!food) {
      sendError({ res, message: "Barkod ile besin bulunamadi", statusCode: 404 });
      return;
    }

    sendSuccess({ res, data: food });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function createFood(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const food = await foodService.createFood(req.body);
    sendSuccess({ res, data: food, message: "Besin basariyla eklendi", statusCode: 201 });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function updateFood(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    const food = await foodService.updateFood(id, req.body);
    sendSuccess({ res, data: food, message: "Besin basariyla guncellendi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
