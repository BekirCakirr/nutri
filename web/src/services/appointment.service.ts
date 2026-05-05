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

function mapAppointment(raw: any): any {
  // Map backend status to frontend expected values
  const statusMap: Record<string, string> = {
    scheduled: 'scheduled',
    confirmed: 'scheduled',
    completed: 'completed',
    cancelled: 'cancelled',
    no_show: 'no_show',
    noShow: 'no_show',
  };

  // Normalize date: backend returns full ISO timestamp via appointment_date
  // The week grid compares against YYYY-MM-DD strings, so slice it.
  const rawDate = raw.date ?? raw.appointmentDate ?? '';
  const date = typeof rawDate === 'string' && rawDate.length >= 10 ? rawDate.slice(0, 10) : rawDate;

  // Normalize times: backend returns "10:00:00" → trim seconds to "10:00"
  const trimTime = (t: any) => {
    if (typeof t !== 'string') return '';
    return t.length >= 5 ? t.slice(0, 5) : t;
  };

  return {
    ...raw,
    date,
    startTime: trimTime(raw.startTime),
    endTime: trimTime(raw.endTime),
    patientName: raw.patientName ?? ([raw.patientFirstName, raw.patientLastName].filter(Boolean).join(' ') || 'Hasta'),
    patientEmail: raw.patientEmail ?? '',
    nutritionistId: raw.dietitianId ?? raw.nutritionistId ?? '',
    dietitianId: raw.dietitianId ?? raw.nutritionistId ?? '',
    status: statusMap[raw.status] ?? raw.status ?? 'scheduled',
    type: raw.type === 'online' ? 'consultation' : raw.type === 'in_person' ? 'follow_up' : raw.type ?? 'consultation',
    duration: raw.duration ?? raw.durationMinutes ?? 45,
    notes: raw.notes ?? '',
    location: raw.location ?? (raw.type === 'online' ? 'Video' : 'Klinik'),
    meetingUrl: raw.meetingUrl ?? raw.jitsiRoomId ?? null,
  };
}

export async function getAppointments(
  filters?: AppointmentFilters,
): Promise<PaginatedResponse<Appointment>> {
  const { data } = await api.get("/appointments", { params: filters });
  const rawItems = Array.isArray(data) ? data : [];
  const items = rawItems.map(mapAppointment);
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
