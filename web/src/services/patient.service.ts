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

// ── Field mapping (backend → store) ─────────────────────────────────────────

function mapPatient(raw: any): any {
  return {
    ...raw,
    // Map backend field names to store expected names
    dateOfBirth: raw.dateOfBirth ?? raw.birthDate ?? '',
    height: raw.height ?? raw.heightCm ?? 0,
    weight: raw.weight ?? raw.currentWeightKg ?? 0,
    avatar: raw.avatar ?? raw.avatarUrl ?? raw.profilePhotoUrl ?? '',
    phone: raw.phone ?? '',
    adherenceScore: raw.adherenceScore ?? 0,
    lastVisit: raw.lastVisit ?? raw.updatedAt ?? '',
    nextAppointment: raw.nextAppointment ?? null,
    goals: raw.goals ?? (raw.goalType ? [raw.goalType] : []),
    allergies: raw.allergies ?? [],
    dietaryRestrictions: raw.dietaryRestrictions ?? [],
    medicalConditions: raw.medicalConditions ?? [],
    status: raw.status ?? (raw.isActive === false ? 'inactive' : 'active'),
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getPatients(
  filters?: PatientFilters,
): Promise<PaginatedResponse<Patient>> {
  const { data } = await api.get("/patients", { params: filters });
  // Backend returns array for dietitian's patients
  const rawItems = Array.isArray(data) ? data : [data];
  const items = rawItems.map(mapPatient);
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
  return mapPatient(data) as Patient;
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
