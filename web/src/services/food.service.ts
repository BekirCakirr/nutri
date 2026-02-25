// ---------------------------------------------------------------------------
// Food / Nutrition Database Service
// ---------------------------------------------------------------------------

import { simulateApiCall } from "@/mock";
import { foods, foodCategories } from "@/mock/foods";
import type { FoodItem, FoodCategory } from "@/mock/foods";

export type { FoodItem, FoodCategory };

// ── Types ────────────────────────────────────────────────────────────────────

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: number;
  servingUnit: string;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function searchFoods(query: string): Promise<FoodItem[]> {
  const q = query.toLowerCase();
  const results = foods.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q),
  );
  return simulateApiCall(results, 300);
}

export async function getFood(id: string): Promise<FoodItem> {
  const food = foods.find((f) => f.id === id) ?? foods[0];
  return simulateApiCall(food, 300);
}

export async function getFoodCategories(): Promise<
  { id: FoodCategory; label: string }[]
> {
  return simulateApiCall([...foodCategories], 300);
}

export async function getNutritionInfo(
  foodId: string,
  quantity: number,
  unit: string,
): Promise<NutritionInfo> {
  const food = foods.find((f) => f.id === foodId) ?? foods[0];
  void unit;

  // Scale nutrition values based on quantity vs serving size
  const scale = quantity / food.servingSize;

  return simulateApiCall(
    {
      calories: Math.round(food.calories * scale),
      protein: Math.round(food.protein * scale * 10) / 10,
      carbs: Math.round(food.carbs * scale * 10) / 10,
      fat: Math.round(food.fat * scale * 10) / 10,
      fiber: Math.round(food.fiber * scale * 10) / 10,
      sugar: Math.round(food.sugar * scale * 10) / 10,
      sodium: Math.round(food.sodium * scale),
      servingSize: quantity,
      servingUnit: unit,
    },
    300,
  );
}
