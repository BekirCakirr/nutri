import type { Recipe } from '@/types';
import apiClient from './client';

export async function getRecipes(category?: string): Promise<Recipe[]> {
  const params: Record<string, string> = {};
  if (category) params.category = category;
  const { data } = await apiClient.get('/recipes', { params });
  const result = data.data ?? data;
  const items = result?.recipes ?? (Array.isArray(result) ? result : []);
  return items as Recipe[];
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const { data } = await apiClient.get(`/recipes/${id}`);
    return (data.data ?? data) as Recipe;
  } catch {
    return null;
  }
}

export async function getRecipeCategories(): Promise<string[]> {
  // Categories are client-side for now
  return ['Kahvaltı', 'Ana Yemek', 'Çorba', 'Salata', 'Tatlı', 'Atıştırmalık'];
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const { data } = await apiClient.get('/recipes', { params: { q: query } });
  const result = data.data ?? data;
  const items = result?.recipes ?? (Array.isArray(result) ? result : []);
  return items as Recipe[];
}

export async function getFavoriteRecipes(): Promise<Recipe[]> {
  // TODO: Backend favorite recipes endpoint needed
  return [];
}

export async function toggleRecipeFavorite(_recipeId: string): Promise<boolean> {
  // TODO: Backend favorite toggle endpoint needed
  return false;
}
