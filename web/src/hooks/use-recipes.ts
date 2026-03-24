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
  category: "breakfast" | "lunch" | "dinner" | "snack" | "dessert";
  cuisineType: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  ingredients: Array<{ name: string; amount: string; calories: number }>;
  instructions: string[];
  tags: string[];
  imageUrl: string;
  createdBy: string;
  createdAt: string;
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
      setRecipes(response.items as unknown as Recipe[]);
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
      const created = await createRecipeApi(data as any);
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
