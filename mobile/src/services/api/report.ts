import apiClient from './client';

export interface WeeklySummary {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageWater: number;
  exerciseDays: number;
  weightChange: number;
  adherenceScore: number;
}

export interface MonthlySummary extends WeeklySummary {
  totalMeals: number;
  totalExerciseMinutes: number;
}

export async function getWeeklySummary(): Promise<WeeklySummary> {
  try {
    const { data } = await apiClient.get('/reports/summary');
    const r = data.data ?? data;
    return {
      averageCalories: r.averageCalories ?? r.average_calories ?? 0,
      averageProtein: r.averageProtein ?? r.average_protein ?? 0,
      averageCarbs: r.averageCarbs ?? r.average_carbs ?? 0,
      averageFat: r.averageFat ?? r.average_fat ?? 0,
      averageWater: r.averageWater ?? r.average_water ?? 0,
      exerciseDays: r.exerciseDays ?? r.exercise_days ?? 0,
      weightChange: r.weightChange ?? r.weight_change ?? 0,
      adherenceScore: r.adherenceScore ?? r.adherence_score ?? 0,
    };
  } catch {
    return { averageCalories: 0, averageProtein: 0, averageCarbs: 0, averageFat: 0, averageWater: 0, exerciseDays: 0, weightChange: 0, adherenceScore: 0 };
  }
}

export async function getMonthlySummary(): Promise<MonthlySummary> {
  const weekly = await getWeeklySummary();
  return { ...weekly, totalMeals: 0, totalExerciseMinutes: 0 };
}

export async function exportReport(_format: 'pdf' | 'csv'): Promise<string> {
  // TODO: Backend export endpoint needed
  return '';
}
