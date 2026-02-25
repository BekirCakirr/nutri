import { create } from 'zustand';
import type { Food } from '@/types';
import * as foodApi from '@/services/api/food';

interface FoodState {
  recentFoods: Food[];
  favoriteFoods: Food[];
  searchResults: Food[];
  isSearching: boolean;
}

interface FoodActions {
  loadRecentFoods: () => Promise<void>;
  loadFavoriteFoods: () => Promise<void>;
  searchFood: (query: string) => Promise<void>;
  clearSearch: () => void;
  addToRecent: (food: Food) => void;
  toggleFavorite: (foodId: string) => Promise<void>;
}

type FoodStore = FoodState & FoodActions;

export const useFoodStore = create<FoodStore>((set, get) => ({
  recentFoods: [],
  favoriteFoods: [],
  searchResults: [],
  isSearching: false,

  loadRecentFoods: async () => {
    const recentFoods = await foodApi.getRecentFoods();
    set({ recentFoods });
  },

  loadFavoriteFoods: async () => {
    const favoriteFoods = await foodApi.getFavoriteFoods();
    set({ favoriteFoods });
  },

  searchFood: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }
    set({ isSearching: true });
    const searchResults = await foodApi.searchFoods(query);
    set({ searchResults, isSearching: false });
  },

  clearSearch: () => set({ searchResults: [], isSearching: false }),

  addToRecent: (food) =>
    set((state) => {
      const filtered = state.recentFoods.filter((f) => f.id !== food.id);
      return { recentFoods: [food, ...filtered].slice(0, 20) };
    }),

  toggleFavorite: async (foodId) => {
    await foodApi.toggleFoodFavorite(foodId);
    set((state) => {
      const isFavorite = state.favoriteFoods.some((f) => f.id === foodId);
      if (isFavorite) {
        return {
          favoriteFoods: state.favoriteFoods.filter((f) => f.id !== foodId),
        };
      }
      const food =
        state.recentFoods.find((f) => f.id === foodId) ??
        state.searchResults.find((f) => f.id === foodId);
      if (food) {
        return { favoriteFoods: [...state.favoriteFoods, food] };
      }
      return state;
    });
  },
}));
