// ---------------------------------------------------------------------------
// Query Key Factory
// ---------------------------------------------------------------------------
//
// Centralised key constants for data-fetching / caching layers.
// Each key is a tuple so consumers can build hierarchical cache keys easily.
//
// Usage:
//   queryKeys.patients.list({ page: 1 })   => ["patients", "list", { page: 1 }]
//   queryKeys.patients.detail("p-123")      => ["patients", "detail", "p-123"]
// ---------------------------------------------------------------------------

export const queryKeys = {
  // ── Auth ─────────────────────────────────────────────────────────────────
  auth: {
    all: ["auth"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
    sessions: () => [...queryKeys.auth.all, "sessions"] as const,
  },

  // ── Patients ─────────────────────────────────────────────────────────────
  patients: {
    all: ["patients"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.patients.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.patients.all, "detail", id] as const,
    stats: (id: string) => [...queryKeys.patients.all, "stats", id] as const,
  },

  // ── Meals ────────────────────────────────────────────────────────────────
  meals: {
    all: ["meals"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.meals.all, "list", filters] as const,
    byPatient: (patientId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.meals.all, "byPatient", patientId, filters] as const,
    detail: (id: string) => [...queryKeys.meals.all, "detail", id] as const,
    stats: (filters?: Record<string, unknown>) =>
      [...queryKeys.meals.all, "stats", filters] as const,
  },

  // ── Plans ────────────────────────────────────────────────────────────────
  plans: {
    all: ["plans"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.plans.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.plans.all, "detail", id] as const,
    templates: () => [...queryKeys.plans.all, "templates"] as const,
  },

  // ── Appointments ─────────────────────────────────────────────────────────
  appointments: {
    all: ["appointments"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.appointments.all, "list", filters] as const,
    detail: (id: string) =>
      [...queryKeys.appointments.all, "detail", id] as const,
    availableSlots: (date: string) =>
      [...queryKeys.appointments.all, "availableSlots", date] as const,
  },

  // ── Messages ─────────────────────────────────────────────────────────────
  messages: {
    all: ["messages"] as const,
    conversations: () => [...queryKeys.messages.all, "conversations"] as const,
    conversation: (id: string) =>
      [...queryKeys.messages.all, "conversation", id] as const,
  },

  // ── Notifications ────────────────────────────────────────────────────────
  notifications: {
    all: ["notifications"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.notifications.all, "list", filters] as const,
    unreadCount: () => [...queryKeys.notifications.all, "unreadCount"] as const,
  },

  // ── Reports ──────────────────────────────────────────────────────────────
  reports: {
    all: ["reports"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.reports.all, "list", filters] as const,
    patient: (patientId: string) =>
      [...queryKeys.reports.all, "patient", patientId] as const,
  },

  // ── Recipes ──────────────────────────────────────────────────────────────
  recipes: {
    all: ["recipes"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.recipes.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.recipes.all, "detail", id] as const,
  },

  // ── Shopping Lists ───────────────────────────────────────────────────────
  shopping: {
    all: ["shopping"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.shopping.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.shopping.all, "detail", id] as const,
  },

  // ── Invite Codes ─────────────────────────────────────────────────────────
  inviteCodes: {
    all: ["inviteCodes"] as const,
    list: () => [...queryKeys.inviteCodes.all, "list"] as const,
    stats: () => [...queryKeys.inviteCodes.all, "stats"] as const,
  },

  // ── Reviews ──────────────────────────────────────────────────────────────
  reviews: {
    all: ["reviews"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.reviews.all, "list", filters] as const,
    stats: () => [...queryKeys.reviews.all, "stats"] as const,
  },

  // ── AI ───────────────────────────────────────────────────────────────────
  ai: {
    all: ["ai"] as const,
    suggestions: (context?: string) =>
      [...queryKeys.ai.all, "suggestions", context] as const,
  },

  // ── Foods / Nutrition DB ─────────────────────────────────────────────────
  foods: {
    all: ["foods"] as const,
    search: (query: string) => [...queryKeys.foods.all, "search", query] as const,
    detail: (id: string) => [...queryKeys.foods.all, "detail", id] as const,
    categories: () => [...queryKeys.foods.all, "categories"] as const,
  },

  // ── Admin ────────────────────────────────────────────────────────────────
  admin: {
    all: ["admin"] as const,
    stats: () => [...queryKeys.admin.all, "stats"] as const,
    users: (filters?: Record<string, unknown>) =>
      [...queryKeys.admin.all, "users", filters] as const,
    systemHealth: () => [...queryKeys.admin.all, "systemHealth"] as const,
  },

  // ── Dietitian Profile ────────────────────────────────────────────────────
  dietitianProfile: {
    all: ["dietitianProfile"] as const,
    profile: () => [...queryKeys.dietitianProfile.all, "profile"] as const,
    specializations: () =>
      [...queryKeys.dietitianProfile.all, "specializations"] as const,
  },
} as const;
