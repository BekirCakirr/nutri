// ---------------------------------------------------------------------------
// Tracking / Self-Monitoring Types
// ---------------------------------------------------------------------------

import type { DateRange, PaginationParams, Timestamps } from "./common";

// ── Weight ─────────────────────────────────────────────────────────────────

/** A single weight measurement. */
export interface WeightEntry extends Timestamps {
  id: string;
  patientId: string;
  date: string;
  weightKg: number;
  /** Optional body composition. */
  bodyFatPercentage?: number | null;
  muscleMassKg?: number | null;
  waterPercentage?: number | null;
  boneMassKg?: number | null;
  visceralFatLevel?: number | null;
  bmi?: number | null;
  source: TrackingSource;
  notes?: string | null;
}

/** Weight trend over time. */
export interface WeightTrend {
  patientId: string;
  period: DateRange;
  entries: WeightEntry[];
  startWeight: number;
  currentWeight: number;
  goalWeight?: number | null;
  changeKg: number;
  changePercent: number;
  trend: "losing" | "gaining" | "stable";
  averageWeeklyChangeKg: number;
  projectedGoalDate?: string | null;
}

// ── Water ──────────────────────────────────────────────────────────────────

/** A single water intake entry. */
export interface WaterEntry extends Timestamps {
  id: string;
  patientId: string;
  date: string;
  amountMl: number;
  time?: string | null;
  source: TrackingSource;
  drinkType?: WaterDrinkType;
  notes?: string | null;
}

/** Type of drink. */
export type WaterDrinkType =
  | "water"
  | "sparkling_water"
  | "tea"
  | "herbal_tea"
  | "coffee"
  | "juice"
  | "milk"
  | "smoothie"
  | "sports_drink"
  | "other";

/** Daily water summary. */
export interface DailyWaterSummary {
  patientId: string;
  date: string;
  totalMl: number;
  targetMl: number;
  percentOfTarget: number;
  entries: WaterEntry[];
}

// ── Exercise ───────────────────────────────────────────────────────────────

/** A single exercise / activity entry. */
export interface ExerciseEntry extends Timestamps {
  id: string;
  patientId: string;
  date: string;
  name: string;
  category: ExerciseCategory;
  intensity: ExerciseIntensity;
  durationMinutes: number;
  caloriesBurned?: number | null;
  distanceKm?: number | null;
  steps?: number | null;
  heartRateAvg?: number | null;
  heartRateMax?: number | null;
  sets?: ExerciseSet[] | null;
  source: TrackingSource;
  notes?: string | null;
}

/** Exercise category. */
export type ExerciseCategory =
  | "cardio"
  | "strength"
  | "flexibility"
  | "balance"
  | "sports"
  | "walking"
  | "running"
  | "cycling"
  | "swimming"
  | "yoga"
  | "pilates"
  | "hiit"
  | "dance"
  | "martial_arts"
  | "outdoor"
  | "other";

/** Exercise intensity level. */
export type ExerciseIntensity = "light" | "moderate" | "vigorous" | "maximum";

/** A set within a strength exercise. */
export interface ExerciseSet {
  setNumber: number;
  reps?: number;
  weightKg?: number;
  durationSeconds?: number;
  restSeconds?: number;
}

/** Daily exercise summary. */
export interface DailyExerciseSummary {
  patientId: string;
  date: string;
  totalDurationMinutes: number;
  totalCaloriesBurned: number;
  totalSteps: number;
  totalDistanceKm: number;
  entries: ExerciseEntry[];
  activeMinutesTarget?: number;
  stepsTarget?: number;
}

// ── Sleep ──────────────────────────────────────────────────────────────────

/** A single sleep entry. */
export interface SleepEntry extends Timestamps {
  id: string;
  patientId: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  durationMinutes: number;
  quality: SleepQuality;
  deepSleepMinutes?: number | null;
  lightSleepMinutes?: number | null;
  remSleepMinutes?: number | null;
  awakeMinutes?: number | null;
  awakenings?: number | null;
  source: TrackingSource;
  notes?: string | null;
}

/** Subjective sleep quality. */
export type SleepQuality = "excellent" | "good" | "fair" | "poor" | "terrible";

// ── Mood ───────────────────────────────────────────────────────────────────

/** A single mood check-in. */
export interface MoodEntry extends Timestamps {
  id: string;
  patientId: string;
  date: string;
  time?: string | null;
  /** 1-10 scale. */
  moodScore: number;
  mood: MoodType;
  /** 1-10 scale. */
  energyLevel?: number | null;
  /** 1-10 scale. */
  stressLevel?: number | null;
  emotions: string[];
  triggers?: string[];
  source: TrackingSource;
  notes?: string | null;
}

/** High-level mood label. */
export type MoodType =
  | "very_happy"
  | "happy"
  | "neutral"
  | "sad"
  | "very_sad"
  | "anxious"
  | "stressed"
  | "calm"
  | "energetic"
  | "tired"
  | "angry"
  | "grateful";

// ── Blood / Lab Values ─────────────────────────────────────────────────────

/** A single blood / lab value entry. */
export interface BloodValueEntry extends Timestamps {
  id: string;
  patientId: string;
  date: string;
  type: BloodValueType;
  value: number;
  unit: string;
  /** Lab-specific normal range. */
  normalRangeMin?: number | null;
  normalRangeMax?: number | null;
  isWithinNormalRange?: boolean | null;
  source: TrackingSource;
  labName?: string | null;
  orderedBy?: string | null;
  notes?: string | null;
}

/** Common blood / lab value types. */
export type BloodValueType =
  | "glucose_fasting"
  | "glucose_random"
  | "hba1c"
  | "insulin"
  | "cholesterol_total"
  | "cholesterol_ldl"
  | "cholesterol_hdl"
  | "triglycerides"
  | "blood_pressure_systolic"
  | "blood_pressure_diastolic"
  | "hemoglobin"
  | "iron"
  | "ferritin"
  | "vitamin_d"
  | "vitamin_b12"
  | "folate"
  | "thyroid_tsh"
  | "thyroid_t3"
  | "thyroid_t4"
  | "creatinine"
  | "uric_acid"
  | "alt"
  | "ast"
  | "crp"
  | "albumin"
  | "calcium"
  | "magnesium"
  | "potassium"
  | "sodium"
  | "zinc"
  | "omega3_index"
  | "other";

// ── Body Measurements ──────────────────────────────────────────────────────

/** Body circumference measurements. */
export interface BodyMeasurementEntry extends Timestamps {
  id: string;
  patientId: string;
  date: string;
  waistCm?: number | null;
  hipCm?: number | null;
  chestCm?: number | null;
  armCm?: number | null;
  thighCm?: number | null;
  calfCm?: number | null;
  neckCm?: number | null;
  waistToHipRatio?: number | null;
  source: TrackingSource;
  notes?: string | null;
}

// ── Shared ─────────────────────────────────────────────────────────────────

/** Where the entry originated. */
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

/** Comprehensive daily wellness summary. */
export interface DailyWellnessSummary {
  patientId: string;
  date: string;
  weight?: WeightEntry | null;
  waterIntake: DailyWaterSummary;
  exercise: DailyExerciseSummary;
  sleep?: SleepEntry | null;
  mood?: MoodEntry | null;
  bloodValues: BloodValueEntry[];
  bodyMeasurements?: BodyMeasurementEntry | null;
  overallWellnessScore?: number | null;
}

/** Tracking filters for history views. */
export interface TrackingFilters {
  patientId: string;
  type: "weight" | "water" | "exercise" | "sleep" | "mood" | "blood" | "body_measurement";
  dateRange: DateRange;
  sources?: TrackingSource[];
  pagination?: PaginationParams;
}

/** Tracking goals / targets for each metric. */
export interface TrackingTargets {
  patientId: string;
  weightGoalKg?: number | null;
  dailyWaterMl?: number | null;
  dailySteps?: number | null;
  weeklyExerciseMinutes?: number | null;
  dailySleepMinutes?: number | null;
  targetBodyFatPercent?: number | null;
}

/** Connected device / integration. */
export interface ConnectedDevice {
  id: string;
  userId: string;
  source: TrackingSource;
  deviceName: string;
  isConnected: boolean;
  lastSyncAt?: string | null;
  syncEnabled: boolean;
  dataTypes: string[];
  connectedAt: string;
}
