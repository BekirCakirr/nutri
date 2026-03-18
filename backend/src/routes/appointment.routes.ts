import { Router } from "express";
import { z } from "zod";
import * as appointmentController from "../controllers/appointment.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const createAppointmentSchema = z.object({
  patientId: z.string().uuid("Gecerli bir hasta ID gerekli"),
  appointmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih formati YYYY-MM-DD olmali"),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Saat formati HH:MM olmali"),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Saat formati HH:MM olmali"),
  type: z.enum(["online", "in_person"]),
  notes: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum([
    "scheduled",
    "confirmed",
    "completed",
    "cancelled",
    "no_show",
  ]),
  notes: z.string().optional(),
});

// ── Routes ───────────────────────────────────────────────────────────────────

router.get(
  "/",
  authenticate,
  appointmentController.getMyAppointments
);

router.get(
  "/slots/:dietitianId",
  authenticate,
  appointmentController.getAvailableSlots
);

router.get(
  "/:id",
  authenticate,
  appointmentController.getAppointmentById
);

router.post(
  "/",
  authenticate,
  validate(createAppointmentSchema),
  appointmentController.createAppointment
);

router.patch(
  "/:id/status",
  authenticate,
  validate(updateStatusSchema),
  appointmentController.updateStatus
);

export default router;
