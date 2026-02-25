import { create } from 'zustand';
import type { Recipe } from '@/types';
import * as recipeApi from '@/services/api/recipe';

interface RecipeState {
  recipes: Recipe[];
  favoriteRecipes: Recipe[];
  categories: string[];
  isLoading: boolean;
}

interface RecipeActions {
  loadRecipes: (category?: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  loadCategories: () => Promise<void>;
  searchRecipes: (query: string) => Promise<void>;
  toggleFavorite: (recipeId: string) => Promise<void>;
}

type RecipeStore = RecipeState & RecipeActions;

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  favoriteRecipes: [],
  categories: [],
  isLoading: false,

  loadRecipes: async (category?) => {
    set({ isLoading: true });
    const recipes = await recipeApi.getRecipes(category);
    set({ recipes, isLoading: false });
  },

  loadFavorites: async () => {
    const favoriteRecipes = await recipeApi.getFavoriteRecipes();
    set({ favoriteRecipes });
  },

  loadCategories: async () => {
    const categories = await recipeApi.getRecipeCategories();
    set({ categories });
  },

  searchRecipes: async (query) => {
    set({ isLoading: true });
    const recipes = await recipeApi.searchRecipes(query);
    set({ recipes, isLoading: false });
  },

  toggleFavorite: async (recipeId) => {
    await recipeApi.toggleRecipeFavorite(recipeId);
    set((state) => {
      const isFavorite = state.favoriteRecipes.some((r) => r.id === recipeId);
      if (isFavorite) {
        return {
          favoriteRecipes: state.favoriteRecipes.filter((r) => r.id !== recipeId),
        };
      }
      const recipe = state.recipes.find((r) => r.id === recipeId);
      if (recipe) {
        return { favoriteRecipes: [...state.favoriteRecipes, recipe] };
      }
      return state;
    });
  },
}));
