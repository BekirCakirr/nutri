import { Router } from "express";
import { z } from "zod";
import * as planController from "../controllers/plan.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const createPlanSchema = z.object({
  patientId: z.string().uuid("Gecersiz hasta ID formati"),
  title: z.string().min(1, "Baslik gerekli").max(200),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih formati YYYY-MM-DD olmali"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih formati YYYY-MM-DD olmali")
    .optional(),
  dailyCalorieTarget: z.number().positive().optional(),
  dailyProteinTarget: z.number().positive().optional(),
  dailyCarbTarget: z.number().positive().optional(),
  dailyFatTarget: z.number().positive().optional(),
  specialNotes: z.string().optional(),
  isBudgetFriendly: z.boolean().optional(),
  items: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(1).max(7),
        mealType: z.string().min(1, "Ogun tipi gerekli"),
        foodName: z.string().min(1, "Besin adi gerekli").max(200),
        amountG: z.number().positive().optional(),
        calories: z.number().nonnegative().optional(),
        protein: z.number().nonnegative().optional(),
        carbs: z.number().nonnegative().optional(),
        fat: z.number().nonnegative().optional(),
        alternatives: z.string().optional(),
        notes: z.string().optional(),
        sortOrder: z.number().int().nonnegative().optional(),
      })
    )
    .min(1, "En az bir plan ogesi gerekli"),
});

const updateStatusSchema = z.object({
  status: z.enum(["draft", "active", "paused", "completed", "cancelled"]),
});

// ── Routes ───────────────────────────────────────────────────────────────────

router.get(
  "/",
  authenticate,
  planController.getMyPlans
);

router.get(
  "/:id",
  authenticate,
  planController.getPlanById
);

router.post(
  "/",
  authenticate,
  authorize("dietitian"),
  validate(createPlanSchema),
  planController.createPlan
);

router.patch(
  "/:id/status",
  authenticate,
  validate(updateStatusSchema),
  planController.updatePlanStatus
);

router.delete(
  "/:id",
  authenticate,
  authorize("dietitian"),
  planController.deletePlan
);

export default router;
