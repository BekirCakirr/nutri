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

/** Shape the backend returns after snake→camelCase transform */
interface ApiFoodResponse {
  foods?: FoodItem[];
  total?: number;
  page?: number;
  limit?: number;
}

/** Backend food row fields after camelCase transform */
interface ApiFoodRow extends FoodItem {
  caloriesPer100g?: number;
  proteinPer100g?: number;
  carbsPer100g?: number;
  fatPer100g?: number;
  fiberPer100g?: number;
}

export async function searchFoods(query: string): Promise<FoodItem[]> {
  const { data } = await api.get("/foods", { params: { q: query } });
  const result = data as ApiFoodResponse;
  return result.foods ?? (Array.isArray(data) ? (data as FoodItem[]) : []);
}

export async function getFood(id: string | number): Promise<ApiFoodRow> {
  const { data } = await api.get(`/foods/${id}`);
  return data as ApiFoodRow;
}

export async function getFoodCategories(): Promise<FoodCategory[]> {
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
    calories: Math.round((food.caloriesPer100g ?? 0) * factor),
    protein: Math.round((food.proteinPer100g ?? 0) * factor * 10) / 10,
    carbs: Math.round((food.carbsPer100g ?? 0) * factor * 10) / 10,
    fat: Math.round((food.fatPer100g ?? 0) * factor * 10) / 10,
    fiber: food.fiberPer100g ? Math.round(food.fiberPer100g * factor * 10) / 10 : undefined,
  };
}
