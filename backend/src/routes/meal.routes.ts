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
    "snack",
    "other",
  ]),
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih formati YYYY-MM-DD olmali"),
  items: z
    .array(
      z.object({
        foodId: z.number().int().positive().optional(),
        foodName: z.string().optional(),
        amount: z.number().positive(),
        // AI-pre-computed nutrition (photo analysis vs.)
        calories: z.number().nonnegative().optional(),
        protein: z.number().nonnegative().optional(),
        carbs: z.number().nonnegative().optional(),
        fat: z.number().nonnegative().optional(),
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
      "snack",
      "other",
    ])
    .optional(),
  notes: z.string().optional(),
  dietitianFeedback: z.string().optional(),
  dietitianViewed: z.boolean().optional(),
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
  // Both patient (own meal) and dietitian (own patients' meal — review/feedback) allowed
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
