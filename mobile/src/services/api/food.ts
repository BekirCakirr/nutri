import type { Food } from '@/types';
import apiClient from './client';

function mapDbFoodToMobile(dbFood: any): Food {
  const servingSize = parseFloat(dbFood.serving_size_g) || 100;
  const factor = servingSize / 100;
  return {
    id: String(dbFood.id),
    name: dbFood.name,
    brand: undefined,
    category: dbFood.category || 'other',
    servingSize,
    servingUnit: dbFood.serving_description || 'g',
    nutrition: {
      calories: Math.round((parseFloat(dbFood.calories_per_100g) || 0) * factor),
      protein: Math.round((parseFloat(dbFood.protein_per_100g) || 0) * factor * 10) / 10,
      carbs: Math.round((parseFloat(dbFood.carbs_per_100g) || 0) * factor * 10) / 10,
      fat: Math.round((parseFloat(dbFood.fat_per_100g) || 0) * factor * 10) / 10,
      fiber: dbFood.fiber_per_100g ? Math.round(parseFloat(dbFood.fiber_per_100g) * factor * 10) / 10 : undefined,
      sugar: dbFood.sugar_per_100g ? Math.round(parseFloat(dbFood.sugar_per_100g) * factor * 10) / 10 : undefined,
      sodium: dbFood.sodium_per_100g ? Math.round(parseFloat(dbFood.sodium_per_100g) * factor) : undefined,
    },
    image: dbFood.image_url || undefined,
    barcode: dbFood.barcode || undefined,
  };
}

export async function searchFoods(query: string): Promise<Food[]> {
  try {
    const { data } = await apiClient.get('/foods', { params: { q: query } });
    return (data.data.foods || []).map(mapDbFoodToMobile);
  } catch {
    return [];
  }
}

export async function getFoodById(id: string): Promise<Food | null> {
  try {
    const { data } = await apiClient.get(`/foods/${id}`);
    return data.data ? mapDbFoodToMobile(data.data) : null;
  } catch {
    return null;
  }
}

export async function getFoodByBarcode(barcode: string): Promise<Food | null> {
  try {
    const { data } = await apiClient.get(`/foods/barcode/${barcode}`);
    return data.data ? mapDbFoodToMobile(data.data) : null;
  } catch {
    return null;
  }
}

export async function getRecentFoods(): Promise<Food[]> {
  try {
    const { data } = await apiClient.get('/foods', { params: { limit: 10 } });
    return (data.data.foods || []).map(mapDbFoodToMobile);
  } catch {
    return [];
  }
}

export async function getFavoriteFoods(): Promise<Food[]> {
  try {
    const { data } = await apiClient.get('/foods', { params: { limit: 10 } });
    return (data.data.foods || []).map(mapDbFoodToMobile);
  } catch {
    return [];
  }
}

export async function toggleFoodFavorite(foodId: string): Promise<boolean> {
  return true;
}
