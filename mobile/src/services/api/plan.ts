import type { WeeklyPlan, DayPlan } from '@/types';
import apiClient from './client';

export async function getActivePlan(): Promise<WeeklyPlan | null> {
  try {
    const { data } = await apiClient.get('/plans', { params: { status: 'active' } });
    const items = data.data ?? data ?? [];
    const plans = Array.isArray(items) ? items : [];
    return plans[0] ?? null;
  } catch {
    return null;
  }
}

export async function getDayPlan(date: string): Promise<DayPlan | null> {
  const plan = await getActivePlan();
  if (!plan) return null;
  const dayIndex = new Date(date).getDay();
  const days = (plan as any).days ?? [];
  return days[dayIndex === 0 ? 6 : dayIndex - 1] ?? null;
}

export async function createPlan(plan: Partial<WeeklyPlan>): Promise<WeeklyPlan> {
  const { data } = await apiClient.post('/plans', plan);
  return (data.data ?? data) as WeeklyPlan;
}

export async function updatePlan(id: string, planData: Partial<WeeklyPlan>): Promise<WeeklyPlan> {
  const { data } = await apiClient.patch(`/plans/${id}/status`, planData);
  return (data.data ?? data) as WeeklyPlan;
}
