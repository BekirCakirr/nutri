import { useCallback } from 'react';
import { useFoodStore } from '@/stores';
import type { Food } from '@/types';

export function useFood() {
  const store = useFoodStore();

  const loadRecentFoods = useCallback(async () => {
    await store.loadRecentFoods();
  }, [store.loadRecentFoods]);

  const loadFavoriteFoods = useCallback(async () => {
    await store.loadFavoriteFoods();
  }, [store.loadFavoriteFoods]);

  const searchFood = useCallback(
    async (query: string) => {
      await store.searchFood(query);
    },
    [store.searchFood],
  );

  const toggleFavorite = useCallback(
    async (foodId: string) => {
      await store.toggleFavorite(foodId);
    },
    [store.toggleFavorite],
  );

  const isFavorite = useCallback(
    (foodId: string) => store.favoriteFoods.some((f) => f.id === foodId),
    [store.favoriteFoods],
  );

  return {
    recentFoods: store.recentFoods,
    favoriteFoods: store.favoriteFoods,
    searchResults: store.searchResults,
    isSearching: store.isSearching,
    loadRecentFoods,
    loadFavoriteFoods,
    searchFood,
    clearSearch: store.clearSearch,
    addToRecent: store.addToRecent,
    toggleFavorite,
    isFavorite,
  };
}
