// ---------------------------------------------------------------------------
// Appointment Service
// ---------------------------------------------------------------------------

import type { PaginatedResponse } from "@/types/common";
import { mockAppointments, simulateApiCall } from "@/mock";

type Appointment = (typeof mockAppointments)[number];

// ── Types ────────────────────────────────────────────────────────────────────

export interface AppointmentFilters {
  patientId?: string;
  status?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getAppointments(
  filters?: AppointmentFilters,
): Promise<PaginatedResponse<Appointment>> {
  let items = [...mockAppointments];

  if (filters?.patientId) {
    items = items.filter((a) => a.patientId === filters.patientId);
  }
  if (filters?.status) {
    items = items.filter((a) => a.status === filters.status);
  }
  if (filters?.date) {
    items = items.filter((a) => a.date === filters.date);
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

export async function createAppointment(
  data: Partial<Appointment>,
): Promise<Appointment> {
  const newAppointment = {
    ...mockAppointments[0],
    ...data,
    id: `apt_${Date.now()}`,
    status: "scheduled" as const,
    createdAt: new Date().toISOString(),
  };
  return simulateApiCall(newAppointment, 400);
}

export async function updateAppointment(
  id: string,
  data: Partial<Appointment>,
): Promise<Appointment> {
  const existing =
    mockAppointments.find((a) => a.id === id) ?? mockAppointments[0];
  return simulateApiCall({ ...existing, ...data }, 400);
}

export async function cancelAppointment(
  id: string,
): Promise<Appointment> {
  const existing =
    mockAppointments.find((a) => a.id === id) ?? mockAppointments[0];
  return simulateApiCall(
    { ...existing, status: "cancelled" as const },
    400,
  );
}

export async function getAvailableSlots(date: string): Promise<TimeSlot[]> {
  const slots: TimeSlot[] = [];
  const hours = [9, 10, 11, 13, 14, 15, 16, 17];

  for (const hour of hours) {
    const startTime = `${String(hour).padStart(2, "0")}:00`;
    const endTime = `${String(hour).padStart(2, "0")}:30`;
    slots.push({
      date,
      startTime,
      endTime,
      available: Math.random() > 0.3,
    });
    slots.push({
      date,
      startTime: `${String(hour).padStart(2, "0")}:30`,
      endTime: `${String(hour + 1).padStart(2, "0")}:00`,
      available: Math.random() > 0.3,
    });
  }

  return simulateApiCall(slots, 300);
}
