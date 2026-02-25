// ---------------------------------------------------------------------------
// Application Constants
// ---------------------------------------------------------------------------

/** Base API URL for backend requests. */
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

/** WebSocket URL for real-time features. */
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000";

/** App name used in titles and branding. */
export const APP_NAME = "NutriAI";

// ── Pagination ───────────────────────────────────────────────────────────────

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const;

// ── User Roles ───────────────────────────────────────────────────────────────

export const ROLES = {
  ADMIN: "admin",
  DIETITIAN: "dietitian",
  PATIENT: "patient",
  SUPPORT: "support",
} as const;

export const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  dietitian: "Diyetisyen",
  patient: "Hasta",
  support: "Destek",
};

// ── Meal Types ───────────────────────────────────────────────────────────────

export const MEAL_TYPES = {
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DINNER: "dinner",
  SNACK: "snack",
  MORNING_SNACK: "morning_snack",
  AFTERNOON_SNACK: "afternoon_snack",
  EVENING_SNACK: "evening_snack",
} as const;

export const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Kahvalti",
  lunch: "Ogle Yemegi",
  dinner: "Aksam Yemegi",
  snack: "Ara Ogun",
  morning_snack: "Kus. Ara Ogun",
  afternoon_snack: "Ogleden S. Ara Ogun",
  evening_snack: "Aksam Ara Ogun",
};

// ── Appointment Status ───────────────────────────────────────────────────────

export const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
} as const;

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  scheduled: "Planlanmis",
  confirmed: "Onaylandi",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandi",
  cancelled: "Iptal Edildi",
  no_show: "Gelmedi",
};

// ── Plan Status ──────────────────────────────────────────────────────────────

export const PLAN_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const;

export const PLAN_STATUS_LABELS: Record<string, string> = {
  draft: "Taslak",
  active: "Aktif",
  paused: "Durakladi",
  completed: "Tamamlandi",
  archived: "Arsivlendi",
};

// ── Meal Approval Status ─────────────────────────────────────────────────────

export const MEAL_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

// ── Notification Types ───────────────────────────────────────────────────────

export const NOTIFICATION_TYPES = {
  APPOINTMENT: "appointment",
  MEAL: "meal",
  PLAN: "plan",
  MESSAGE: "message",
  SYSTEM: "system",
  REVIEW: "review",
} as const;

// ── Activity Levels ──────────────────────────────────────────────────────────

export const ACTIVITY_LEVELS = {
  SEDENTARY: "sedentary",
  LIGHTLY_ACTIVE: "lightly_active",
  MODERATELY_ACTIVE: "moderately_active",
  VERY_ACTIVE: "very_active",
  EXTREMELY_ACTIVE: "extremely_active",
} as const;

export const ACTIVITY_LEVEL_LABELS: Record<string, string> = {
  sedentary: "Hareketsiz",
  lightly_active: "Az Hareketli",
  moderately_active: "Orta Hareketli",
  very_active: "Cok Hareketli",
  extremely_active: "Ekstra Hareketli",
};

// ── Activity Level Multipliers (for TDEE) ────────────────────────────────────

export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

// ── Days of Week ─────────────────────────────────────────────────────────────

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const DAY_LABELS: Record<string, string> = {
  monday: "Pazartesi",
  tuesday: "Sali",
  wednesday: "Carsamba",
  thursday: "Persembe",
  friday: "Cuma",
  saturday: "Cumartesi",
  sunday: "Pazar",
};

// ── File Upload ──────────────────────────────────────────────────────────────

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const ACCEPTED_DOCUMENT_TYPES = ["application/pdf"] as const;

// ── Time Slots ───────────────────────────────────────────────────────────────

export const TIME_SLOT_DURATION = 30; // minutes
export const WORKING_HOURS_START = "09:00";
export const WORKING_HOURS_END = "18:00";
