// ---------------------------------------------------------------------------
// Patient Service
// ---------------------------------------------------------------------------

import type { PaginatedResponse } from "@/types/common";
import { mockPatients, simulateApiCall } from "@/mock";
import { patients } from "@/mock/patients";

// Re-export the local Patient type from mock for convenience
import type { Patient } from "@/mock/patients";
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
  let items = [...patients];

  // Simple client-side filtering for mock
  if (filters?.status) {
    items = items.filter((p) => p.status === filters.status);
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    items = items.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q),
    );
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

export async function getPatient(id: string): Promise<Patient> {
  const patient = patients.find((p) => p.id === id) ?? patients[0];
  return simulateApiCall(patient, 300);
}

export async function createPatient(
  data: Partial<Patient>,
): Promise<Patient> {
  const newPatient: Patient = {
    ...patients[0],
    ...data,
    id: `pat-${Date.now()}`,
    status: "active",
    joinedAt: new Date().toISOString(),
    lastVisit: new Date().toISOString(),
  };
  return simulateApiCall(newPatient, 400);
}

export async function updatePatient(
  id: string,
  data: Partial<Patient>,
): Promise<Patient> {
  const existing = patients.find((p) => p.id === id) ?? patients[0];
  return simulateApiCall({ ...existing, ...data }, 400);
}

export async function getPatientStats(): Promise<PatientStats> {
  return simulateApiCall(
    {
      totalPatients: mockPatients.length,
      activePatients: mockPatients.filter((p) => p.status === "active").length,
      averageAdherence: 82,
      newPatientsThisMonth: 1,
    },
    300,
  );
}
