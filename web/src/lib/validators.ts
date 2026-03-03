// ---------------------------------------------------------------------------
// Zod Validation Schemas
// ---------------------------------------------------------------------------

import { z } from "zod";

// ── Helpers ──────────────────────────────────────────────────────────────────

const requiredString = (field: string) =>
  z.string().min(1, { message: `${field} zorunludur` });

const emailSchema = z.string().email({ message: "Gecerli bir e-posta adresi giriniz" });

const passwordSchema = z
  .string()
  .min(8, { message: "Sifre en az 8 karakter olmalidir" })
  .regex(/[A-Z]/, { message: "Sifre en az bir buyuk harf icermelidir" })
  .regex(/[a-z]/, { message: "Sifre en az bir kucuk harf icermelidir" })
  .regex(/[0-9]/, { message: "Sifre en az bir rakam icermelidir" });

const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, { message: "Gecerli bir telefon numarasi giriniz" })
  .optional()
  .or(z.literal(""));

// ── Auth Schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Sifre zorunludur" }),
  rememberMe: z.boolean().optional(),
  twoFactorCode: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: requiredString("Ad"),
    lastName: requiredString("Soyad"),
    role: z.enum(["dietitian", "patient"]),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
    dateOfBirth: z.string().optional(),
    phone: phoneSchema,
    inviteCode: z.string().optional(),
    acceptedTerms: z.literal(true, {
      error: "Kullanim kosullarini kabul etmelisiniz",
    }),
    acceptedPrivacy: z.literal(true, {
      error: "Gizlilik politikasini kabul etmelisiniz",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Sifreler eslesmeli",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Mevcut sifre zorunludur" }),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Sifreler eslesmeli",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Sifreler eslesmeli",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ── Patient Schemas ──────────────────────────────────────────────────────────

export const patientSchema = z.object({
  firstName: requiredString("Ad"),
  lastName: requiredString("Soyad"),
  email: emailSchema,
  phone: phoneSchema,
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  dateOfBirth: z.string().optional(),
  height: z.coerce.number().min(50).max(300).optional(),
  weight: z.coerce.number().min(10).max(500).optional(),
  activityLevel: z
    .enum(["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"])
    .optional(),
  allergies: z.array(z.string()).optional(),
  medicalConditions: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

// ── Meal Schemas ─────────────────────────────────────────────────────────────

export const mealItemSchema = z.object({
  foodId: z.string().optional(),
  name: requiredString("Besin adi"),
  quantity: z.coerce.number().min(0.1, { message: "Miktar 0'dan buyuk olmalidir" }),
  unit: z.string().min(1),
  calories: z.coerce.number().min(0).optional(),
  protein: z.coerce.number().min(0).optional(),
  carbohydrates: z.coerce.number().min(0).optional(),
  fat: z.coerce.number().min(0).optional(),
});

export const mealSchema = z.object({
  type: z.enum([
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "morning_snack",
    "afternoon_snack",
    "evening_snack",
  ]),
  date: z.string().min(1, { message: "Tarih zorunludur" }),
  time: z.string().optional(),
  items: z.array(mealItemSchema).min(1, { message: "En az bir besin ekleyiniz" }),
  notes: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type MealFormValues = z.infer<typeof mealSchema>;

// ── Nutrition Plan Schemas ───────────────────────────────────────────────────

export const planSchema = z.object({
  title: requiredString("Plan adi"),
  description: z.string().max(2000).optional(),
  patientId: requiredString("Hasta"),
  startDate: z.string().min(1, { message: "Baslangic tarihi zorunludur" }),
  endDate: z.string().min(1, { message: "Bitis tarihi zorunludur" }),
  dailyCalorieTarget: z.coerce.number().min(500).max(10000).optional(),
  dailyProteinTarget: z.coerce.number().min(0).optional(),
  dailyCarbTarget: z.coerce.number().min(0).optional(),
  dailyFatTarget: z.coerce.number().min(0).optional(),
  notes: z.string().max(2000).optional(),
});

export type PlanFormValues = z.infer<typeof planSchema>;

// ── Appointment Schemas ──────────────────────────────────────────────────────

export const appointmentSchema = z.object({
  patientId: requiredString("Hasta"),
  date: z.string().min(1, { message: "Tarih zorunludur" }),
  startTime: z.string().min(1, { message: "Baslangic saati zorunludur" }),
  endTime: z.string().min(1, { message: "Bitis saati zorunludur" }),
  type: z.enum(["in_person", "online"]),
  notes: z.string().max(2000).optional(),
  reminderMinutes: z.coerce.number().min(0).optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

// ── Message / Chat Schemas ───────────────────────────────────────────────────

export const messageSchema = z.object({
  content: z.string().min(1, { message: "Mesaj bos olamaz" }).max(5000),
  attachmentUrl: z.string().url().optional().or(z.literal("")),
});

export type MessageFormValues = z.infer<typeof messageSchema>;

// ── Recipe Schema ────────────────────────────────────────────────────────────

export const recipeSchema = z.object({
  title: requiredString("Tarif adi"),
  description: z.string().max(2000).optional(),
  servings: z.coerce.number().min(1),
  prepTime: z.coerce.number().min(0),
  cookTime: z.coerce.number().min(0),
  ingredients: z
    .array(
      z.object({
        name: requiredString("Malzeme adi"),
        quantity: z.coerce.number().min(0),
        unit: z.string(),
      }),
    )
    .min(1, { message: "En az bir malzeme ekleyiniz" }),
  instructions: z
    .array(z.string().min(1))
    .min(1, { message: "En az bir adim ekleyiniz" }),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

// ── Profile / Settings Schemas ───────────────────────────────────────────────

export const profileSchema = z.object({
  firstName: requiredString("Ad"),
  lastName: requiredString("Soyad"),
  phone: phoneSchema,
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  dateOfBirth: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// ── Review Schema ────────────────────────────────────────────────────────────

export const reviewResponseSchema = z.object({
  response: z.string().min(1, { message: "Yanit bos olamaz" }).max(2000),
});

export type ReviewResponseFormValues = z.infer<typeof reviewResponseSchema>;

// ── Invite Code Schema ───────────────────────────────────────────────────────

export const inviteCodeSchema = z.object({
  maxUses: z.coerce.number().min(1).max(1000),
  expiresAt: z.string().optional(),
  note: z.string().max(500).optional(),
});

export type InviteCodeFormValues = z.infer<typeof inviteCodeSchema>;

// ── Working Hours Schema ─────────────────────────────────────────────────────

export const workingHoursSchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  isAvailable: z.boolean(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export type WorkingHoursFormValues = z.infer<typeof workingHoursSchema>;
