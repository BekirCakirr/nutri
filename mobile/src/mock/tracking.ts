import type { WeightEntry, WaterEntry, ExerciseEntry, SleepEntry, MoodEntry } from '@/types';

export const mockWeightHistory: WeightEntry[] = [
  { date: '2026-01-01', value: 72.0 },
  { date: '2026-01-08', value: 71.5 },
  { date: '2026-01-15', value: 71.2 },
  { date: '2026-01-22', value: 70.8 },
  { date: '2026-01-29', value: 70.5 },
  { date: '2026-02-05', value: 70.0 },
  { date: '2026-02-12', value: 69.5 },
  { date: '2026-02-19', value: 69.0 },
  { date: '2026-02-25', value: 68.0 },
];

export const mockWaterHistory: WaterEntry[] = [
  { date: '2026-02-19', value: 2200 },
  { date: '2026-02-20', value: 2500 },
  { date: '2026-02-21', value: 1800 },
  { date: '2026-02-22', value: 2600 },
  { date: '2026-02-23', value: 2400 },
  { date: '2026-02-24', value: 2000 },
  { date: '2026-02-25', value: 1600 },
];

export const mockExerciseHistory: ExerciseEntry[] = [
  { date: '2026-02-19', minutes: 45, type: 'walking', caloriesBurned: 200 },
  { date: '2026-02-20', minutes: 30, type: 'yoga', caloriesBurned: 120 },
  { date: '2026-02-21', minutes: 0, type: 'other', caloriesBurned: 0 },
  { date: '2026-02-22', minutes: 60, type: 'swimming', caloriesBurned: 350 },
  { date: '2026-02-23', minutes: 40, type: 'running', caloriesBurned: 320 },
  { date: '2026-02-24', minutes: 20, type: 'pilates', caloriesBurned: 100 },
  { date: '2026-02-25', minutes: 35, type: 'walking', caloriesBurned: 160 },
];

export const mockSleepHistory: SleepEntry[] = [
  { date: '2026-02-19', hours: 7.5, quality: 4 },
  { date: '2026-02-20', hours: 6, quality: 3 },
  { date: '2026-02-21', hours: 8, quality: 5 },
  { date: '2026-02-22', hours: 7, quality: 4 },
  { date: '2026-02-23', hours: 6.5, quality: 3 },
  { date: '2026-02-24', hours: 7.5, quality: 4 },
  { date: '2026-02-25', hours: 7, quality: 4 },
];

export const mockMoodHistory: MoodEntry[] = [
  { date: '2026-02-19', level: 4, note: 'Enerji dolu bir g\u00fcn' },
  { date: '2026-02-20', level: 3 },
  { date: '2026-02-21', level: 5, note: 'Harika hissediyorum!' },
  { date: '2026-02-22', level: 4 },
  { date: '2026-02-23', level: 3, note: 'Biraz yorgunum' },
  { date: '2026-02-24', level: 4 },
  { date: '2026-02-25', level: 4, note: 'G\u00fczel bir g\u00fcn' },
];
