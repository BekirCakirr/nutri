import { useState, useCallback, useMemo } from "react";
import {
  getRecipes,
  createRecipe as createRecipeApi,
  deleteRecipe as deleteRecipeApi,
} from "@/services/recipe.service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  cuisineType: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard" | string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  ingredients: Array<{ name: string; amount: string; calories?: number }>;
  instructions: string[];
  tags: string[];
  imageUrl: string;
  createdBy: string;
  createdAt: string;
}

// ── Normalize backend recipe shape (camelCased by axios) into Recipe ──────
function toNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function deriveCategoryFromTags(tags: string[]): string {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  if (tagSet.has("çorba") || tagSet.has("corba")) return "Çorba";
  if (tagSet.has("salata")) return "Salata";
  if (tagSet.has("kahvaltı") || tagSet.has("kahvalti")) return "Kahvaltı";
  if (tagSet.has("tatlı") || tagSet.has("tatli") || tagSet.has("dessert")) return "Tatlı";
  if (tagSet.has("smoothie") || tagSet.has("içecek") || tagSet.has("icecek")) return "İçecek";
  if (tagSet.has("atıştırmalık") || tagSet.has("atistirmalik") || tagSet.has("snack")) return "Atıştırmalık";
  if (tagSet.has("sandviç") || tagSet.has("sandvic")) return "Atıştırmalık";
  return "Ana Yemek";
}

function splitInstructions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") {
    return raw
      .split(/\n+/)
      .map((s) => s.replace(/^\s*\d+\.\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeRecipe(item: unknown): Recipe {
  const r = (item ?? {}) as Record<string, unknown>;
  const tags = Array.isArray(r.tags) ? (r.tags as string[]) : [];
  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? r.title ?? ""),
    description: String(r.description ?? ""),
    category: String(r.category ?? deriveCategoryFromTags(tags)),
    cuisineType: String(r.cuisineType ?? ""),
    preparationTime: toNumber(r.prepTimeMin ?? r.preparationTime),
    cookingTime: toNumber(r.cookTimeMin ?? r.cookingTime),
    servings: toNumber(r.servings, 1),
    difficulty: String(r.difficulty ?? "easy"),
    calories: toNumber(r.caloriesPerServing ?? r.calories),
    protein: toNumber(r.proteinPerServing ?? r.protein),
    carbohydrates: toNumber(r.carbsPerServing ?? r.carbohydrates),
    fat: toNumber(r.fatPerServing ?? r.fat),
    fiber: toNumber(r.fiber),
    ingredients: Array.isArray(r.ingredients)
      ? (r.ingredients as Array<{ name: string; amount: string }>)
      : [],
    instructions: splitInstructions(r.instructions),
    tags,
    imageUrl: typeof r.imageUrl === "string" ? r.imageUrl : "",
    createdBy: String(r.createdBy ?? ""),
    createdAt: String(r.createdAt ?? ""),
  };
}

interface CreateRecipeData {
  name: string;
  description: string;
  category: Recipe["category"];
  cuisineType: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  difficulty: Recipe["difficulty"];
  ingredients: Recipe["ingredients"];
  instructions: string[];
  tags: string[];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Recipe CRUD and search operations.
 */
export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Recipe["category"] | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getRecipes();
      const safeItems = Array.isArray(response.items) ? response.items : [];
      setRecipes(safeItems.map(normalizeRecipe));
    } catch {
      setError("Failed to fetch recipes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRecipe = useCallback(async (data: CreateRecipeData) => {
    setIsLoading(true);
    setError(null);
    try {
      const created = await createRecipeApi(data as unknown as Parameters<typeof createRecipeApi>[0]);
      setRecipes((prev) => [...prev, created as unknown as Recipe]);
      return created as unknown as Recipe;
    } catch {
      setError("Failed to create recipe");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteRecipe = useCallback(async (recipeId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteRecipeApi(recipeId);
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } catch {
      setError("Failed to delete recipe");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    if (categoryFilter !== "all") {
      result = result.filter((r) => r.category === categoryFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags.some((t) => t.toLowerCase().includes(query)),
      );
    }

    return result;
  }, [recipes, searchQuery, categoryFilter]);

  return {
    recipes: filteredRecipes,
    allRecipes: recipes,
    searchQuery,
    categoryFilter,
    isLoading,
    error,
    fetchRecipes,
    createRecipe,
    deleteRecipe,
    setSearchQuery,
    setCategoryFilter,
  };
}
