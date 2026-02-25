import type { Food } from '@/types';
import { mockFoods } from '@/mock';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export async function searchFoods(query: string): Promise<Food[]> {
  await delay();
  const lower = query.toLowerCase();
  return mockFoods.filter((f) => f.name.toLowerCase().includes(lower));
}

export async function getFoodById(id: string): Promise<Food | null> {
  await delay(300);
  return mockFoods.find((f) => f.id === id) ?? null;
}

export async function getFoodByBarcode(barcode: string): Promise<Food | null> {
  await delay(700);
  return mockFoods[0]; // Return first food as mock barcode result
}

export async function getRecentFoods(): Promise<Food[]> {
  await delay(400);
  return mockFoods.slice(0, 10);
}

export async function getFavoriteFoods(): Promise<Food[]> {
  await delay(400);
  return mockFoods.slice(5, 15);
}

export async function toggleFoodFavorite(foodId: string): Promise<boolean> {
  await delay(300);
  return true; // Returns new favorite state
}
