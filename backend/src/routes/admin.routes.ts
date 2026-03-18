import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// ── Routes ───────────────────────────────────────────────────────────────────

router.get(
  "/dashboard",
  authenticate,
  authorize("admin"),
  adminController.getDashboardStats
);

router.get(
  "/users",
  authenticate,
  authorize("admin"),
  adminController.getUsers
);

router.get(
  "/users/:id",
  authenticate,
  authorize("admin"),
  adminController.getUserById
);

router.patch(
  "/users/:id/status",
  authenticate,
  authorize("admin"),
  adminController.updateUserStatus
);

router.post(
  "/dietitians/:id/approve",
  authenticate,
  authorize("admin"),
  adminController.approveDietitian
);

router.post(
  "/dietitians/:id/reject",
  authenticate,
  authorize("admin"),
  adminController.rejectDietitian
);

export default router;
