// ---------------------------------------------------------------------------
// Meal Types
// ---------------------------------------------------------------------------

import type { Timestamps } from "./common";
import type { NutritionInfo } from "./food";

/** Type of meal within the day. */
export const MealType = {
  Breakfast: "breakfast",
  MorningSnack: "morning_snack",
  Lunch: "lunch",
  AfternoonSnack: "afternoon_snack",
  Dinner: "dinner",
  EveningSnack: "evening_snack",
  Other: "other",
} as const
export type MealType = (typeof MealType)[keyof typeof MealType]

/** How the meal entry was logged. */
export type MealLogSource =
  | "manual"
  | "barcode_scan"
  | "photo_ai"
  | "voice"
  | "recipe"
  | "quick_add"
  | "copy_previous"
  | "diet_plan";

/** Meal entry verification state. */
export type MealVerificationStatus = "unverified" | "verified" | "flagged" | "adjusted";

// ── Core entities ──────────────────────────────────────────────────────────

/** A single meal occasion (e.g. today's breakfast). */
export interface Meal extends Timestamps {
  id: string;
  patientId: string;
  date: string;
  mealType: MealType;
  name?: string | null;
  entries: MealEntry[];
  totalNutrition: NutritionInfo;
  notes?: string | null;
  imageUrl?: string | null;
  imageUrls?: string[];
  logSource: MealLogSource;
  verificationStatus: MealVerificationStatus;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  mood?: MealMood | null;
  hungerBefore?: number | null;
  fullnessAfter?: number | null;
  location?: string | null;
  eatingDurationMinutes?: number | null;
}

/** A single food item within a meal. */
export interface MealEntry extends Timestamps {
  id: string;
  mealId: string;
  foodItemId?: string | null;
  recipeId?: string | null;
  customName?: string | null;
  brandName?: string | null;
  servingSize: number;
  servingUnit: string;
  servingDescription?: string;
  numberOfServings: number;
  nutrition: NutritionInfo;
  notes?: string | null;
  imageUrl?: string | null;
  barcode?: string | null;
  logSource: MealLogSource;
  isCustomEntry: boolean;
}

/** Emotional state around a meal. */
export type MealMood =
  | "great"
  | "good"
  | "neutral"
  | "bad"
  | "terrible"
  | "stressed"
  | "anxious"
  | "happy"
  | "bored"
  | "tired";

/** Full day nutrition summary. */
export interface DailyNutritionSummary {
  patientId: string;
  date: string;
  meals: Meal[];
  totalNutrition: NutritionInfo;
  targets: DailyNutritionTargets;
  compliance: NutritionCompliance;
  waterIntakeMl: number;
  waterTargetMl: number;
  mealCount: number;
  completedMeals: MealType[];
  missedMeals: MealType[];
}

/** Target values for a single day. */
export interface DailyNutritionTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  sugarG?: number;
  sodiumMg?: number;
  waterMl?: number;
}

/** How well actual intake matches targets. */
export interface NutritionCompliance {
  caloriesPercent: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
  fiberPercent?: number;
  overallScore: number;
  status: "on_track" | "under" | "over" | "mixed";
}

// ── Requests ───────────────────────────────────────────────────────────────

/** Log a new meal. */
export interface CreateMealRequest {
  date: string;
  mealType: MealType;
  name?: string;
  entries: CreateMealEntryRequest[];
  notes?: string;
  imageUrl?: string;
  logSource?: MealLogSource;
  mood?: MealMood;
  hungerBefore?: number;
  fullnessAfter?: number;
  location?: string;
  eatingDurationMinutes?: number;
}

/** Create a food entry within a meal. */
export interface CreateMealEntryRequest {
  foodItemId?: string;
  recipeId?: string;
  customName?: string;
  brandName?: string;
  servingSize: number;
  servingUnit: string;
  numberOfServings: number;
  nutrition?: Partial<NutritionInfo>;
  notes?: string;
  barcode?: string;
  logSource?: MealLogSource;
}

/** Update an existing meal. */
export interface UpdateMealRequest extends Partial<CreateMealRequest> {
  id: string;
}

/** Quick-add shortcut (just calories + optional macros). */
export interface QuickAddRequest {
  date: string;
  mealType: MealType;
  name: string;
  calories: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
}

/** Copy a meal from a previous date. */
export interface CopyMealRequest {
  sourceMealId: string;
  targetDate: string;
  targetMealType?: MealType;
}

/** Frequently / recently eaten item for quick selection. */
export interface FrequentFood {
  foodItemId: string;
  name: string;
  brandName?: string;
  servingSize: number;
  servingUnit: string;
  numberOfServings: number;
  nutrition: NutritionInfo;
  frequency: number;
  lastEatenAt: string;
}

/** Meal history filters. */
export interface MealHistoryFilters {
  patientId: string;
  startDate: string;
  endDate: string;
  mealTypes?: MealType[];
  logSources?: MealLogSource[];
  search?: string;
  verificationStatus?: MealVerificationStatus[];
}
