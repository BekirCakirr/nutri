import { create } from 'zustand';
import type { WeightEntry, WaterEntry, ExerciseEntry, SleepEntry, MoodEntry } from '@/types';
import * as trackingApi from '@/services/api/tracking';

interface ProgressState {
  weightHistory: WeightEntry[];
  waterHistory: WaterEntry[];
  exerciseHistory: ExerciseEntry[];
  sleepHistory: SleepEntry[];
  moodHistory: MoodEntry[];
  isLoading: boolean;
}

interface ProgressActions {
  loadWeightHistory: () => Promise<void>;
  loadWaterHistory: () => Promise<void>;
  loadExerciseHistory: () => Promise<void>;
  loadSleepHistory: () => Promise<void>;
  loadMoodHistory: () => Promise<void>;
  loadAll: () => Promise<void>;
  addWeightEntry: (entry: WeightEntry) => Promise<void>;
  addWaterEntry: (entry: WaterEntry) => Promise<void>;
  addExerciseEntry: (entry: ExerciseEntry) => Promise<void>;
  addSleepEntry: (entry: SleepEntry) => Promise<void>;
  addMoodEntry: (entry: MoodEntry) => Promise<void>;
}

type ProgressStore = ProgressState & ProgressActions;

export const useProgressStore = create<ProgressStore>((set) => ({
  weightHistory: [],
  waterHistory: [],
  exerciseHistory: [],
  sleepHistory: [],
  moodHistory: [],
  isLoading: false,

  loadWeightHistory: async () => {
    const weightHistory = await trackingApi.getWeightHistory();
    set({ weightHistory });
  },

  loadWaterHistory: async () => {
    const waterHistory = await trackingApi.getWaterHistory();
    set({ waterHistory });
  },

  loadExerciseHistory: async () => {
    const exerciseHistory = await trackingApi.getExerciseHistory();
    set({ exerciseHistory });
  },

  loadSleepHistory: async () => {
    const sleepHistory = await trackingApi.getSleepHistory();
    set({ sleepHistory });
  },

  loadMoodHistory: async () => {
    const moodHistory = await trackingApi.getMoodHistory();
    set({ moodHistory });
  },

  loadAll: async () => {
    set({ isLoading: true });
    const [weightHistory, waterHistory, exerciseHistory, sleepHistory, moodHistory] =
      await Promise.all([
        trackingApi.getWeightHistory(),
        trackingApi.getWaterHistory(),
        trackingApi.getExerciseHistory(),
        trackingApi.getSleepHistory(),
        trackingApi.getMoodHistory(),
      ]);
    set({
      weightHistory,
      waterHistory,
      exerciseHistory,
      sleepHistory,
      moodHistory,
      isLoading: false,
    });
  },

  addWeightEntry: async (entry) => {
    await trackingApi.addWeightEntry(entry.date, entry.value);
    set((state) => ({
      weightHistory: [...state.weightHistory, entry],
    }));
  },

  addWaterEntry: async (entry) => {
    await trackingApi.addWaterEntry(entry.date, entry.value);
    set((state) => ({
      waterHistory: [...state.waterHistory, entry],
    }));
  },

  addExerciseEntry: async (entry) => {
    await trackingApi.addExerciseEntry(entry);
    set((state) => ({
      exerciseHistory: [...state.exerciseHistory, entry],
    }));
  },

  addSleepEntry: async (entry) => {
    await trackingApi.addSleepEntry(entry);
    set((state) => ({
      sleepHistory: [...state.sleepHistory, entry],
    }));
  },

  addMoodEntry: async (entry) => {
    await trackingApi.addMoodEntry(entry);
    set((state) => ({
      moodHistory: [...state.moodHistory, entry],
    }));
  },
}));
