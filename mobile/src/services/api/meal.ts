import type { Meal, MealItem, MealType } from '@/types';
import { mockMeals } from '@/mock';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function getTodayMeals(): Promise<Meal[]> {
  await delay();
  return mockMeals.filter((m) => m.date === '2026-02-25');
}

export async function getMealHistory(startDate: string, endDate: string): Promise<Meal[]> {
  await delay();
  return mockMeals.filter((m) => m.date >= startDate && m.date <= endDate);
}

export async function addMeal(
  type: MealType,
  items: MealItem[],
  date: string,
  time: string,
): Promise<Meal> {
  await delay();
  return {
    id: 'meal-' + Date.now(),
    type,
    items,
    date,
    time,
    totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  };
}

export async function updateMeal(id: string, data: Partial<Meal>): Promise<Meal> {
  await delay();
  const found = mockMeals.find((m) => m.id === id);
  return { ...found!, ...data };
}

export async function deleteMeal(id: string): Promise<void> {
  await delay(400);
}

export async function getMealById(id: string): Promise<Meal | null> {
  await delay(400);
  return mockMeals.find((m) => m.id === id) ?? null;
}
