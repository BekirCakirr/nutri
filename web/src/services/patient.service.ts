// ---------------------------------------------------------------------------
// Patient Service
// ---------------------------------------------------------------------------

import api from "@/lib/axios";
import type { PaginatedResponse } from "@/types/common";

// Keep Patient type — use the type from @/types/patient
import type { Patient } from "@/types/patient";
export type { Patient };

// ── Types ────────────────────────────────────────────────────────────────────

export interface PatientStats {
  totalPatients: number;
  activePatients: number;
  averageAdherence: number;
  newPatientsThisMonth: number;
}

export interface PatientFilters {
  query?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getPatients(
  filters?: PatientFilters,
): Promise<PaginatedResponse<Patient>> {
  const { data } = await api.get("/patients", { params: filters });
  // Backend returns array for dietitian's patients
  const items = Array.isArray(data) ? data : [data];
  return {
    items: items as Patient[],
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

export async function getPatient(id: string): Promise<Patient> {
  const { data } = await api.get(`/patients/${id}`);
  return data as Patient;
}

export async function createPatient(
  data: Partial<Patient>,
): Promise<Patient> {
  const { data: result } = await api.post("/patients", data);
  return result as Patient;
}

export async function updatePatient(
  id: string,
  data: Partial<Patient>,
): Promise<Patient> {
  const { data: result } = await api.put(`/patients/${id}`, data);
  return result as Patient;
}

export async function getPatientStats(): Promise<PatientStats> {
  const { data } = await api.get("/reports/summary");
  return data as PatientStats;
}
