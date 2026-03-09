import { Router } from "express";
import { z } from "zod";
import * as dietitianController from "../controllers/dietitian.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const updateProfileSchema = z
  .object({
    title: z.string().optional(),
    specializations: z.array(z.string()).optional(),
    bio: z.string().optional(),
    clinic_name: z.string().optional(),
    clinic_address: z.string().optional(),
    city: z.string().optional(),
    offers_online: z.boolean().optional(),
    offers_in_person: z.boolean().optional(),
    session_price_tl: z.number().positive().optional(),
    available_days: z.array(z.string()).optional(),
    session_duration_min: z.number().int().positive().optional(),
    profile_photo_url: z.string().url().optional(),
  })
  .partial();

const pairSchema = z.object({
  inviteCode: z.string().min(1, "Davet kodu gerekli"),
});

// ── Routes ───────────────────────────────────────────────────────────────────

router.get(
  "/me",
  authenticate,
  authorize("dietitian"),
  dietitianController.getMyProfile
);

router.put(
  "/me",
  authenticate,
  authorize("dietitian"),
  validate(updateProfileSchema),
  dietitianController.updateMyProfile
);

router.get(
  "/me/patients",
  authenticate,
  authorize("dietitian"),
  dietitianController.getMyPatients
);

router.get(
  "/me/invite-code",
  authenticate,
  authorize("dietitian"),
  dietitianController.getMyInviteCode
);

router.post(
  "/me/invite-code/regenerate",
  authenticate,
  authorize("dietitian"),
  dietitianController.regenerateInviteCode
);

router.post(
  "/pair",
  authenticate,
  authorize("patient"),
  validate(pairSchema),
  dietitianController.pairWithPatient
);

router.get(
  "/:id",
  authenticate,
  dietitianController.getDietitianById
);

export default router;
