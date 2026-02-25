import { create } from 'zustand';
import type { Meal, MealItem, MealType } from '@/types';
import * as mealApi from '@/services/api/meal';

interface MealState {
  todayMeals: Meal[];
  mealHistory: Meal[];
  currentMeal: Meal | null;
}

interface MealActions {
  loadTodayMeals: () => Promise<void>;
  loadMealHistory: (startDate: string, endDate: string) => Promise<void>;
  addMeal: (type: MealType, items: MealItem[], date: string, time: string) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  updateMeal: (id: string, data: Partial<Meal>) => Promise<void>;
  setCurrentMeal: (meal: Meal | null) => void;
}

type MealStore = MealState & MealActions;

export const useMealStore = create<MealStore>((set, get) => ({
  todayMeals: [],
  mealHistory: [],
  currentMeal: null,

  loadTodayMeals: async () => {
    const meals = await mealApi.getTodayMeals();
    set({ todayMeals: meals });
  },

  loadMealHistory: async (startDate, endDate) => {
    const meals = await mealApi.getMealHistory(startDate, endDate);
    set({ mealHistory: meals });
  },

  addMeal: async (type, items, date, time) => {
    const meal = await mealApi.addMeal(type, items, date, time);
    set((state) => ({ todayMeals: [...state.todayMeals, meal] }));
  },

  removeMeal: async (id) => {
    await mealApi.deleteMeal(id);
    set((state) => ({
      todayMeals: state.todayMeals.filter((m) => m.id !== id),
      mealHistory: state.mealHistory.filter((m) => m.id !== id),
    }));
  },

  updateMeal: async (id, data) => {
    const updated = await mealApi.updateMeal(id, data);
    set((state) => ({
      todayMeals: state.todayMeals.map((m) => (m.id === id ? updated : m)),
      mealHistory: state.mealHistory.map((m) => (m.id === id ? updated : m)),
    }));
  },

  setCurrentMeal: (meal) => set({ currentMeal: meal }),
}));
