const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

export interface WeeklySummary {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageWater: number;
  totalExerciseMinutes: number;
  weightChange: number;
  streakDays: number;
}

export async function getWeeklySummary(): Promise<WeeklySummary> {
  await delay();
  return {
    averageCalories: 1720,
    averageProtein: 85,
    averageCarbs: 180,
    averageFat: 65,
    averageWater: 2200,
    totalExerciseMinutes: 230,
    weightChange: -0.5,
    streakDays: 7,
  };
}

export interface MonthlySummary extends WeeklySummary {
  bestDay: string;
  worstDay: string;
  goalAdherence: number; // percentage
}

export async function getMonthlySummary(): Promise<MonthlySummary> {
  await delay();
  return {
    averageCalories: 1680,
    averageProtein: 82,
    averageCarbs: 175,
    averageFat: 62,
    averageWater: 2100,
    totalExerciseMinutes: 920,
    weightChange: -2.0,
    streakDays: 7,
    bestDay: '2026-02-15',
    worstDay: '2026-02-08',
    goalAdherence: 78,
  };
}

export async function exportReport(format: 'pdf' | 'csv'): Promise<string> {
  await delay(1500);
  return `https://api.nutriai.app/reports/mock-report.${format}`;
}
