import { useState, useCallback } from "react";
import { mockMealPlans, simulateApiCall } from "@/mock";

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
        const all = await simulateApiCall(mockMealPlans, 700);
        const filtered = pid ? all.filter((mp) => (mp as unknown as { patientId?: string }).patientId === pid) : all;
        setMealPlans(filtered as unknown as MealPlan[]);
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
        const newPlan: MealPlan = {
          id: `mp_${Date.now()}`,
          ...data,
          nutritionistId: "usr_001",
          status: "draft",
          adherenceRate: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const created = await simulateApiCall(newPlan, 600);
        setMealPlans((prev) => [...prev, created]);
        return created;
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
        await simulateApiCall(null, 500);
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
      await simulateApiCall(null, 400);
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
