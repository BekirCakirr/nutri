import { Router } from "express";
import * as reportController from "../controllers/report.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// ── Routes ───────────────────────────────────────────────────────────────────

router.get(
  "/weekly",
  authenticate,
  reportController.getWeeklyReports
);

router.get(
  "/weekly/:id",
  authenticate,
  reportController.getReportById
);

router.post(
  "/weekly/generate",
  authenticate,
  reportController.generateWeeklyReport
);

router.get(
  "/daily",
  authenticate,
  reportController.getDailySummary
);

router.get(
  "/summary",
  authenticate,
  reportController.getPatientSummary
);

export default router;
