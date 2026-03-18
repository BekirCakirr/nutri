import { Request, Response, NextFunction } from "express";
import * as shoppingService from "../services/shopping.service";
import { sendSuccess, sendError } from "../utils";

export async function getMyLists(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const lists = await shoppingService.getMyShoppingLists(req.user!.userId);
    sendSuccess({
      res,
      data: lists,
      message: "Alisveris listeleri getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getListById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const list = await shoppingService.getShoppingListById(req.params.id as string);
    sendSuccess({
      res,
      data: list,
      message: "Alisveris listesi detayi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function getByShareCode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const list = await shoppingService.getShoppingListByShareCode(
      req.params.code as string
    );
    sendSuccess({
      res,
      data: list,
      message: "Alisveris listesi getirildi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function createList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const list = await shoppingService.createShoppingList(
      req.user!.userId,
      req.body
    );
    sendSuccess({
      res,
      data: list,
      message: "Alisveris listesi basariyla olusturuldu",
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

export async function toggleItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const item = await shoppingService.toggleItem(
      req.params.itemId as string,
      req.user!.userId
    );
    sendSuccess({
      res,
      data: item,
      message: "Liste ogesi guncellendi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}

export async function deleteList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await shoppingService.deleteShoppingList(
      req.params.id as string,
      req.user!.userId
    );
    sendSuccess({
      res,
      data: null,
      message: "Alisveris listesi basariyla silindi",
    });
  } catch (err: any) {
    if (err.statusCode) {
      sendError({ res, message: err.message, statusCode: err.statusCode });
      return;
    }
    next(err);
  }
}
