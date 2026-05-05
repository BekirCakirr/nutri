import { Router } from "express";
import { z } from "zod";
import * as aiController from "../controllers/ai.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const chatSchema = z.object({
  message: z.string().min(1, "Mesaj icerigi bos olamaz"),
});

const analyzeMealSchema = z.object({
  imageUrl: z.string().url("Gecerli bir URL giriniz"),
});

const generatePlanSchema = z.object({
  patientId: z.string().uuid().optional(),
  dailyCalorieTarget: z.number().int().min(800).max(5000).optional(),
  goal: z.enum(["weight_loss", "weight_gain", "maintenance", "muscle_gain"]).optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  durationDays: z.number().int().min(7).max(28).optional(),
  notes: z.string().max(1000).optional(),
});

// ── Routes ───────────────────────────────────────────────────────────────────

router.post(
  "/chat",
  authenticate,
  validate(chatSchema),
  aiController.chat
);

router.post(
  "/analyze-meal",
  authenticate,
  validate(analyzeMealSchema),
  aiController.analyzeMeal
);

router.post(
  "/generate-plan",
  authenticate,
  validate(generatePlanSchema),
  aiController.generatePlan
);

router.get(
  "/chat/history",
  authenticate,
  aiController.getChatHistory
);

export default router;
