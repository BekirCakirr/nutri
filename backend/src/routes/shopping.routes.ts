import { Router } from "express";
import { z } from "zod";
import * as shoppingController from "../controllers/shopping.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const createListSchema = z.object({
  title: z.string().min(1, "Baslik gerekli").max(200),
  mealPlanId: z.string().uuid().optional(),
  items: z
    .array(
      z.object({
        foodName: z.string().min(1, "Besin adi gerekli").max(200),
        amount: z.string().max(100).optional(),
        category: z.string().max(100).optional(),
        allergenWarning: z.boolean().optional(),
        estimatedPriceTl: z.number().min(0).optional(),
        sortOrder: z.number().int().min(0).optional(),
      })
    )
    .min(1, "En az bir urun gerekli"),
});

// ── Routes ───────────────────────────────────────────────────────────────────

router.get(
  "/",
  authenticate,
  authorize("patient"),
  shoppingController.getMyLists
);

router.get(
  "/share/:code",
  shoppingController.getByShareCode
);

router.get(
  "/:id",
  authenticate,
  shoppingController.getListById
);

router.post(
  "/",
  authenticate,
  authorize("patient"),
  validate(createListSchema),
  shoppingController.createList
);

router.post(
  "/:id/items",
  authenticate,
  authorize("patient"),
  validate(z.object({
    foodName: z.string().min(1).max(200),
    amount: z.string().max(100).optional(),
    category: z.string().max(100).optional(),
    allergenWarning: z.boolean().optional(),
    estimatedPriceTl: z.number().min(0).optional(),
  })),
  shoppingController.addItem
);

router.patch(
  "/items/:itemId/toggle",
  authenticate,
  shoppingController.toggleItem
);

router.delete(
  "/items/:itemId",
  authenticate,
  authorize("patient"),
  shoppingController.deleteItem
);

router.delete(
  "/:id",
  authenticate,
  authorize("patient"),
  shoppingController.deleteList
);

export default router;
