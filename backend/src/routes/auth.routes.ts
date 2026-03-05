import { Router } from "express";
import { z } from "zod";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const registerPatientSchema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Sifre en az 6 karakter olmali"),
  firstName: z.string().min(1, "Ad gerekli").max(100),
  lastName: z.string().min(1, "Soyad gerekli").max(100),
  inviteCode: z.string().optional(),
});

const registerDietitianSchema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Sifre en az 6 karakter olmali"),
  firstName: z.string().min(1, "Ad gerekli").max(100),
  lastName: z.string().min(1, "Soyad gerekli").max(100),
  title: z.string().optional(),
  licenseNumber: z.string().min(1, "Lisans numarasi gerekli"),
  specializations: z.array(z.string()).optional(),
  university: z.string().optional(),
  experienceYears: z.number().int().min(0).optional(),
  bio: z.string().optional(),
  city: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi giriniz"),
  password: z.string().min(1, "Sifre gerekli"),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token gerekli"),
});

// ── Routes ───────────────────────────────────────────────────────────────────

router.post(
  "/register/patient",
  validate(registerPatientSchema),
  authController.registerPatient
);

router.post(
  "/register/dietitian",
  validate(registerDietitianSchema),
  authController.registerDietitian
);

router.post("/login", validate(loginSchema), authController.login);

router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.get("/me", authenticate, authController.getMe);

export default router;
