// ---------------------------------------------------------------------------
// NutriAI – Shared Types (Web + Mobile)
// ---------------------------------------------------------------------------
// Types that are used by BOTH the web panel and the mobile app.
// Keep this module dependency-free so it can be consumed anywhere.
// ---------------------------------------------------------------------------

// ── Enums ──────────────────────────────────────────────────────────────────

/** Roles available in the platform. */
export enum UserRole {
  Admin = "admin",
  Dietitian = "dietitian",
  Patient = "patient",
  Support = "support",
}

/** Type of meal within the day. */
export enum MealType {
  Breakfast = "breakfast",
  MorningSnack = "morning_snack",
  Lunch = "lunch",
  AfternoonSnack = "afternoon_snack",
  Dinner = "dinner",
  EveningSnack = "evening_snack",
  Other = "other",
}

/** Appointment lifecycle status. */
export enum AppointmentStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  InProgress = "in_progress",
  Completed = "completed",
  Cancelled = "cancelled",
  NoShow = "no_show",
  Rescheduled = "rescheduled",
}

/** Message content type. */
export enum MessageType {
  Text = "text",
  Image = "image",
  File = "file",
  Audio = "audio",
  Video = "video",
  MealLog = "meal_log",
  PlanUpdate = "plan_update",
  Appointment = "appointment",
  System = "system",
  AiSuggestion = "ai_suggestion",
}

/** Notification category. */
export enum NotificationType {
  Appointment = "appointment",
  Message = "message",
  PlanUpdate = "plan_update",
  GoalProgress = "goal_progress",
  MealReminder = "meal_reminder",
  TrackingReminder = "tracking_reminder",
  PatientActivity = "patient_activity",
  Achievement = "achievement",
  System = "system",
  Billing = "billing",
  Review = "review",
  InviteCode = "invite_code",
  AiInsight = "ai_insight",
  Report = "report",
  ShoppingList = "shopping_list",
}

/** Goal type. */
export enum GoalType {
  WeightLoss = "weight_loss",
  WeightGain = "weight_gain",
  MuscleGain = "muscle_gain",
  Maintenance = "maintenance",
  HealthImprovement = "health_improvement",
  DiseaseManagement = "disease_management",
  SportsPerformance = "sports_performance",
  GeneralWellness = "general_wellness",
  Custom = "custom",
}

/** Allergen category. */
export enum AllergenCategory {
  FoodAllergen = "food_allergen",
  FoodIntolerance = "food_intolerance",
  DrugAllergen = "drug_allergen",
  Environmental = "environmental",
  Other = "other",
}

/** Allergy severity. */
export enum AllergySeverity {
  Mild = "mild",
  Moderate = "moderate",
  Severe = "severe",
  Anaphylactic = "anaphylactic",
}

// ── Shared scalar types ────────────────────────────────────────────────────

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extremely_active";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ThemeMode = "light" | "dark" | "system";

export type GenericStatus = "active" | "inactive" | "pending" | "archived" | "suspended";

export type NutritionUnit = "g" | "mg" | "mcg" | "kcal" | "kJ" | "IU" | "ml" | "oz" | "lb" | "kg";

// ── Shared interfaces ─────────────────────────────────────────────────────

/** Standard envelope for every API response. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
  meta?: PaginationMeta;
  timestamp: string;
}

/** Structured API error. */
export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

/** Pagination metadata. */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Pagination request parameters. */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Paginated list wrapper. */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/** Inclusive date range. */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/** Audit timestamp fields. */
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/** Locale / i18n preference. */
export interface LocalePreference {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  measurementSystem: "metric" | "imperial";
  currency: string;
}

/** Aggregated nutrition information. */
export interface NutritionInfo {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  saturatedFatG: number;
  transFatG?: number;
  monounsaturatedFatG?: number;
  polyunsaturatedFatG?: number;
  cholesterolMg: number;
  sodiumMg: number;
  potassiumMg?: number;
  calciumMg?: number;
  ironMg?: number;
  vitaminAMcg?: number;
  vitaminCMg?: number;
  vitaminDMcg?: number;
  vitaminEMg?: number;
  vitaminKMcg?: number;
  vitaminB6Mg?: number;
  vitaminB12Mcg?: number;
  folateMcg?: number;
  magnesiumMg?: number;
  zincMg?: number;
  seleniumMcg?: number;
  omega3Mg?: number;
  omega6Mg?: number;
  caffeineMg?: number;
  alcoholG?: number;
  waterMl?: number;
}

/** Daily macronutrient targets. */
export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  sugarG?: number;
  saturatedFatG?: number;
  sodiumMg?: number;
}

/** Generic dropdown / select option. */
export interface SelectOption<V = string> {
  label: string;
  value: V;
  disabled?: boolean;
}

/** Contact information. */
export interface ContactInfo {
  email: string;
  phone?: string;
  secondaryEmail?: string;
  secondaryPhone?: string;
}

/** Address. */
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  apartment?: string;
  latitude?: number;
  longitude?: number;
}

/** File upload metadata. */
export interface FileUpload {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
}

// ── User types ─────────────────────────────────────────────────────────────

/** Minimal user object shared across platforms. */
export interface SharedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string | null;
  role: UserRole;
  locale: LocalePreference;
  theme: ThemeMode;
}

/** Auth tokens shared between platforms. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

/** Login request. */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

/** Patient registration request. */
export interface RegisterPatientRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  inviteCode?: string;
}

/** Dietitian registration request. */
export interface RegisterDietitianRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title?: string;
  licenseNumber: string;
  specializations?: string[];
  university?: string;
  experienceYears?: number;
  bio?: string;
  city?: string;
}

/** Refresh token request. */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** Auth response (returned after login/register). */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  };
  tokens: AuthTokens;
}

/** Entry method for meal logging. */
export type MealEntryMethod = "manual" | "photo_ai" | "barcode" | "voice" | "ocr" | "text_ai";

/** Usage mode for patient (AI-only vs with dietitian). */
export type UsageMode = "ai_independent" | "with_dietitian";

/** Lightweight patient reference. */
export interface SharedPatientRef {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string | null;
}

/** Lightweight dietitian reference. */
export interface SharedDietitianRef {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string | null;
}

/** Patient profile shared fields. */
export interface PatientProfile {
  id: string;
  userId: string;
  dateOfBirth: string;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goalType: GoalType;
  targetWeight?: number;
  activityLevel: ActivityLevel;
  allergies: string[];
  dietaryPreferences: string[];
  medicalConditions: string[];
  dietitianId?: string;
}

/** Dietitian profile shared fields. */
export interface DietitianProfile {
  id: string;
  userId: string;
  specializations: string[];
  licenseNumber: string;
  yearsOfExperience: number;
  bio: string;
  workingHours: WorkingHours;
  averageRating: number;
  totalReviews: number;
  totalPatients: number;
}

/** Working hours schedule. */
export interface WorkingHours {
  monday: DaySchedule | null;
  tuesday: DaySchedule | null;
  wednesday: DaySchedule | null;
  thursday: DaySchedule | null;
  friday: DaySchedule | null;
  saturday: DaySchedule | null;
  sunday: DaySchedule | null;
}

/** A single day's schedule. */
export interface DaySchedule {
  /** HH:mm format. */
  start: string;
  /** HH:mm format. */
  end: string;
}

// ── Food & meal types ──────────────────────────────────────────────────────

/** Serving size option for food items. */
export interface ServingSize {
  id: string;
  name: string;
  amountG: number;
  unit: string;
  isDefault: boolean;
}

/** Lightweight food item reference. */
export interface FoodItemRef {
  id: string;
  name: string;
  brandName?: string | null;
  category: string;
  caloriesPer100g: number;
  defaultServing: ServingSize;
  imageUrl?: string | null;
  barcode?: string | null;
}

/** A food item within a meal. */
export interface MealFoodItem {
  foodId: string;
  name: string;
  quantity: number;
  servingUnit: string;
  nutrition: NutritionInfo;
}

/** A meal entry. */
export interface MealEntry {
  id: string;
  userId: string;
  type: MealType;
  foods: MealFoodItem[];
  totalNutrition: NutritionInfo;
  notes?: string;
  imageUrl?: string;
  status: "pending" | "approved" | "rejected";
  dietitianNote?: string;
  createdAt: string;
}

// ── Plan types ─────────────────────────────────────────────────────────────

/** A diet plan. */
export interface DietPlan {
  id: string;
  title: string;
  patientId: string;
  dietitianId: string;
  startDate: string;
  endDate?: string;
  dailyTargets: MacroTargets;
  days: PlanDay[];
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

/** A single day within a plan. */
export interface PlanDay {
  dayIndex: number;
  dayOfWeek?: DayOfWeek;
  meals: PlanMeal[];
  notes?: string;
}

/** A meal within a plan day. */
export interface PlanMeal {
  type: MealType;
  name?: string;
  foods: MealFoodItem[];
  alternatives?: MealFoodItem[][];
  notes?: string;
}

// ── Messaging types ────────────────────────────────────────────────────────

/** A conversation. */
export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

/** A participant in a conversation. */
export interface ConversationParticipant {
  userId: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  isOnline: boolean;
}

/** A message. */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  readAt?: string;
  createdAt: string;
  attachments?: MessageAttachment[];
}

/** A message attachment. */
export interface MessageAttachment {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string | null;
}

// ── Appointment types ──────────────────────────────────────────────────────

/** An appointment. */
export interface Appointment {
  id: string;
  patientId: string;
  dietitianId: string;
  patientName: string;
  dietitianName: string;
  scheduledAt: string;
  durationMinutes: number;
  mode: "in_person" | "video" | "phone" | "chat";
  status: AppointmentStatus;
  notes?: string;
  meetingUrl?: string;
}

// ── Tracking types ─────────────────────────────────────────────────────────

/** Tracking entry source. */
export type TrackingSource =
  | "manual"
  | "apple_health"
  | "google_fit"
  | "fitbit"
  | "garmin"
  | "samsung_health"
  | "withings"
  | "oura"
  | "whoop"
  | "strava"
  | "myfitnesspal"
  | "device_sync"
  | "ai_estimate"
  | "other";

/** Weight entry. */
export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercentage?: number | null;
  source: TrackingSource;
  notes?: string;
}

/** Water intake entry. */
export interface WaterEntry {
  id: string;
  date: string;
  /** Millilitres. */
  amountMl: number;
  time?: string;
  source: TrackingSource;
}

/** Exercise / activity entry. */
export interface ExerciseEntry {
  id: string;
  date: string;
  name: string;
  category: string;
  /** Minutes. */
  durationMinutes: number;
  caloriesBurned?: number;
  source: TrackingSource;
}

/** Sleep entry. */
export interface SleepEntry {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  durationMinutes: number;
  quality: "excellent" | "good" | "fair" | "poor" | "terrible";
  source: TrackingSource;
}

/** Mood check-in entry. */
export interface MoodEntry {
  id: string;
  date: string;
  /** 1-10 scale. */
  moodScore: number;
  mood: string;
  notes?: string;
  source: TrackingSource;
}

// ── Notification types ─────────────────────────────────────────────────────

/** Notification payload shared between web and mobile. */
export interface SharedNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  imageUrl?: string | null;
  actionUrl?: string | null;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

/** Push notification device registration. */
export interface DeviceRegistration {
  token: string;
  platform: "web" | "ios" | "android";
  deviceId: string;
  deviceName?: string;
}

// ── Gamification types ─────────────────────────────────────────────────────

/** A badge. */
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: "nutrition" | "fitness" | "streak" | "social" | "milestone" | "special";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
}

/** A challenge. */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  xpReward: number;
  isCompleted: boolean;
}

/** Gamification profile summary. */
export interface GamificationProfile {
  level: number;
  levelName: string;
  totalXP: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalBadges: number;
  rank?: number;
}

// ── Allergy types ──────────────────────────────────────────────────────────

/** Allergen summary reference. */
export interface AllergenRef {
  id: string;
  name: string;
  code: string;
  category: AllergenCategory;
  isMajor: boolean;
}

/** A patient allergy record. */
export interface AllergyRecord {
  id: string;
  allergenId: string;
  allergenName: string;
  severity: AllergySeverity;
  reactions: string[];
  isActive: boolean;
}

// ── WebSocket types ────────────────────────────────────────────────────────

/** WebSocket event envelope. */
export interface WSEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
}
