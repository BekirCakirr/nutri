import { Router } from "express";
import { z } from "zod";
import * as patientController from "../controllers/patient.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const updateProfileSchema = z
  .object({
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    birth_date: z.string().optional(),
    gender: z.string().optional(),
    height_cm: z.number().positive().optional(),
    current_weight_kg: z.number().positive().optional(),
    target_weight_kg: z.number().positive().optional(),
    activity_level: z.string().optional(),
    goal_type: z.string().optional(),
    diet_type: z.string().optional(),
    daily_water_target: z.number().positive().optional(),
    sleep_hours: z.number().min(0).max(24).optional(),
    profile_photo_url: z.string().url().optional(),
    dark_mode: z.boolean().optional(),
    language: z.string().optional(),
    notification_enabled: z.boolean().optional(),
    intermittent_fasting_enabled: z.boolean().optional(),
    fasting_type: z.string().optional(),
    fasting_start_hour: z.string().optional(),
    fasting_end_hour: z.string().optional(),
  })
  .partial();

// ── Routes ───────────────────────────────────────────────────────────────────

router.get(
  "/",
  authenticate,
  authorize("dietitian"),
  patientController.getPatientsByDietitian
);

router.get(
  "/me",
  authenticate,
  authorize("patient"),
  patientController.getMyProfile
);

router.put(
  "/me",
  authenticate,
  authorize("patient"),
  validate(updateProfileSchema),
  patientController.updateMyProfile
);

router.get(
  "/:id",
  authenticate,
  authorize("dietitian"),
  patientController.getPatientById
);

export default router;
