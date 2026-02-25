// ---------------------------------------------------------------------------
// Plan Service
// ---------------------------------------------------------------------------

import type { PaginatedResponse } from "@/types/common";
import { mockMealPlans, simulateApiCall } from "@/mock";

type MealPlan = (typeof mockMealPlans)[number];

// ── Types ────────────────────────────────────────────────────────────────────

export interface PlanFilters {
  patientId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  dailyCalorieTarget: number;
  macroTargets: { protein: number; carbohydrates: number; fat: number };
  tags: string[];
}

// ── Mock Templates ───────────────────────────────────────────────────────────

const mockTemplates: PlanTemplate[] = [
  {
    id: "tmpl-001",
    name: "Kilo Verme - Standart",
    description: "Orta duzey kalori kisitlamasi ile protein agirlikli plan",
    dailyCalorieTarget: 1800,
    macroTargets: { protein: 135, carbohydrates: 180, fat: 60 },
    tags: ["weight-loss", "high-protein"],
  },
  {
    id: "tmpl-002",
    name: "Kas Yapma",
    description: "Yuksek protein ve kalori ile kas kutle artisi plani",
    dailyCalorieTarget: 2800,
    macroTargets: { protein: 210, carbohydrates: 320, fat: 78 },
    tags: ["muscle-gain", "high-protein", "bulking"],
  },
  {
    id: "tmpl-003",
    name: "Diyabet Dostu",
    description: "Dusuk glisemik indeksli, dengeli makro dagilimi",
    dailyCalorieTarget: 2000,
    macroTargets: { protein: 100, carbohydrates: 200, fat: 67 },
    tags: ["diabetes", "low-gi", "balanced"],
  },
];

// ── Public API ───────────────────────────────────────────────────────────────

export async function getPlans(
  filters?: PlanFilters,
): Promise<PaginatedResponse<MealPlan>> {
  let items = [...mockMealPlans];

  if (filters?.patientId) {
    items = items.filter((p) => p.patientId === filters.patientId);
  }
  if (filters?.status) {
    items = items.filter((p) => p.status === filters.status);
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

export async function createPlan(
  data: Partial<MealPlan>,
): Promise<MealPlan> {
  const newPlan = {
    ...mockMealPlans[0],
    ...data,
    id: `mp_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return simulateApiCall(newPlan, 400);
}

export async function updatePlan(
  id: string,
  data: Partial<MealPlan>,
): Promise<MealPlan> {
  const existing = mockMealPlans.find((p) => p.id === id) ?? mockMealPlans[0];
  return simulateApiCall(
    { ...existing, ...data, updatedAt: new Date().toISOString() },
    400,
  );
}

export async function deletePlan(id: string): Promise<{ success: boolean }> {
  void id;
  return simulateApiCall({ success: true }, 300);
}

export async function assignPlan(
  planId: string,
  patientId: string,
): Promise<MealPlan> {
  const existing = mockMealPlans.find((p) => p.id === planId) ?? mockMealPlans[0];
  return simulateApiCall({ ...existing, patientId }, 400);
}

export async function getTemplates(): Promise<PlanTemplate[]> {
  return simulateApiCall(mockTemplates, 300);
}
