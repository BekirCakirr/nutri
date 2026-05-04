// ---------------------------------------------------------------------------
// Meal Service
// ---------------------------------------------------------------------------

import api from "@/lib/axios";
import type { PaginatedResponse } from "@/types/common";

// Use type from @/types/meal
import type { Meal } from "@/types/meal";

export type MealEntry = Meal;
export type { Meal };

// ── Types ────────────────────────────────────────────────────────────────────

export interface MealFilters {
  patientId?: string;
  type?: string;
  status?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface MealStats {
  totalMeals: number;
  pending: number;
  approved: number;
  rejected: number;
  averageCalories: number;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getMeals(
  filters?: MealFilters,
): Promise<PaginatedResponse<Meal>> {
  // Backend /meals/history requires startDate & endDate (Zod validated).
  // Default to a wide range when caller doesn't specify, so dietitian list views
  // work without a patient context.
  const params: Record<string, string> = {
    startDate: filters?.startDate ?? "2020-01-01",
    endDate: filters?.endDate ?? "2099-12-31",
  };
  if (filters?.patientId) params.patientId = filters.patientId;

  const { data } = await api.get("/meals/history", { params });
  const items = Array.isArray(data) ? data : [];
  return {
    items: items as Meal[],
    meta: {
      currentPage: filters?.page ?? 1,
      totalPages: 1,
      totalItems: items.length,
      itemsPerPage: filters?.limit ?? 10,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

export async function getMealsByPatient(
  patientId: string,
): Promise<Meal[]> {
  // For dietitians viewing a patient's meals
  const { data } = await api.get("/meals/history", {
    params: { patientId, startDate: "2020-01-01", endDate: "2099-12-31" },
  });
  return (Array.isArray(data) ? data : []) as Meal[];
}

export async function approveMeal(
  mealId: string,
  comment?: string,
): Promise<Meal> {
  const { data } = await api.put(`/meals/${mealId}`, {
    dietitianFeedback: comment,
    dietitianViewed: true,
  });
  return data as Meal;
}

export async function rejectMeal(
  mealId: string,
  comment: string,
): Promise<Meal> {
  const { data } = await api.put(`/meals/${mealId}`, {
    dietitianFeedback: comment,
    dietitianViewed: true,
  });
  return data as Meal;
}

export async function createMeal(mealData: Record<string, unknown>): Promise<Meal> {
  const { data } = await api.post("/meals", mealData);
  return data as Meal;
}

export async function deleteMeal(id: string): Promise<void> {
  await api.delete(`/meals/${id}`);
}

export async function getMealStats(): Promise<MealStats> {
  const { data } = await api.get("/reports/summary");
  return (data ?? {
    totalMeals: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageCalories: 0,
  }) as MealStats;
}
