import { useState, useCallback } from "react";
import {
  getMeals,
  getMealsByPatient,
  createMeal as createMealApi,
  deleteMeal as deleteMealApi,
} from "@/services/meal.service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Meal {
  id: string;
  patientId: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  items: Array<{ name: string; portion: string; calories: number }>;
  notes: string;
  logged: boolean;
  loggedAt: string;
  createdAt: string;
}

interface CreateMealData {
  patientId: string;
  name: string;
  type: Meal["type"];
  date: string;
  items: Meal["items"];
  notes?: string;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Meal CRUD operations for a specific patient.
 */
export function useMeals(patientId?: string) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(
    async (targetPatientId?: string) => {
      const pid = targetPatientId ?? patientId;
      setIsLoading(true);
      setError(null);
      try {
        let items: unknown[];
        if (pid) {
          items = await getMealsByPatient(pid);
        } else {
          const response = await getMeals();
          items = response.items;
        }
        setMeals(items as unknown as Meal[]);
      } catch {
        setError("Failed to fetch meals");
      } finally {
        setIsLoading(false);
      }
    },
    [patientId],
  );

  const createMeal = useCallback(
    async (data: CreateMealData) => {
      setIsLoading(true);
      setError(null);
      try {
        const created = await createMealApi(data as unknown as Record<string, unknown>);
        setMeals((prev) => [...prev, created as unknown as Meal]);
        return created as unknown as Meal;
      } catch {
        setError("Failed to create meal");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const deleteMeal = useCallback(async (mealId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteMealApi(mealId);
      setMeals((prev) => prev.filter((m) => m.id !== mealId));
    } catch {
      setError("Failed to delete meal");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    meals,
    isLoading,
    error,
    fetchMeals,
    createMeal,
    deleteMeal,
  };
}
