import { create } from 'zustand';
import type { NutritionInfo } from '@/types';
import * as trackingApi from '@/services/api/tracking';
import { today } from '@/lib/dateUtils';

interface TrackingState {
  waterIntake: number;
  todayCalories: number;
  todayMacros: NutritionInfo;
  weight: number;
  exerciseMinutes: number;
}

interface TrackingActions {
  loadToday: () => Promise<void>;
  addWater: (ml: number) => Promise<void>;
  updateWeight: (kg: number) => Promise<void>;
  addExercise: (minutes: number, type: string) => Promise<void>;
  resetDaily: () => void;
}

type TrackingStore = TrackingState & TrackingActions;

export const useTrackingStore = create<TrackingStore>((set, get) => ({
  waterIntake: 0,
  todayCalories: 0,
  todayMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  weight: 0,
  exerciseMinutes: 0,

  loadToday: async () => {
    const data = await trackingApi.getDailyTracking(today());
    set({
      waterIntake: data.waterIntake,
      todayCalories: data.calories,
      todayMacros: data.macros,
      weight: data.weight ?? 0,
      exerciseMinutes: data.exerciseMinutes,
    });
  },

  addWater: async (ml) => {
    await trackingApi.addWaterEntry(today(), get().waterIntake + ml);
    set((state) => ({ waterIntake: state.waterIntake + ml }));
  },

  updateWeight: async (kg) => {
    await trackingApi.addWeightEntry(today(), kg);
    set({ weight: kg });
  },

  addExercise: async (minutes, type) => {
    await trackingApi.addExerciseEntry({ date: today(), minutes, type });
    set((state) => ({ exerciseMinutes: state.exerciseMinutes + minutes }));
  },

  resetDaily: () =>
    set({
      waterIntake: 0,
      todayCalories: 0,
      todayMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      exerciseMinutes: 0,
    }),
}));
