import { Request, Response, NextFunction } from "express";
import * as recipeService from "../services/recipe.service";
import { sendSuccess, sendError } from "../utils";

export async function searchRecipes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const q = req.query.q as string | undefined;
    const difficulty = req.query.difficulty as string | undefined;
    const tags = req.query.tags
      ? (req.query.tags as string).split(",")
      : undefined;
    const maxCalories = req.query.maxCalories
      ? parseFloat(req.query.maxCalories as string)
      : undefined;
    const isBudgetFriendly =
      req.query.isBudgetFriendly !== undefined
        ? req.query.isBudgetFriendly === "true"
        : undefined;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = await recipeService.searchRecipes({
      q,
      difficulty,
      tags,
      maxCalories,
      isBudgetFriendly,
      page,
      limit,
    });
    sendSuccess({ res, data: result });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getRecipeById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const recipe = await recipeService.getRecipeById(id);
    sendSuccess({ res, data: recipe });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function createRecipe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const recipe = await recipeService.createRecipe(userId, req.body);
    sendSuccess({ res, data: recipe, message: "Tarif basariyla eklendi", statusCode: 201 });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function updateRecipe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const recipe = await recipeService.updateRecipe(id, req.body);
    sendSuccess({ res, data: recipe, message: "Tarif basariyla guncellendi" });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
