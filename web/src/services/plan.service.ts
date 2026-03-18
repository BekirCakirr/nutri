import api from "@/lib/axios";
import type { PaginatedResponse } from "@/types/common";

import type { DietPlan } from "@/types/plan";
export type { DietPlan as MealPlan };

export interface PlanFilters {
  status?: string;
  patientId?: string;
  page?: number;
  limit?: number;
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  dailyCalories: number;
  meals: number;
}

export async function getPlans(filters?: PlanFilters): Promise<PaginatedResponse<DietPlan>> {
  const { data } = await api.get("/plans", { params: filters });
  const items = Array.isArray(data) ? data : [];
  return {
    items: items as DietPlan[],
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

export async function createPlan(data: Partial<DietPlan>): Promise<DietPlan> {
  const { data: result } = await api.post("/plans", data);
  return result as DietPlan;
}

export async function updatePlan(id: string, data: Partial<DietPlan>): Promise<DietPlan> {
  const { data: result } = await api.patch(`/plans/${id}/status`, data);
  return result as DietPlan;
}

export async function deletePlan(id: string): Promise<{ success: boolean }> {
  await api.delete(`/plans/${id}`);
  return { success: true };
}

export async function assignPlan(planId: string, patientId: string): Promise<DietPlan> {
  const { data } = await api.post("/plans", { patientId, planId });
  return data as DietPlan;
}

export async function getTemplates(): Promise<PlanTemplate[]> {
  // Templates are not yet a backend feature — return empty for now
  return [];
}
