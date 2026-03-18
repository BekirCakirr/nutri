import { Router } from "express";
import { z } from "zod";
import * as notificationController from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// ── Routes ───────────────────────────────────────────────────────────────────

router.get(
  "/",
  authenticate,
  notificationController.getNotifications
);

router.get(
  "/unread-count",
  authenticate,
  notificationController.getUnreadCount
);

router.patch(
  "/:id/read",
  authenticate,
  notificationController.markAsRead
);

router.patch(
  "/read-all",
  authenticate,
  notificationController.markAllAsRead
);

router.delete(
  "/:id",
  authenticate,
  notificationController.deleteNotification
);

export default router;
