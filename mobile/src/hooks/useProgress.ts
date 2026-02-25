import { useCallback } from 'react';
import { useProgressStore } from '@/stores';
import type { WeightEntry, WaterEntry, ExerciseEntry, SleepEntry, MoodEntry } from '@/types';

export function useProgress() {
  const store = useProgressStore();

  const loadAll = useCallback(async () => {
    await store.loadAll();
  }, [store.loadAll]);

  const addWeightEntry = useCallback(
    async (entry: WeightEntry) => {
      await store.addWeightEntry(entry);
    },
    [store.addWeightEntry],
  );

  const addWaterEntry = useCallback(
    async (entry: WaterEntry) => {
      await store.addWaterEntry(entry);
    },
    [store.addWaterEntry],
  );

  const addExerciseEntry = useCallback(
    async (entry: ExerciseEntry) => {
      await store.addExerciseEntry(entry);
    },
    [store.addExerciseEntry],
  );

  const addSleepEntry = useCallback(
    async (entry: SleepEntry) => {
      await store.addSleepEntry(entry);
    },
    [store.addSleepEntry],
  );

  const addMoodEntry = useCallback(
    async (entry: MoodEntry) => {
      await store.addMoodEntry(entry);
    },
    [store.addMoodEntry],
  );

  const latestWeight = store.weightHistory.length > 0
    ? store.weightHistory[store.weightHistory.length - 1]
    : null;

  return {
    weightHistory: store.weightHistory,
    waterHistory: store.waterHistory,
    exerciseHistory: store.exerciseHistory,
    sleepHistory: store.sleepHistory,
    moodHistory: store.moodHistory,
    isLoading: store.isLoading,
    latestWeight,
    loadAll,
    loadWeightHistory: store.loadWeightHistory,
    loadWaterHistory: store.loadWaterHistory,
    loadExerciseHistory: store.loadExerciseHistory,
    loadSleepHistory: store.loadSleepHistory,
    loadMoodHistory: store.loadMoodHistory,
    addWeightEntry,
    addWaterEntry,
    addExerciseEntry,
    addSleepEntry,
    addMoodEntry,
  };
}
