import { useCallback } from 'react';
import { useRecipeStore } from '@/stores';

export function useRecipes() {
  const store = useRecipeStore();

  const loadRecipes = useCallback(
    async (category?: string) => {
      await store.loadRecipes(category);
    },
    [store.loadRecipes],
  );

  const loadFavorites = useCallback(async () => {
    await store.loadFavorites();
  }, [store.loadFavorites]);

  const loadCategories = useCallback(async () => {
    await store.loadCategories();
  }, [store.loadCategories]);

  const searchRecipes = useCallback(
    async (query: string) => {
      await store.searchRecipes(query);
    },
    [store.searchRecipes],
  );

  const toggleFavorite = useCallback(
    async (recipeId: string) => {
      await store.toggleFavorite(recipeId);
    },
    [store.toggleFavorite],
  );

  const isFavorite = useCallback(
    (recipeId: string) => store.favoriteRecipes.some((r) => r.id === recipeId),
    [store.favoriteRecipes],
  );

  return {
    recipes: store.recipes,
    favoriteRecipes: store.favoriteRecipes,
    categories: store.categories,
    isLoading: store.isLoading,
    loadRecipes,
    loadFavorites,
    loadCategories,
    searchRecipes,
    toggleFavorite,
    isFavorite,
  };
}
