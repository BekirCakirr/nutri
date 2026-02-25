// ---------------------------------------------------------------------------
// Meal Service
// ---------------------------------------------------------------------------

import type { PaginatedResponse } from "@/types/common";
import { mockMeals, simulateApiCall } from "@/mock";
import { meals } from "@/mock/meals";
import type { MealEntry } from "@/mock/meals";

export type { MealEntry };

// ── Types ────────────────────────────────────────────────────────────────────

export interface MealFilters {
  patientId?: string;
  type?: string;
  status?: string;
  date?: string;
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
): Promise<PaginatedResponse<(typeof mockMeals)[number]>> {
  let items = [...mockMeals];

  if (filters?.patientId) {
    items = items.filter((m) => m.patientId === filters.patientId);
  }
  if (filters?.type) {
    items = items.filter((m) => m.type === filters.type);
  }

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return simulateApiCall(
    {
      items: paged,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(items.length / limit),
        totalItems: items.length,
        itemsPerPage: limit,
        hasNextPage: start + limit < items.length,
        hasPreviousPage: page > 1,
      },
    },
    350,
  );
}

export async function getMealsByPatient(
  patientId: string,
): Promise<MealEntry[]> {
  const filtered = meals.filter((m) => m.patientId === patientId);
  return simulateApiCall(filtered, 300);
}

export async function approveMeal(
  mealId: string,
  comment?: string,
): Promise<MealEntry> {
  const meal = meals.find((m) => m.id === mealId) ?? meals[0];
  return simulateApiCall(
    { ...meal, isApproved: true, dietitianComment: comment ?? null },
    400,
  );
}

export async function rejectMeal(
  mealId: string,
  comment: string,
): Promise<MealEntry> {
  const meal = meals.find((m) => m.id === mealId) ?? meals[0];
  return simulateApiCall(
    { ...meal, isApproved: false, dietitianComment: comment },
    400,
  );
}

export async function getMealStats(): Promise<MealStats> {
  const pending = meals.filter((m) => m.isApproved === null).length;
  const approved = meals.filter((m) => m.isApproved === true).length;
  const rejected = meals.filter((m) => m.isApproved === false).length;
  const avg =
    meals.length > 0
      ? Math.round(meals.reduce((s, m) => s + m.totalCalories, 0) / meals.length)
      : 0;

  return simulateApiCall(
    {
      totalMeals: meals.length,
      pending,
      approved,
      rejected,
      averageCalories: avg,
    },
    300,
  );
}
