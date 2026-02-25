// ---------------------------------------------------------------------------
// Calorie & Nutrition Calculation Utilities
// ---------------------------------------------------------------------------

import type { ActivityLevel, Gender } from "@/types/common";
import { ACTIVITY_MULTIPLIERS } from "./constants";

// ── BMR (Basal Metabolic Rate) ───────────────────────────────────────────────

/**
 * Calculate Basal Metabolic Rate using the Mifflin-St Jeor equation.
 *
 * @param weight  Body weight in kilograms
 * @param height  Height in centimetres
 * @param age     Age in years
 * @param gender  "male" or "female" (other genders default to an average)
 * @returns BMR in kcal/day
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
): number {
  // Mifflin-St Jeor
  const base = 10 * weight + 6.25 * height - 5 * age;
  if (gender === "male") return Math.round(base + 5);
  if (gender === "female") return Math.round(base - 161);
  // For "other" / "prefer_not_to_say" take the midpoint
  return Math.round(base - 78);
}

// ── TDEE (Total Daily Energy Expenditure) ────────────────────────────────────

/**
 * Calculate TDEE by applying an activity multiplier to BMR.
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Convenience: calculate TDEE from raw biometrics in one call.
 */
export function calculateTDEEFromBiometrics(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel,
): number {
  return calculateTDEE(calculateBMR(weight, height, age, gender), activityLevel);
}

// ── BMI ──────────────────────────────────────────────────────────────────────

/**
 * Calculate Body Mass Index.
 *
 * @param weight Weight in kilograms
 * @param height Height in centimetres
 * @returns BMI value rounded to 1 decimal place
 */
export function calculateBMI(weight: number, height: number): number {
  if (height <= 0) return 0;
  const heightM = height / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

/** Human-readable BMI category. */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Zayif";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Kilolu";
  if (bmi < 35) return "Obez (Sinif I)";
  if (bmi < 40) return "Obez (Sinif II)";
  return "Morbid Obez (Sinif III)";
}

/** Returns a colour key for UI indicators. */
export function getBMIColor(bmi: number): "blue" | "green" | "yellow" | "orange" | "red" {
  if (bmi < 18.5) return "blue";
  if (bmi < 25) return "green";
  if (bmi < 30) return "yellow";
  if (bmi < 35) return "orange";
  return "red";
}

// ── Macro Distribution ───────────────────────────────────────────────────────

export interface MacroDistribution {
  /** Calories from protein. */
  proteinCalories: number;
  /** Grams of protein. */
  proteinGrams: number;
  /** Calories from carbohydrates. */
  carbCalories: number;
  /** Grams of carbohydrates. */
  carbGrams: number;
  /** Calories from fat. */
  fatCalories: number;
  /** Grams of fat. */
  fatGrams: number;
}

/**
 * Distribute a calorie target across macronutrients.
 *
 * @param totalCalories  Total daily kcal target
 * @param proteinPct     Percentage of calories from protein (default 30%)
 * @param carbPct        Percentage of calories from carbs (default 40%)
 * @param fatPct         Percentage of calories from fat (default 30%)
 */
export function getMacroDistribution(
  totalCalories: number,
  proteinPct = 30,
  carbPct = 40,
  fatPct = 30,
): MacroDistribution {
  const proteinCalories = Math.round(totalCalories * (proteinPct / 100));
  const carbCalories = Math.round(totalCalories * (carbPct / 100));
  const fatCalories = Math.round(totalCalories * (fatPct / 100));

  return {
    proteinCalories,
    proteinGrams: Math.round(proteinCalories / 4), // 4 kcal per gram
    carbCalories,
    carbGrams: Math.round(carbCalories / 4), // 4 kcal per gram
    fatCalories,
    fatGrams: Math.round(fatCalories / 9), // 9 kcal per gram
  };
}

// ── Goal Helpers ─────────────────────────────────────────────────────────────

export type WeightGoal = "lose" | "maintain" | "gain";

/**
 * Adjust TDEE for a weight goal.
 *
 * - lose:     TDEE - 500 kcal (approx 0.5 kg/week loss)
 * - maintain: TDEE unchanged
 * - gain:     TDEE + 300 kcal (lean gain)
 */
export function adjustCaloriesForGoal(tdee: number, goal: WeightGoal): number {
  switch (goal) {
    case "lose":
      return Math.max(1200, tdee - 500);
    case "gain":
      return tdee + 300;
    case "maintain":
    default:
      return tdee;
  }
}

// ── Water Intake ─────────────────────────────────────────────────────────────

/**
 * Estimate daily water intake in millilitres.
 *
 * General guideline: ~35 ml per kg of body weight.
 */
export function estimateWaterIntake(weightKg: number): number {
  return Math.round(weightKg * 35);
}

// ── Progress Helpers ─────────────────────────────────────────────────────────

/**
 * Calculate percentage of a calorie/macro target consumed.
 * Capped at 100 for progress-bar use.
 */
export function getProgressPercent(consumed: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((consumed / target) * 100));
}

/**
 * Calculate remaining calories / macros.
 * Returns 0 instead of negative values.
 */
export function getRemaining(consumed: number, target: number): number {
  return Math.max(0, target - consumed);
}
