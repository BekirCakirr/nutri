import { useState, useCallback } from "react";
import { mockMeals, simulateApiCall } from "@/mock";

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
        const allMeals = await simulateApiCall(mockMeals, 600);
        const filtered = pid
          ? allMeals.filter((m) => m.patientId === pid)
          : allMeals;
        setMeals(filtered as Meal[]);
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
        const totalCalories = data.items.reduce((sum, item) => sum + item.calories, 0);
        const newMeal: Meal = {
          id: `meal_${Date.now()}`,
          patientId: data.patientId,
          name: data.name,
          type: data.type,
          date: data.date,
          calories: totalCalories,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          items: data.items,
          notes: data.notes ?? "",
          logged: true,
          loggedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        const created = await simulateApiCall(newMeal, 500);
        setMeals((prev) => [...prev, created]);
        return created;
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
      await simulateApiCall(null, 400);
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
