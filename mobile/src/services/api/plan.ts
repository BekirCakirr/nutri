import type { WeeklyPlan, DayPlan } from '@/types';
import { mockWeeklyPlan } from '@/mock';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function getActivePlan(): Promise<WeeklyPlan | null> {
  await delay();
  return mockWeeklyPlan;
}

export async function getDayPlan(date: string): Promise<DayPlan | null> {
  await delay(400);
  const dayIndex = new Date(date).getDay();
  return mockWeeklyPlan.days[dayIndex === 0 ? 6 : dayIndex - 1] ?? null;
}

export async function createPlan(plan: Partial<WeeklyPlan>): Promise<WeeklyPlan> {
  await delay(1000);
  return { ...mockWeeklyPlan, ...plan, id: 'plan-' + Date.now() };
}

export async function updatePlan(id: string, data: Partial<WeeklyPlan>): Promise<WeeklyPlan> {
  await delay();
  return { ...mockWeeklyPlan, ...data };
}
