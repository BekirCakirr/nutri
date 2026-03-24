import type { Meal, MealItem, MealType } from '@/types';
import apiClient from './client';
import { mockMeals } from '@/mock';

const USE_MOCK = false;
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

function mapDbMealToMobile(dbMeal: any): Meal {
  const items: MealItem[] = (dbMeal.items || []).map((item: any) => ({
    food: {
      id: String(item.food_id || ''),
      name: item.food_name,
      category: 'other' as const,
      servingSize: parseFloat(item.final_amount_g) || 100,
      servingUnit: 'g',
      nutrition: {
        calories: parseFloat(item.calories) || 0,
        protein: parseFloat(item.protein) || 0,
        carbs: parseFloat(item.carbs) || 0,
        fat: parseFloat(item.fat) || 0,
      },
    },
    quantity: parseFloat(item.final_amount_g) || 100,
    unit: 'g',
  }));

  // Map backend meal_type to mobile MealType
  const mealTypeMap: Record<string, MealType> = {
    breakfast: 'breakfast',
    morning_snack: 'snack',
    lunch: 'lunch',
    afternoon_snack: 'snack',
    dinner: 'dinner',
    evening_snack: 'snack',
    other: 'snack',
  };

  return {
    id: dbMeal.id,
    type: mealTypeMap[dbMeal.meal_type] || dbMeal.meal_type_mobile || 'snack',
    items,
    totalNutrition: {
      calories: parseFloat(dbMeal.total_calories) || 0,
      protein: parseFloat(dbMeal.total_protein) || 0,
      carbs: parseFloat(dbMeal.total_carbs) || 0,
      fat: parseFloat(dbMeal.total_fat) || 0,
    },
    date: dbMeal.log_date?.split('T')[0] || '',
    time: dbMeal.logged_at ? new Date(dbMeal.logged_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '',
    notes: dbMeal.notes || undefined,
  };
}

export async function getTodayMeals(): Promise<Meal[]> {
  if (USE_MOCK) {
    await delay();
    return mockMeals.filter((m) => m.date === '2026-02-25');
  }
  const { data } = await apiClient.get('/meals/today');
  return (data.data || []).map(mapDbMealToMobile);
}

export async function getMealHistory(startDate: string, endDate: string): Promise<Meal[]> {
  if (USE_MOCK) {
    await delay();
    return mockMeals.filter((m) => m.date >= startDate && m.date <= endDate);
  }
  const { data } = await apiClient.get('/meals/history', {
    params: { startDate, endDate },
  });
  return (data.data || []).map(mapDbMealToMobile);
}

export async function addMeal(
  type: MealType,
  items: MealItem[],
  date: string,
  time: string,
): Promise<Meal> {
  if (USE_MOCK) {
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

  // Map mobile MealType to backend meal_type
  const mealTypeMap: Record<MealType, string> = {
    breakfast: 'breakfast',
    lunch: 'lunch',
    dinner: 'dinner',
    snack: 'morning_snack',
  };

  const { data } = await apiClient.post('/meals', {
    mealType: mealTypeMap[type] || type,
    logDate: date,
    items: items.map((item) => ({
      foodId: parseInt(item.food.id, 10),
      amount: item.quantity,
    })),
    entryMethod: 'manual',
  });
  return mapDbMealToMobile(data.data);
}

export async function updateMeal(id: string, mealData: Partial<Meal>): Promise<Meal> {
  if (USE_MOCK) {
    await delay();
    const found = mockMeals.find((m) => m.id === id);
    return { ...found!, ...mealData };
  }
  const { data } = await apiClient.put(`/meals/${id}`, {
    mealType: mealData.type,
    notes: mealData.notes,
  });
  return mapDbMealToMobile(data.data);
}

export async function deleteMeal(id: string): Promise<void> {
  if (USE_MOCK) {
    await delay(400);
    return;
  }
  await apiClient.delete(`/meals/${id}`);
}

export async function getMealById(id: string): Promise<Meal | null> {
  if (USE_MOCK) {
    await delay(400);
    return mockMeals.find((m) => m.id === id) ?? null;
  }
  const { data } = await apiClient.get(`/meals/${id}`);
  return data.data ? mapDbMealToMobile(data.data) : null;
}
