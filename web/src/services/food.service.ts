import api from "@/lib/axios";

import type { FoodItem } from "@/types/food";
export type { FoodItem };

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface FoodCategory {
  id: string;
  label: string;
}

export async function searchFoods(query: string): Promise<FoodItem[]> {
  const { data } = await api.get("/foods", { params: { q: query } });
  // Backend returns { foods, total, page, limit }
  const result = data as any;
  return (result.foods ?? (Array.isArray(result) ? result : [])) as FoodItem[];
}

export async function getFood(id: string | number): Promise<FoodItem> {
  const { data } = await api.get(`/foods/${id}`);
  return data as FoodItem;
}

export async function getFoodCategories(): Promise<FoodCategory[]> {
  // Categories are derived from food data — not a separate endpoint yet
  // Return common Turkish food categories
  return [
    { id: "meyve", label: "Meyveler" },
    { id: "sebze", label: "Sebzeler" },
    { id: "et", label: "Et & Balik" },
    { id: "sut", label: "Sut Urunleri" },
    { id: "tahil", label: "Tahillar" },
    { id: "baklagil", label: "Baklagiller" },
    { id: "yag", label: "Yaglar" },
    { id: "icecek", label: "Icecekler" },
    { id: "atistirmalik", label: "Atistirmaliklar" },
    { id: "diger", label: "Diger" },
  ];
}

export async function getNutritionInfo(
  foodId: string | number,
  quantity: number,
  _unit?: string,
): Promise<NutritionInfo> {
  const food = await getFood(foodId);
  const factor = quantity / 100;
  return {
    calories: Math.round(((food as any).caloriesPer100g ?? 0) * factor),
    protein: Math.round(((food as any).proteinPer100g ?? 0) * factor * 10) / 10,
    carbs: Math.round(((food as any).carbsPer100g ?? 0) * factor * 10) / 10,
    fat: Math.round(((food as any).fatPer100g ?? 0) * factor * 10) / 10,
    fiber: (food as any).fiberPer100g ? Math.round((food as any).fiberPer100g * factor * 10) / 10 : undefined,
  };
}
