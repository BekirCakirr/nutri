import { create } from 'zustand';
import type { WeeklyPlan, DayPlan } from '@/types';
import * as planApi from '@/services/api/plan';

interface PlanState {
  activePlan: WeeklyPlan | null;
  weeklyPlan: DayPlan[];
}

interface PlanActions {
  loadActivePlan: () => Promise<void>;
  setPlan: (plan: WeeklyPlan) => void;
  getDayPlan: (date: string) => Promise<DayPlan | null>;
}

type PlanStore = PlanState & PlanActions;

export const usePlanStore = create<PlanStore>((set, get) => ({
  activePlan: null,
  weeklyPlan: [],

  loadActivePlan: async () => {
    try {
      const plan = await planApi.getActivePlan();
      set({
        activePlan: plan,
        weeklyPlan: Array.isArray(plan?.days) ? (plan?.days ?? []) : [],
      });
    } catch {
      set({ activePlan: null, weeklyPlan: [] });
    }
  },

  setPlan: (plan) =>
    set({
      activePlan: plan,
      weeklyPlan: Array.isArray(plan?.days) ? (plan.days ?? []) : [],
    }),

  getDayPlan: async (date) => {
    const { activePlan } = get();
    if (activePlan) {
      const days = Array.isArray(activePlan.days) ? activePlan.days : [];
      if (days.length === 0) return null;
      const dayIndex = new Date(date).getDay();
      return days[dayIndex === 0 ? 6 : dayIndex - 1] ?? null;
    }
    try {
      return await planApi.getDayPlan(date);
    } catch {
      return null;
    }
  },
}));
