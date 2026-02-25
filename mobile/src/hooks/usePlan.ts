import { useCallback } from 'react';
import { usePlanStore } from '@/stores';
import type { WeeklyPlan } from '@/types';

export function usePlan() {
  const store = usePlanStore();

  const loadActivePlan = useCallback(async () => {
    await store.loadActivePlan();
  }, [store.loadActivePlan]);

  const getDayPlan = useCallback(
    async (date: string) => {
      return store.getDayPlan(date);
    },
    [store.getDayPlan],
  );

  return {
    activePlan: store.activePlan,
    weeklyPlan: store.weeklyPlan,
    loadActivePlan,
    setPlan: store.setPlan,
    getDayPlan,
  };
}
