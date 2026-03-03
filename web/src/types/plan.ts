// ---------------------------------------------------------------------------
// Diet Plan Types
// ---------------------------------------------------------------------------

import type { DayOfWeek, Timestamps, PaginationParams, DateRange } from "./common";
import type { NutritionInfo } from "./food";
import type { MealType } from "./meal";
import type { MacroTargets } from "./patient";

/** Plan status lifecycle. */
export type PlanStatus = "draft" | "pending_review" | "active" | "paused" | "completed" | "archived" | "cancelled";

/** Plan visibility. */
export type PlanVisibility = "private" | "shared" | "template";

/** How strictly the plan should be followed. */
export type PlanFlexibility = "strict" | "moderate" | "flexible";

// ── Core entities ──────────────────────────────────────────────────────────

/** A diet plan assigned to a patient. */
export interface DietPlan extends Timestamps {
  id: string;
  patientId: string;
  dietitianId: string;
  title: string;
  description?: string | null;
  status: PlanStatus;
  visibility: PlanVisibility;
  flexibility: PlanFlexibility;

  startDate: string;
  endDate?: string | null;
  durationWeeks?: number | null;

  /** Overall daily targets when no day-specific override exists. */
  defaultTargets: MacroTargets;

  /** Per-day breakdown. */
  days: PlanDay[];

  /** Plan-level notes from the dietitian. */
  notes?: string | null;
  /** Instructions for the patient. */
  instructions?: string | null;

  /** Tags for filtering. */
  tags: string[];

  /** AI-generated or not. */
  isAiGenerated: boolean;
  /** Originating template id, if any. */
  templateId?: string | null;

  /** Adherence stats (computed). */
  adherencePercent?: number | null;
  completedDays?: number | null;
  totalDays?: number | null;

  /** Last time the patient acknowledged the plan. */
  acknowledgedAt?: string | null;
}

/** Lightweight plan for list views. */
export interface DietPlanSummary {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  status: PlanStatus;
  startDate: string;
  endDate?: string | null;
  adherencePercent?: number | null;
  tags: string[];
  isAiGenerated: boolean;
  createdAt: string;
}

/** A single day within the plan. */
export interface PlanDay {
  id: string;
  planId: string;
  /** 0 = first day, or ISO weekday. */
  dayIndex: number;
  dayOfWeek?: DayOfWeek;
  label?: string;
  meals: PlanMeal[];
  targets?: Partial<MacroTargets>;
  totalNutrition: NutritionInfo;
  notes?: string | null;
}

/** A meal slot within a plan day. */
export interface PlanMeal {
  id: string;
  planDayId: string;
  mealType: MealType;
  name?: string;
  timeSlot?: string;
  items: PlanMealItem[];
  alternatives?: PlanMealAlternative[];
  totalNutrition: NutritionInfo;
  notes?: string | null;
  isOptional: boolean;
}

/** A food / recipe item within a plan meal. */
export interface PlanMealItem {
  id: string;
  planMealId: string;
  foodItemId?: string | null;
  recipeId?: string | null;
  customName?: string | null;
  servingSize: number;
  servingUnit: string;
  numberOfServings: number;
  nutrition: NutritionInfo;
  notes?: string | null;
  sortOrder: number;
}

/** Alternative option the patient can swap in. */
export interface PlanMealAlternative {
  id: string;
  planMealId: string;
  label: string;
  items: PlanMealItem[];
  totalNutrition: NutritionInfo;
}

// ── Templates ──────────────────────────────────────────────────────────────

/** Reusable plan template. */
export interface PlanTemplate extends Timestamps {
  id: string;
  dietitianId: string;
  title: string;
  description?: string | null;
  category: PlanTemplateCategory;
  tags: string[];
  durationWeeks: number;
  defaultTargets: MacroTargets;
  days: PlanDay[];
  isPublic: boolean;
  usageCount: number;
  averageRating?: number | null;
  imageUrl?: string | null;
}

/** Template category. */
export type PlanTemplateCategory =
  | "weight_loss"
  | "weight_gain"
  | "muscle_building"
  | "maintenance"
  | "diabetes"
  | "heart_health"
  | "pregnancy"
  | "vegetarian"
  | "vegan"
  | "keto"
  | "mediterranean"
  | "low_fodmap"
  | "gluten_free"
  | "sports"
  | "general"
  | "custom";

/** Lightweight template for browsing. */
export interface PlanTemplateSummary {
  id: string;
  title: string;
  description?: string | null;
  category: PlanTemplateCategory;
  durationWeeks: number;
  tags: string[];
  isPublic: boolean;
  usageCount: number;
  averageRating?: number | null;
  imageUrl?: string | null;
  dietitianName: string;
}

// ── Requests ───────────────────────────────────────────────────────────────

/** Create a new diet plan. */
export interface CreateDietPlanRequest {
  patientId: string;
  title: string;
  description?: string;
  flexibility?: PlanFlexibility;
  startDate: string;
  endDate?: string;
  durationWeeks?: number;
  defaultTargets: MacroTargets;
  days: CreatePlanDayRequest[];
  notes?: string;
  instructions?: string;
  tags?: string[];
  templateId?: string;
}

/** Create a plan day. */
export interface CreatePlanDayRequest {
  dayIndex: number;
  dayOfWeek?: DayOfWeek;
  label?: string;
  meals: CreatePlanMealRequest[];
  targets?: Partial<MacroTargets>;
  notes?: string;
}

/** Create a plan meal. */
export interface CreatePlanMealRequest {
  mealType: MealType;
  name?: string;
  timeSlot?: string;
  items: CreatePlanMealItemRequest[];
  alternatives?: CreatePlanMealAlternativeRequest[];
  notes?: string;
  isOptional?: boolean;
}

/** Create a plan meal item. */
export interface CreatePlanMealItemRequest {
  foodItemId?: string;
  recipeId?: string;
  customName?: string;
  servingSize: number;
  servingUnit: string;
  numberOfServings: number;
  nutrition?: Partial<NutritionInfo>;
  notes?: string;
  sortOrder?: number;
}

/** Create an alternative swap option. */
export interface CreatePlanMealAlternativeRequest {
  label: string;
  items: CreatePlanMealItemRequest[];
}

/** Update an existing diet plan. */
export interface UpdateDietPlanRequest extends Partial<CreateDietPlanRequest> {
  id: string;
  status?: PlanStatus;
}

/** Filters for listing plans. */
export interface DietPlanFilters {
  patientId?: string;
  dietitianId?: string;
  status?: PlanStatus[];
  tags?: string[];
  isAiGenerated?: boolean;
  search?: string;
  dateRange?: DateRange;
  pagination: PaginationParams;
}

/** Plan adherence detail for a given day. */
export interface PlanAdherenceDay {
  date: string;
  planDayId: string;
  plannedNutrition: NutritionInfo;
  actualNutrition: NutritionInfo;
  adherencePercent: number;
  mealAdherence: Array<{
    mealType: MealType;
    planned: boolean;
    logged: boolean;
    adherencePercent: number;
  }>;
}

/** Plan adherence report over a period. */
export interface PlanAdherenceReport {
  planId: string;
  period: DateRange;
  overallAdherence: number;
  dailyAdherence: PlanAdherenceDay[];
  bestDay: PlanAdherenceDay;
  worstDay: PlanAdherenceDay;
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
}
