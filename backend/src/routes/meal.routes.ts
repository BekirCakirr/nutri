import { Router } from "express";
import { z } from "zod";
import * as mealController from "../controllers/meal.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const createMealSchema = z.object({
  mealType: z.enum([
    "breakfast",
    "morning_snack",
    "lunch",
    "afternoon_snack",
    "dinner",
    "evening_snack",
    "other",
  ]),
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih formati YYYY-MM-DD olmali"),
  items: z
    .array(
      z.object({
        foodId: z.number().int().positive(),
        amount: z.number().positive(),
      })
    )
    .min(1, "En az bir besin ogesi gerekli"),
  notes: z.string().optional(),
  entryMethod: z
    .enum(["manual", "photo_ai", "barcode", "voice", "ocr", "text_ai"])
    .default("manual"),
});

const updateMealSchema = z.object({
  mealType: z
    .enum([
      "breakfast",
      "morning_snack",
      "lunch",
      "afternoon_snack",
      "dinner",
      "evening_snack",
      "other",
    ])
    .optional(),
  notes: z.string().optional(),
});

// ── Routes ───────────────────────────────────────────────────────────────────

router.get(
  "/today",
  authenticate,
  authorize("patient"),
  mealController.getTodayMeals
);

router.get(
  "/history",
  authenticate,
  authorize("patient"),
  mealController.getMealHistory
);

router.get(
  "/:id",
  authenticate,
  mealController.getMealById
);

router.post(
  "/",
  authenticate,
  authorize("patient"),
  validate(createMealSchema),
  mealController.createMeal
);

router.put(
  "/:id",
  authenticate,
  authorize("patient"),
  validate(updateMealSchema),
  mealController.updateMeal
);

router.delete(
  "/:id",
  authenticate,
  authorize("patient"),
  mealController.deleteMeal
);

export default router;
