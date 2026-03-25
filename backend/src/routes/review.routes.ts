import { Router } from "express";
import { z } from "zod";
import * as reviewController from "../controllers/review.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const createReviewSchema = z.object({
  dietitianId: z.string().uuid("Gecerli bir diyetisyen ID gerekli"),
  rating: z
    .number()
    .int("Puan tam sayi olmali")
    .min(1, "Puan en az 1 olmali")
    .max(5, "Puan en fazla 5 olmali"),
  comment: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

// ── Routes ───────────────────────────────────────────────────────────────────

router.get(
  "/dietitian/:dietitianId",
  authenticate,
  reviewController.getReviews
);

router.post(
  "/",
  authenticate,
  authorize("patient"),
  validate(createReviewSchema),
  reviewController.createReview
);

router.post(
  "/:id/respond",
  authenticate,
  authorize("dietitian"),
  validate(z.object({
    response: z.string().min(1, "Yanit metni gerekli").max(2000),
  })),
  reviewController.respondToReview
);

router.delete(
  "/:id",
  authenticate,
  authorize("patient"),
  reviewController.deleteReview
);

export default router;
