import { useCallback, useEffect } from 'react';
import { useMealStore } from '@/stores';
import type { MealType, MealItem, Meal } from '@/types';

export function useMeals() {
  const store = useMealStore();

  const fetchTodayMeals = useCallback(async () => {
    await store.loadTodayMeals();
  }, [store.loadTodayMeals]);

  const fetchMealHistory = useCallback(
    async (startDate: string, endDate: string) => {
      await store.loadMealHistory(startDate, endDate);
    },
    [store.loadMealHistory],
  );

  const addMeal = useCallback(
    async (type: MealType, items: MealItem[], date: string, time: string) => {
      await store.addMeal(type, items, date, time);
    },
    [store.addMeal],
  );

  const removeMeal = useCallback(
    async (id: string) => {
      await store.removeMeal(id);
    },
    [store.removeMeal],
  );

  const updateMeal = useCallback(
    async (id: string, data: Partial<Meal>) => {
      await store.updateMeal(id, data);
    },
    [store.updateMeal],
  );

  return {
    todayMeals: store.todayMeals,
    mealHistory: store.mealHistory,
    currentMeal: store.currentMeal,
    fetchTodayMeals,
    fetchMealHistory,
    addMeal,
    removeMeal,
    updateMeal,
    setCurrentMeal: store.setCurrentMeal,
  };
}
