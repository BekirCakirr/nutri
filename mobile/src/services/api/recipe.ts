import type { Recipe } from '@/types';
import { mockRecipes, mockRecipeCategories } from '@/mock';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export async function getRecipes(category?: string): Promise<Recipe[]> {
  await delay();
  if (category) {
    return mockRecipes.filter((r) => r.category === category);
  }
  return mockRecipes;
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  await delay(400);
  return mockRecipes.find((r) => r.id === id) ?? null;
}

export async function getRecipeCategories(): Promise<string[]> {
  await delay(300);
  return mockRecipeCategories;
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  await delay();
  const lower = query.toLowerCase();
  return mockRecipes.filter(
    (r) =>
      r.name.toLowerCase().includes(lower) ||
      r.tags.some((t) => t.toLowerCase().includes(lower)),
  );
}

export async function getFavoriteRecipes(): Promise<Recipe[]> {
  await delay();
  return mockRecipes.slice(0, 3);
}

export async function toggleRecipeFavorite(recipeId: string): Promise<boolean> {
  await delay(300);
  return true;
}
