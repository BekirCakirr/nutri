import api from "@/lib/axios";
import type { PaginatedResponse } from "@/types/common";

import type { Recipe } from "@/types/recipe";
export type { Recipe };

export interface RecipeFilters {
  query?: string;
  difficulty?: string;
  tags?: string[];
  maxCalories?: number;
  isBudgetFriendly?: boolean;
  page?: number;
  limit?: number;
}

export async function getRecipes(
  filters?: RecipeFilters,
): Promise<PaginatedResponse<Recipe>> {
  const params: Record<string, any> = {};
  if (filters?.query) params.q = filters.query;
  if (filters?.difficulty) params.difficulty = filters.difficulty;
  if (filters?.tags?.length) params.tags = filters.tags.join(",");
  if (filters?.maxCalories) params.maxCalories = filters.maxCalories;
  if (filters?.isBudgetFriendly) params.isBudgetFriendly = filters.isBudgetFriendly;
  if (filters?.page) params.page = filters.page;
  if (filters?.limit) params.limit = filters.limit;

  const { data } = await api.get("/recipes", { params });
  // Backend returns { recipes, total, page, limit }
  const result = data as any;
  const items = result.recipes ?? (Array.isArray(result) ? result : []);
  const total = result.total ?? items.length;
  const page = result.page ?? filters?.page ?? 1;
  const limit = result.limit ?? filters?.limit ?? 10;

  return {
    items: items as Recipe[],
    meta: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getRecipe(id: string): Promise<Recipe> {
  const { data } = await api.get(`/recipes/${id}`);
  return data as Recipe;
}

export async function createRecipe(recipeData: Partial<Recipe>): Promise<Recipe> {
  const { data } = await api.post("/recipes", recipeData);
  return data as Recipe;
}

export async function updateRecipe(id: string, recipeData: Partial<Recipe>): Promise<Recipe> {
  const { data } = await api.put(`/recipes/${id}`, recipeData);
  return data as Recipe;
}

export async function deleteRecipe(id: string): Promise<{ success: boolean }> {
  await api.delete(`/recipes/${id}`);
  return { success: true };
}
