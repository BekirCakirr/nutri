import { useState, useCallback } from "react";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "@/services/plan.service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MealPlan {
  id: string;
  patientId: string;
  nutritionistId: string;
  name: string;
  description: string;
  status: "active" | "draft" | "completed" | "archived";
  startDate: string;
  endDate: string;
  dailyCalorieTarget: number;
  macroTargets: { protein: number; carbohydrates: number; fat: number };
  meals: Array<{ type: string; calorieTarget: number }>;
  adherenceRate: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateMealPlanData {
  patientId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  dailyCalorieTarget: number;
  macroTargets: MealPlan["macroTargets"];
  meals: MealPlan["meals"];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Meal plan CRUD operations.
 */
export function useMealPlans(patientId?: string) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMealPlans = useCallback(
    async (targetPatientId?: string) => {
      const pid = targetPatientId ?? patientId;
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPlans(pid ? { patientId: pid } : undefined);
        setMealPlans(response.items as unknown as MealPlan[]);
      } catch {
        setError("Failed to fetch meal plans");
      } finally {
        setIsLoading(false);
      }
    },
    [patientId],
  );

  const createMealPlan = useCallback(
    async (data: CreateMealPlanData) => {
      setIsLoading(true);
      setError(null);
      try {
        const created = await createPlan(data as any);
        setMealPlans((prev) => [...prev, created as unknown as MealPlan]);
        return created as unknown as MealPlan;
      } catch {
        setError("Failed to create meal plan");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const updateMealPlan = useCallback(
    async (planId: string, data: Partial<MealPlan>) => {
      setIsLoading(true);
      setError(null);
      try {
        await updatePlan(planId, data as any);
        setMealPlans((prev) =>
          prev.map((mp) =>
            mp.id === planId
              ? { ...mp, ...data, updatedAt: new Date().toISOString() }
              : mp,
          ),
        );
      } catch {
        setError("Failed to update meal plan");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const deleteMealPlan = useCallback(async (planId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deletePlan(planId);
      setMealPlans((prev) => prev.filter((mp) => mp.id !== planId));
    } catch {
      setError("Failed to delete meal plan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    mealPlans,
    isLoading,
    error,
    fetchMealPlans,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
  };
}
