import api from "@/lib/axios";
import type { PaginatedResponse } from "@/types/common";

export interface AdminStats {
  totalUsers: number;
  totalPatients: number;
  totalDietitians: number;
  totalMealsLogged: number;
  totalAppointments: number;
  activePatients: number;
  pendingDietitianApprovals: number;
  recentSignups: Record<string, number>;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface SystemHealth {
  status: string;
  database: { status: string; latencyMs: number };
  uptime: number;
  version: string;
}

export interface AdminUserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

interface ApiUserListResponse {
  users?: AdminUser[];
  total?: number;
  page?: number;
  limit?: number;
}

export async function getStats(): Promise<AdminStats> {
  const { data } = await api.get("/admin/dashboard");
  return data as AdminStats;
}

export async function getUsers(
  filters?: AdminUserFilters,
): Promise<PaginatedResponse<AdminUser>> {
  const { data } = await api.get("/admin/users", { params: filters });
  const result = data as ApiUserListResponse;
  const items = result.users ?? (Array.isArray(data) ? (data as AdminUser[]) : []);
  const total = result.total ?? items.length;
  const page = result.page ?? filters?.page ?? 1;
  const limit = result.limit ?? filters?.limit ?? 10;

  return {
    items: items as AdminUser[],
    meta: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const { data } = await api.get("/health");
  return data as SystemHealth;
}

export async function manageFoodDB(_action: string): Promise<{ success: boolean }> {
  return { success: true };
}
