import type { WeeklyPlan, DayPlan } from '@/types';
import apiClient from './client';

type RawPlan = Record<string, unknown> & {
  id?: string;
  status?: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  items?: unknown[];
};

function pickActivePlan(plans: RawPlan[]): RawPlan | null {
  if (!Array.isArray(plans) || plans.length === 0) return null;
  const active = plans.find((p) => (p?.status ?? 'active') === 'active');
  return active ?? plans[0] ?? null;
}

function normalizePlan(raw: RawPlan): WeeklyPlan {
  const items = Array.isArray(raw.items) ? (raw.items as WeeklyPlan['items']) : [];
  return {
    id: String(raw.id ?? ''),
    name: String(raw.title ?? (raw as { name?: string }).name ?? 'Beslenme Planı'),
    startDate: String(raw.start_date ?? (raw as { startDate?: string }).startDate ?? ''),
    endDate: String(raw.end_date ?? (raw as { endDate?: string }).endDate ?? ''),
    days: (raw as { days?: WeeklyPlan['days'] }).days ?? [],
    items,
  };
}

export async function getActivePlan(): Promise<WeeklyPlan | null> {
  try {
    const { data } = await apiClient.get('/plans');
    const result = data?.data ?? data ?? [];
    const plans = (Array.isArray(result) ? result : []) as RawPlan[];
    const summary = pickActivePlan(plans);
    if (!summary || !summary.id) return null;

    // Backend list does not include items — fetch full plan
    try {
      const detail = await apiClient.get(`/plans/${summary.id}`);
      const detailData = (detail.data?.data ?? detail.data) as RawPlan;
      return normalizePlan({ ...summary, ...detailData });
    } catch {
      return normalizePlan(summary);
    }
  } catch {
    return null;
  }
}

export async function getDayPlan(date: string): Promise<DayPlan | null> {
  const plan = await getActivePlan();
  if (!plan) return null;
  const days = plan.days ?? [];
  if (days.length === 0) return null;
  const dayIndex = new Date(date).getDay();
  return days[dayIndex === 0 ? 6 : dayIndex - 1] ?? null;
}

export async function createPlan(plan: Partial<WeeklyPlan>): Promise<WeeklyPlan> {
  try {
    const { data } = await apiClient.post('/plans', plan);
    return (data.data ?? data) as WeeklyPlan;
  } catch {
    throw new Error('Plan oluşturulamadı');
  }
}

export async function updatePlan(id: string, planData: Partial<WeeklyPlan>): Promise<WeeklyPlan> {
  try {
    const { data } = await apiClient.patch(`/plans/${id}/status`, planData);
    return (data.data ?? data) as WeeklyPlan;
  } catch {
    throw new Error('Plan güncellenemedi');
  }
}
