import type { Meal, MealItem, MealType } from '@/types';
import apiClient from './client';

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
  try {
    const { data } = await apiClient.get('/meals/today');
    return (data.data || []).map(mapDbMealToMobile);
  } catch {
    return [];
  }
}

export async function getMealHistory(startDate: string, endDate: string): Promise<Meal[]> {
  try {
    const { data } = await apiClient.get('/meals/history', {
      params: { startDate, endDate },
    });
    return (data.data || []).map(mapDbMealToMobile);
  } catch {
    return [];
  }
}

export async function addMeal(
  type: MealType,
  items: MealItem[],
  date: string,
  time: string,
  entryMethod: 'manual' | 'photo_ai' | 'barcode' | 'voice' | 'ocr' | 'text_ai' = 'manual',
): Promise<Meal> {
  const mealTypeMap: Record<MealType, string> = {
    breakfast: 'breakfast',
    lunch: 'lunch',
    dinner: 'dinner',
    snack: 'snack',
  };

  try {
    const { data } = await apiClient.post('/meals', {
      mealType: mealTypeMap[type] || type,
      logDate: date,
      items: items.map((item) => {
        const isDbFood = /^\d+$/.test(item.food.id);
        const servingSize = item.food.servingSize || 1;
        const mult = (item.quantity || 0) / servingSize;
        // For AI/non-DB foods, send pre-computed nutrition.
        // For DB foods, also send computed totals so backend stores accurate values regardless of factor logic.
        const calories = Math.max(0, Math.round((item.food.nutrition?.calories || 0) * mult));
        const protein = Math.max(0, Math.round(((item.food.nutrition?.protein || 0) * mult) * 10) / 10);
        const carbs = Math.max(0, Math.round(((item.food.nutrition?.carbs || 0) * mult) * 10) / 10);
        const fat = Math.max(0, Math.round(((item.food.nutrition?.fat || 0) * mult) * 10) / 10);
        return {
          foodId: isDbFood ? parseInt(item.food.id, 10) : undefined,
          foodName: item.food.name,
          // amount must be > 0 (backend zod validation)
          amount: Math.max(1, item.quantity || 1),
          calories,
          protein,
          carbs,
          fat,
        };
      }),
      entryMethod,
    });
    return mapDbMealToMobile(data.data);
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || 'Ogun eklenemedi';
    throw new Error(msg);
  }
}

export async function updateMeal(id: string, mealData: Partial<Meal>): Promise<Meal> {
  try {
    const { data } = await apiClient.put(`/meals/${id}`, {
      mealType: mealData.type,
      notes: mealData.notes,
    });
    return mapDbMealToMobile(data.data);
  } catch {
    throw new Error('Ogun guncellenemedi');
  }
}

export async function deleteMeal(id: string): Promise<void> {
  try {
    await apiClient.delete(`/meals/${id}`);
  } catch {
    throw new Error('Ogun silinemedi');
  }
}

export async function getMealById(id: string): Promise<Meal | null> {
  try {
    const { data } = await apiClient.get(`/meals/${id}`);
    return data.data ? mapDbMealToMobile(data.data) : null;
  } catch {
    return null;
  }
}
