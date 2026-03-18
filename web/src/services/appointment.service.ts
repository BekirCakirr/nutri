import api from "@/lib/axios";
import type { PaginatedResponse } from "@/types/common";

export interface AppointmentFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

// Re-export Appointment type from types
import type { Appointment } from "@/types/appointment";
export type { Appointment };

export async function getAppointments(
  filters?: AppointmentFilters,
): Promise<PaginatedResponse<Appointment>> {
  const { data } = await api.get("/appointments", { params: filters });
  const items = Array.isArray(data) ? data : [];
  return {
    items: items as Appointment[],
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

export async function createAppointment(data: Partial<Appointment>): Promise<Appointment> {
  const { data: result } = await api.post("/appointments", data);
  return result as Appointment;
}

export async function updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
  const { data: result } = await api.patch(`/appointments/${id}/status`, data);
  return result as Appointment;
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const { data } = await api.patch(`/appointments/${id}/status`, { status: "cancelled" });
  return data as Appointment;
}

export async function getAvailableSlots(dietitianId: string, date: string): Promise<TimeSlot[]> {
  const { data } = await api.get(`/appointments/slots/${dietitianId}`, { params: { date } });
  return (Array.isArray(data) ? data : []) as TimeSlot[];
}
