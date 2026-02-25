// ---------------------------------------------------------------------------
// Recipe Service
// ---------------------------------------------------------------------------

import type { PaginatedResponse } from "@/types/common";
import { mockRecipes, simulateApiCall } from "@/mock";

type Recipe = (typeof mockRecipes)[number];

// ── Types ────────────────────────────────────────────────────────────────────

export interface RecipeFilters {
  query?: string;
  category?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getRecipes(
  filters?: RecipeFilters,
): Promise<PaginatedResponse<Recipe>> {
  let items = [...mockRecipes];

  if (filters?.category) {
    items = items.filter((r) => r.category === filters.category);
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    items = items.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }
  if (filters?.tags?.length) {
    items = items.filter((r) =>
      filters.tags!.some((tag) => r.tags.includes(tag)),
    );
  }

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return simulateApiCall(
    {
      items: paged,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(items.length / limit),
        totalItems: items.length,
        itemsPerPage: limit,
        hasNextPage: start + limit < items.length,
        hasPreviousPage: page > 1,
      },
    },
    350,
  );
}

export async function getRecipe(id: string): Promise<Recipe> {
  const recipe = mockRecipes.find((r) => r.id === id) ?? mockRecipes[0];
  return simulateApiCall(recipe, 300);
}

export async function createRecipe(
  data: Partial<Recipe>,
): Promise<Recipe> {
  const newRecipe = {
    ...mockRecipes[0],
    ...data,
    id: `recipe_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  return simulateApiCall(newRecipe, 400);
}

export async function updateRecipe(
  id: string,
  data: Partial<Recipe>,
): Promise<Recipe> {
  const existing = mockRecipes.find((r) => r.id === id) ?? mockRecipes[0];
  return simulateApiCall({ ...existing, ...data }, 400);
}

export async function deleteRecipe(
  id: string,
): Promise<{ success: boolean }> {
  void id;
  return simulateApiCall({ success: true }, 300);
}
