import type { ActivityLevel, Goal } from '@/types';
import { ACTIVITY_LEVEL_MULTIPLIERS } from './constants';

/**
 * Mifflin-St Jeor equation for BMR
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

/**
 * Total Daily Energy Expenditure
 */
export function calculateTDEE(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: ActivityLevel,
): number {
  const bmr = calculateBMR(weight, height, age, gender);
  const multiplier = ACTIVITY_LEVEL_MULTIPLIERS[activityLevel] ?? 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Body Mass Index
 */
export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

/**
 * BMI category string
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

/**
 * Daily calorie target based on goal
 */
export function calculateCalorieTarget(tdee: number, goal: Goal): number {
  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500);
    case 'gain':
      return Math.round(tdee + 300);
    case 'maintain':
    default:
      return Math.round(tdee);
  }
}

/**
 * Recommended macro split (grams) based on calorie target
 */
export function calculateMacros(
  calories: number,
  goal: Goal,
): { protein: number; carbs: number; fat: number } {
  let proteinPct: number;
  let carbsPct: number;
  let fatPct: number;

  switch (goal) {
    case 'lose':
      proteinPct = 0.35;
      carbsPct = 0.35;
      fatPct = 0.30;
      break;
    case 'gain':
      proteinPct = 0.30;
      carbsPct = 0.45;
      fatPct = 0.25;
      break;
    case 'maintain':
    default:
      proteinPct = 0.25;
      carbsPct = 0.50;
      fatPct = 0.25;
      break;
  }

  return {
    protein: Math.round((calories * proteinPct) / 4),
    carbs: Math.round((calories * carbsPct) / 4),
    fat: Math.round((calories * fatPct) / 9),
  };
}

/**
 * Ideal weight range (BMI 18.5-24.9)
 */
export function idealWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return {
    min: parseFloat((18.5 * heightM * heightM).toFixed(1)),
    max: parseFloat((24.9 * heightM * heightM).toFixed(1)),
  };
}

/**
 * Water intake recommendation (ml) based on weight
 */
export function recommendedWaterIntake(weightKg: number): number {
  return Math.round(weightKg * 35);
}
