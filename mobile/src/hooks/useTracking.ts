import { useCallback } from 'react';
import { useTrackingStore } from '@/stores';
import { WATER_GLASS_ML, DAILY_WATER_TARGET } from '@/lib/constants';

export function useTracking() {
  const store = useTrackingStore();

  const loadToday = useCallback(async () => {
    await store.loadToday();
  }, [store.loadToday]);

  const addWater = useCallback(
    async (ml: number = WATER_GLASS_ML) => {
      await store.addWater(ml);
    },
    [store.addWater],
  );

  const updateWeight = useCallback(
    async (kg: number) => {
      await store.updateWeight(kg);
    },
    [store.updateWeight],
  );

  const addExercise = useCallback(
    async (minutes: number, type: string) => {
      await store.addExercise(minutes, type);
    },
    [store.addExercise],
  );

  const waterProgress = DAILY_WATER_TARGET > 0
    ? Math.min(store.waterIntake / DAILY_WATER_TARGET, 1)
    : 0;

  const waterGlasses = Math.floor(store.waterIntake / WATER_GLASS_ML);

  return {
    waterIntake: store.waterIntake,
    todayCalories: store.todayCalories,
    todayMacros: store.todayMacros,
    weight: store.weight,
    exerciseMinutes: store.exerciseMinutes,
    waterProgress,
    waterGlasses,
    waterTarget: DAILY_WATER_TARGET,
    loadToday,
    addWater,
    updateWeight,
    addExercise,
    resetDaily: store.resetDaily,
  };
}
