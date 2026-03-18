import { Router } from "express";
import { z } from "zod";
import * as trackingController from "../controllers/tracking.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const logWeightSchema = z.object({
  weightKg: z.number().positive("Kilo degeri pozitif olmali"),
  notes: z.string().optional(),
});

const logWaterSchema = z.object({
  glasses: z.number().int().positive("Bardak sayisi pozitif olmali").optional(),
});

const logExerciseSchema = z.object({
  exerciseType: z.string().min(1, "Egzersiz turu gerekli").max(50),
  durationMin: z.number().int().positive("Sure pozitif olmali"),
  caloriesBurned: z.number().positive().optional(),
  intensity: z.enum(["low", "moderate", "high"]).optional(),
  notes: z.string().optional(),
});

const logSleepSchema = z.object({
  sleepStart: z.string().datetime("Gecerli bir tarih-saat formati gerekli"),
  sleepEnd: z.string().datetime("Gecerli bir tarih-saat formati gerekli"),
  quality: z.enum(["poor", "fair", "good", "excellent"]).optional(),
  notes: z.string().optional(),
});

// ── Routes ───────────────────────────────────────────────────────────────────

// Summary (any authenticated user)
router.get(
  "/summary/today",
  authenticate,
  trackingController.getTodaySummary
);

// Weight
router.post(
  "/weight",
  authenticate,
  authorize("patient"),
  validate(logWeightSchema),
  trackingController.logWeight
);

router.get(
  "/weight",
  authenticate,
  authorize("patient"),
  trackingController.getWeightHistory
);

// Water
router.post(
  "/water",
  authenticate,
  authorize("patient"),
  validate(logWaterSchema),
  trackingController.logWater
);

router.get(
  "/water/today",
  authenticate,
  authorize("patient"),
  trackingController.getTodayWater
);

router.get(
  "/water",
  authenticate,
  authorize("patient"),
  trackingController.getWaterHistory
);

// Exercise
router.post(
  "/exercise",
  authenticate,
  authorize("patient"),
  validate(logExerciseSchema),
  trackingController.logExercise
);

router.get(
  "/exercise",
  authenticate,
  authorize("patient"),
  trackingController.getExerciseHistory
);

// Sleep
router.post(
  "/sleep",
  authenticate,
  authorize("patient"),
  validate(logSleepSchema),
  trackingController.logSleep
);

router.get(
  "/sleep",
  authenticate,
  authorize("patient"),
  trackingController.getSleepHistory
);

// Generic delete
router.delete(
  "/:table/:id",
  authenticate,
  authorize("patient"),
  trackingController.deleteEntry
);

export default router;
