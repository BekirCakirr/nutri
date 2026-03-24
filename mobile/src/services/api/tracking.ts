import type { WeightEntry, WaterEntry, ExerciseEntry, SleepEntry, MoodEntry, DailyTracking } from '@/types';
import apiClient from './client';

export async function getDailyTracking(_date: string): Promise<DailyTracking> {
  try {
    const { data } = await apiClient.get('/tracking/summary/today');
    const r = data.data ?? data;
    return {
      date: _date,
      waterIntake: r.waterMl ?? r.water_ml ?? 0,
      calories: r.totalCalories ?? r.total_calories ?? 0,
      macros: {
        calories: r.totalCalories ?? r.total_calories ?? 0,
        protein: r.totalProtein ?? r.total_protein ?? 0,
        carbs: r.totalCarbs ?? r.total_carbs ?? 0,
        fat: r.totalFat ?? r.total_fat ?? 0,
      },
      weight: r.currentWeight ?? r.current_weight ?? 0,
      exerciseMinutes: r.exerciseMinutes ?? r.exercise_minutes ?? 0,
      sleep: r.sleepHours ?? r.sleep_hours ?? 0,
      mood: r.mood ?? 3,
    };
  } catch {
    return { date: _date, waterIntake: 0, calories: 0, macros: { calories: 0, protein: 0, carbs: 0, fat: 0 }, weight: 0, exerciseMinutes: 0, sleep: 0, mood: 3 };
  }
}

export async function addWaterEntry(_date: string, ml: number): Promise<WaterEntry> {
  const { data } = await apiClient.post('/tracking/water', { glasses: Math.ceil(ml / 200) });
  const r = data.data ?? data;
  return { date: _date, value: r.totalMl ?? ml };
}

export async function addWeightEntry(date: string, kg: number): Promise<WeightEntry> {
  const { data } = await apiClient.post('/tracking/weight', { weightKg: kg, notes: '' });
  const r = data.data ?? data;
  return { date, value: r.weightKg ?? kg };
}

export async function addExerciseEntry(entry: Omit<ExerciseEntry, 'date'> & { date: string }): Promise<ExerciseEntry> {
  await apiClient.post('/tracking/exercise', {
    exerciseType: (entry as any).type ?? 'other',
    durationMin: (entry as any).duration ?? 30,
    intensity: (entry as any).intensity ?? 'moderate',
    caloriesBurned: (entry as any).calories ?? 0,
  });
  return entry;
}

const qualityMap: Record<number, string> = { 1: 'poor', 2: 'fair', 3: 'good', 4: 'excellent', 5: 'excellent' };

export async function addSleepEntry(entry: SleepEntry): Promise<SleepEntry> {
  const numQuality = (entry as any).quality ?? 3;
  await apiClient.post('/tracking/sleep', {
    sleepStart: (entry as any).startTime ?? new Date().toISOString(),
    sleepEnd: (entry as any).endTime ?? new Date().toISOString(),
    quality: qualityMap[numQuality] ?? 'good',
  });
  return entry;
}

export async function addMoodEntry(entry: MoodEntry): Promise<MoodEntry> {
  // TODO: Backend has no mood tracking endpoint
  return entry;
}

export async function getWeightHistory(): Promise<WeightEntry[]> {
  const { data } = await apiClient.get('/tracking/weight');
  const items = data.data ?? data ?? [];
  return (Array.isArray(items) ? items : []).map((w: any) => ({
    date: w.loggedAt?.split('T')[0] ?? w.logged_at?.split('T')[0] ?? '',
    value: w.weightKg ?? w.weight_kg ?? 0,
  }));
}

export async function getWaterHistory(): Promise<WaterEntry[]> {
  const { data } = await apiClient.get('/tracking/water');
  const items = data.data ?? data ?? [];
  return (Array.isArray(items) ? items : []).map((w: any) => ({
    date: w.date ?? w.loggedAt?.split('T')[0] ?? '',
    value: w.totalMl ?? w.total_ml ?? (w.glasses ? w.glasses * 200 : 0),
  }));
}

export async function getExerciseHistory(): Promise<ExerciseEntry[]> {
  const { data } = await apiClient.get('/tracking/exercise');
  const items = data.data ?? data ?? [];
  return (Array.isArray(items) ? items : []).map((e: any) => ({
    date: e.loggedAt?.split('T')[0] ?? e.logged_at?.split('T')[0] ?? '',
    type: e.exerciseType ?? e.exercise_type ?? 'other',
    duration: e.durationMin ?? e.duration_min ?? 0,
    calories: e.caloriesBurned ?? e.calories_burned ?? 0,
  } as unknown as ExerciseEntry));
}

export async function getSleepHistory(): Promise<SleepEntry[]> {
  const { data } = await apiClient.get('/tracking/sleep');
  const items = data.data ?? data ?? [];
  return (Array.isArray(items) ? items : []).map((s: any) => ({
    date: s.sleepStart?.split('T')[0] ?? s.sleep_start?.split('T')[0] ?? '',
    startTime: s.sleepStart ?? s.sleep_start ?? '',
    endTime: s.sleepEnd ?? s.sleep_end ?? '',
    quality: s.quality ?? 3,
    duration: s.durationHours ?? s.duration_hours ?? 0,
  } as unknown as SleepEntry));
}

export async function getMoodHistory(): Promise<MoodEntry[]> {
  // TODO: Backend has no mood tracking endpoint
  return [];
}
