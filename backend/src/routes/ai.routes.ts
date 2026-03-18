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

router.get(
  "/chat/history",
  authenticate,
  aiController.getChatHistory
);

export default router;
