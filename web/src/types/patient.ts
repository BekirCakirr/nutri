// ---------------------------------------------------------------------------
// Patient Types
// ---------------------------------------------------------------------------

import type {
  ActivityLevel,
  DateRange,
  Gender,
  GenericStatus,
  PaginationParams,
  Timestamps,
} from "./common";
import type { AllergyInfo } from "./allergy";

/** Patient status within the platform. */
export type PatientStatus = "active" | "inactive" | "onboarding" | "paused" | "discharged";

/** Dietary preference / lifestyle. */
export type DietaryPreference =
  | "omnivore"
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "keto"
  | "paleo"
  | "mediterranean"
  | "gluten_free"
  | "dairy_free"
  | "halal"
  | "kosher"
  | "low_fodmap"
  | "other";

/** Goal direction for a nutritional target. */
export type GoalDirection = "increase" | "decrease" | "maintain";

/** Goal type. */
export type GoalType =
  | "weight_loss"
  | "weight_gain"
  | "muscle_gain"
  | "maintenance"
  | "health_improvement"
  | "disease_management"
  | "sports_performance"
  | "general_wellness"
  | "custom";

/** Goal priority. */
export type GoalPriority = "low" | "medium" | "high" | "critical";

/** Goal status. */
export type GoalStatus = "active" | "completed" | "paused" | "cancelled" | "expired";

// ── Core entities ──────────────────────────────────────────────────────────

/** Full patient entity. */
export interface Patient extends Timestamps {
  id: string;
  userId: string;
  dietitianId: string;
  status: PatientStatus;

  // Demographics
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  gender: Gender;
  dateOfBirth: string;
  age: number;

  // Physical
  heightCm: number;
  weightKg: number;
  bmi: number;
  bodyFatPercentage?: number | null;
  activityLevel: ActivityLevel;

  // Preferences & restrictions
  dietaryPreferences: DietaryPreference[];
  allergies: AllergyInfo[];
  medicalConditions: string[];
  medications: Medication[];
  foodDislikes: string[];

  // Goals
  goals: Goal[];
  primaryGoal?: Goal | null;

  // Nutrition targets
  dailyCalorieTarget?: number | null;
  macroTargets?: MacroTargets | null;
  microTargets?: MicroTarget[];

  // Meta
  notes?: string | null;
  tags: string[];
  referralSource?: string | null;
  emergencyContact?: EmergencyContact | null;
  insuranceInfo?: InsuranceInfo | null;

  // Engagement
  lastActivityAt?: string | null;
  onboardingCompletedAt?: string | null;
  nextAppointmentAt?: string | null;
  adherenceScore?: number | null;
}

/** Lightweight patient for list views. */
export interface PatientSummary {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string | null;
  email: string;
  status: PatientStatus;
  age: number;
  primaryGoal?: string | null;
  adherenceScore?: number | null;
  lastActivityAt?: string | null;
  nextAppointmentAt?: string | null;
  tags: string[];
}

/** Patient search / list filters. */
export interface PatientFilters {
  search?: string;
  status?: PatientStatus[];
  dietaryPreferences?: DietaryPreference[];
  goalTypes?: GoalType[];
  activityLevels?: ActivityLevel[];
  ageRange?: { min?: number; max?: number };
  bmiRange?: { min?: number; max?: number };
  adherenceRange?: { min?: number; max?: number };
  tags?: string[];
  hasUpcomingAppointment?: boolean;
  dateRange?: DateRange;
  pagination: PaginationParams;
}

// ── Supporting types ───────────────────────────────────────────────────────

/** Patient goal. */
export interface Goal extends Timestamps {
  id: string;
  patientId: string;
  type: GoalType;
  title: string;
  description?: string | null;
  direction: GoalDirection;
  priority: GoalPriority;
  status: GoalStatus;
  targetValue?: number | null;
  currentValue?: number | null;
  unit?: string | null;
  startDate: string;
  targetDate?: string | null;
  completedAt?: string | null;
  milestones: GoalMilestone[];
  progress: number;
}

/** Checkpoint within a goal. */
export interface GoalMilestone {
  id: string;
  title: string;
  targetValue: number;
  achievedValue?: number | null;
  targetDate: string;
  achievedAt?: string | null;
  isCompleted: boolean;
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

/** Single micronutrient target. */
export interface MicroTarget {
  nutrientId: string;
  nutrientName: string;
  targetValue: number;
  unit: string;
  minValue?: number;
  maxValue?: number;
}

/** Medication record. */
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy?: string;
  startDate?: string;
  endDate?: string | null;
  notes?: string;
  affectsNutrition: boolean;
}

/** Emergency contact. */
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

/** Insurance details. */
export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  holderName: string;
  expirationDate?: string;
}

/** High-level health metrics snapshot (dashboard). */
export interface HealthMetrics {
  patientId: string;
  date: string;
  weightKg?: number;
  bmi?: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  waterPercentage?: number;
  waistCm?: number;
  hipCm?: number;
  waistToHipRatio?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  restingHeartRate?: number;
  bloodGlucoseMgDl?: number;
  cholesterolTotalMgDl?: number;
  cholesterolLdlMgDl?: number;
  cholesterolHdlMgDl?: number;
  triglyceridesMgDl?: number;
  hba1cPercentage?: number;
  notes?: string;
}

/** Health metrics over time for charting. */
export interface HealthMetricsTrend {
  metric: keyof Omit<HealthMetrics, "patientId" | "date" | "notes">;
  label: string;
  unit: string;
  dataPoints: Array<{ date: string; value: number }>;
  average: number;
  min: number;
  max: number;
  trend: "improving" | "declining" | "stable";
}

/** Create / update patient request. */
export interface CreatePatientRequest {
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  dietaryPreferences?: DietaryPreference[];
  allergies?: string[];
  medicalConditions?: string[];
  goals?: Omit<Goal, "id" | "patientId" | "createdAt" | "updatedAt" | "milestones" | "progress">[];
  notes?: string;
  inviteCode?: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  status?: PatientStatus;
  tags?: string[];
}

/** Patient onboarding progress. */
export interface OnboardingProgress {
  patientId: string;
  steps: OnboardingStep[];
  completedSteps: number;
  totalSteps: number;
  isComplete: boolean;
  completedAt?: string | null;
}

export interface OnboardingStep {
  key: string;
  label: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string | null;
  isRequired: boolean;
  order: number;
}
