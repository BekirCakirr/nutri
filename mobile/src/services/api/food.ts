import type { Food } from '@/types';
import apiClient from './client';
import { mockFoods } from '@/mock';

const USE_MOCK = false;
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

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
  if (USE_MOCK) {
    await delay();
    const lower = query.toLowerCase();
    return mockFoods.filter((f) => f.name.toLowerCase().includes(lower));
  }
  const { data } = await apiClient.get('/foods', { params: { q: query } });
  return (data.data.foods || []).map(mapDbFoodToMobile);
}

export async function getFoodById(id: string): Promise<Food | null> {
  if (USE_MOCK) {
    await delay(300);
    return mockFoods.find((f) => f.id === id) ?? null;
  }
  const { data } = await apiClient.get(`/foods/${id}`);
  return data.data ? mapDbFoodToMobile(data.data) : null;
}

export async function getFoodByBarcode(barcode: string): Promise<Food | null> {
  if (USE_MOCK) {
    await delay(700);
    return mockFoods[0];
  }
  const { data } = await apiClient.get(`/foods/barcode/${barcode}`);
  return data.data ? mapDbFoodToMobile(data.data) : null;
}

export async function getRecentFoods(): Promise<Food[]> {
  if (USE_MOCK) {
    await delay(400);
    return mockFoods.slice(0, 10);
  }
  // For now, return last searched foods from API
  const { data } = await apiClient.get('/foods', { params: { limit: 10 } });
  return (data.data.foods || []).map(mapDbFoodToMobile);
}

export async function getFavoriteFoods(): Promise<Food[]> {
  if (USE_MOCK) {
    await delay(400);
    return mockFoods.slice(5, 15);
  }
  // Favorites not yet implemented on backend, return popular foods
  const { data } = await apiClient.get('/foods', { params: { limit: 10 } });
  return (data.data.foods || []).map(mapDbFoodToMobile);
}

export async function toggleFoodFavorite(foodId: string): Promise<boolean> {
  if (USE_MOCK) {
    await delay(300);
    return true;
  }
  // Not yet implemented on backend
  return true;
}
