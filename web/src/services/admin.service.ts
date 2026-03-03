// ---------------------------------------------------------------------------
// Admin Service
// ---------------------------------------------------------------------------

import type { PaginatedResponse } from "@/types/common";
import { mockPatients, simulateApiCall } from "@/mock";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalDietitians: number;
  totalPatients: number;
  activePlans: number;
  mealsLoggedToday: number;
  appointmentsToday: number;
  revenue: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "down";
  uptime: number;
  cpu: number;
  memory: number;
  database: "connected" | "disconnected";
  redis: "connected" | "disconnected";
  lastCheckedAt: string;
}

export interface AdminUserFilters {
  query?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const mockAdminStats: AdminStats = {
  totalUsers: 156,
  totalDietitians: 12,
  totalPatients: 140,
  activePlans: 98,
  mealsLoggedToday: 234,
  appointmentsToday: 18,
  revenue: 45_600,
};

const mockSystemHealth: SystemHealth = {
  status: "healthy",
  uptime: 99.9,
  cpu: 32,
  memory: 58,
  database: "connected",
  redis: "connected",
  lastCheckedAt: new Date().toISOString(),
};

// ── Public API ───────────────────────────────────────────────────────────────

export async function getStats(): Promise<AdminStats> {
  return simulateApiCall(mockAdminStats, 300);
}

export async function getUsers(
  filters?: AdminUserFilters,
): Promise<PaginatedResponse<AdminUser>> {
  const allUsers: AdminUser[] = mockPatients.map((p) => ({
    id: p.id,
    email: p.email,
    firstName: p.firstName,
    lastName: p.lastName,
    role: "patient",
    status: p.status,
    createdAt: typeof (p as unknown as { createdAt?: string }).createdAt === "string" ? (p as unknown as { createdAt: string }).createdAt : new Date().toISOString(),
    lastLoginAt: null,
  }));

  let items = [...allUsers];

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    items = items.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }
  if (filters?.role) {
    items = items.filter((u) => u.role === filters.role);
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

export async function getSystemHealth(): Promise<SystemHealth> {
  return simulateApiCall(mockSystemHealth, 300);
}

export async function manageFoodDB(action: {
  type: "add" | "update" | "delete";
  foodId?: string;
  data?: Record<string, unknown>;
}): Promise<{ success: boolean }> {
  void action;
  return simulateApiCall({ success: true }, 400);
}
