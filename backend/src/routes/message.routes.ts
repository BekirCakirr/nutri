import { Router } from "express";
import { z } from "zod";
import * as messageController from "../controllers/message.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const sendMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  receiverId: z.string().uuid().optional(),
  content: z.string().min(1, "Mesaj icerigi bos olamaz"),
  messageType: z
    .enum(["text", "image", "file", "plan_share", "meal_share", "voice"])
    .default("text"),
  attachmentUrl: z.string().url().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// ── Routes ───────────────────────────────────────────────────────────────────

router.get(
  "/conversations",
  authenticate,
  messageController.getConversations
);

router.get(
  "/conversations/:id/messages",
  authenticate,
  messageController.getMessages
);

router.post(
  "/send",
  authenticate,
  validate(sendMessageSchema),
  messageController.sendMessage
);

router.patch(
  "/conversations/:id/read",
  authenticate,
  messageController.markAsRead
);

export default router;
