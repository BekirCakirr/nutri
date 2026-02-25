import type { WeightEntry, WaterEntry, ExerciseEntry, SleepEntry, MoodEntry, DailyTracking } from '@/types';
import {
  mockWeightHistory,
  mockWaterHistory,
  mockExerciseHistory,
  mockSleepHistory,
  mockMoodHistory,
} from '@/mock';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export async function getDailyTracking(date: string): Promise<DailyTracking> {
  await delay();
  return {
    date,
    waterIntake: 1600,
    calories: 1940,
    macros: { calories: 1940, protein: 119.5, carbs: 190, fat: 84.3 },
    weight: 68,
    exerciseMinutes: 35,
    sleep: 7,
    mood: 4,
  };
}

export async function addWaterEntry(date: string, ml: number): Promise<WaterEntry> {
  await delay(300);
  return { date, value: ml };
}

export async function addWeightEntry(date: string, kg: number): Promise<WeightEntry> {
  await delay(300);
  return { date, value: kg };
}

export async function addExerciseEntry(entry: Omit<ExerciseEntry, 'date'> & { date: string }): Promise<ExerciseEntry> {
  await delay(300);
  return entry;
}

export async function addSleepEntry(entry: SleepEntry): Promise<SleepEntry> {
  await delay(300);
  return entry;
}

export async function addMoodEntry(entry: MoodEntry): Promise<MoodEntry> {
  await delay(300);
  return entry;
}

export async function getWeightHistory(): Promise<WeightEntry[]> {
  await delay();
  return mockWeightHistory;
}

export async function getWaterHistory(): Promise<WaterEntry[]> {
  await delay();
  return mockWaterHistory;
}

export async function getExerciseHistory(): Promise<ExerciseEntry[]> {
  await delay();
  return mockExerciseHistory;
}

export async function getSleepHistory(): Promise<SleepEntry[]> {
  await delay();
  return mockSleepHistory;
}

export async function getMoodHistory(): Promise<MoodEntry[]> {
  await delay();
  return mockMoodHistory;
}
