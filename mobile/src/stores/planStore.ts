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
    const plan = await planApi.getActivePlan();
    set({
      activePlan: plan,
      weeklyPlan: plan?.days ?? [],
    });
  },

  setPlan: (plan) =>
    set({
      activePlan: plan,
      weeklyPlan: plan.days,
    }),

  getDayPlan: async (date) => {
    const { activePlan } = get();
    if (activePlan) {
      const dayIndex = new Date(date).getDay();
      return (activePlan.days || [])[dayIndex === 0 ? 6 : dayIndex - 1] ?? null;
    }
    return planApi.getDayPlan(date);
  },
}));
