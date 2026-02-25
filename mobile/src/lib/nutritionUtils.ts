import type { NutritionInfo, MealItem } from '@/types';

/**
 * Sum nutrition from an array of meal items
 */
export function sumNutrition(items: MealItem[]): NutritionInfo {
  return items.reduce<NutritionInfo>(
    (acc, item) => {
      const factor = item.quantity;
      return {
        calories: acc.calories + item.food.nutrition.calories * factor,
        protein: acc.protein + item.food.nutrition.protein * factor,
        carbs: acc.carbs + item.food.nutrition.carbs * factor,
        fat: acc.fat + item.food.nutrition.fat * factor,
        fiber: (acc.fiber ?? 0) + (item.food.nutrition.fiber ?? 0) * factor,
        sugar: (acc.sugar ?? 0) + (item.food.nutrition.sugar ?? 0) * factor,
        sodium: (acc.sodium ?? 0) + (item.food.nutrition.sodium ?? 0) * factor,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
  );
}

/**
 * Merge multiple NutritionInfo objects
 */
export function mergeNutrition(...items: NutritionInfo[]): NutritionInfo {
  return items.reduce<NutritionInfo>(
    (acc, n) => ({
      calories: acc.calories + n.calories,
      protein: acc.protein + n.protein,
      carbs: acc.carbs + n.carbs,
      fat: acc.fat + n.fat,
      fiber: (acc.fiber ?? 0) + (n.fiber ?? 0),
      sugar: (acc.sugar ?? 0) + (n.sugar ?? 0),
      sodium: (acc.sodium ?? 0) + (n.sodium ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
  );
}

/**
 * Daily value percentages (based on 2000 kcal diet)
 */
const DAILY_VALUES = {
  calories: 2000,
  protein: 50,   // g
  carbs: 300,    // g
  fat: 65,       // g
  fiber: 25,     // g
  sugar: 50,     // g
  sodium: 2300,  // mg
} as const;

export function dailyValuePercent(
  nutrient: keyof typeof DAILY_VALUES,
  value: number,
): number {
  return Math.round((value / DAILY_VALUES[nutrient]) * 100);
}

/**
 * Calculate macro percentages from nutrition info
 */
export function macroPercentages(nutrition: NutritionInfo): {
  protein: number;
  carbs: number;
  fat: number;
} {
  const totalCals =
    nutrition.protein * 4 + nutrition.carbs * 4 + nutrition.fat * 9;
  if (totalCals === 0) return { protein: 0, carbs: 0, fat: 0 };

  return {
    protein: Math.round((nutrition.protein * 4 / totalCals) * 100),
    carbs: Math.round((nutrition.carbs * 4 / totalCals) * 100),
    fat: Math.round((nutrition.fat * 9 / totalCals) * 100),
  };
}

/**
 * Get calorie breakdown from macros
 */
export function caloriesFromMacros(nutrition: NutritionInfo): {
  fromProtein: number;
  fromCarbs: number;
  fromFat: number;
  total: number;
} {
  const fromProtein = nutrition.protein * 4;
  const fromCarbs = nutrition.carbs * 4;
  const fromFat = nutrition.fat * 9;
  return {
    fromProtein,
    fromCarbs,
    fromFat,
    total: fromProtein + fromCarbs + fromFat,
  };
}

/**
 * Check if daily nutrition targets are met
 */
export function isTargetMet(
  current: number,
  target: number,
  tolerancePercent = 5,
): boolean {
  const lower = target * (1 - tolerancePercent / 100);
  const upper = target * (1 + tolerancePercent / 100);
  return current >= lower && current <= upper;
}
