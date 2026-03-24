import type { Appointment } from '@/types';
import apiClient from './client';

export async function getAppointments(): Promise<Appointment[]> {
  const { data } = await apiClient.get('/appointments');
  const items = data.data ?? data ?? [];
  return Array.isArray(items) ? items : [];
}

export async function getUpcomingAppointment(): Promise<Appointment | null> {
  const all = await getAppointments();
  return all.find((a: any) => a.status === 'scheduled') ?? null;
}

export async function bookAppointment(apptData: {
  dietitianId: string;
  date: string;
  time: string;
  duration: number;
  type: 'online' | 'in_person';
  notes?: string;
}): Promise<Appointment> {
  const { data } = await apiClient.post('/appointments', {
    scheduledAt: `${apptData.date}T${apptData.time}:00`,
    durationMinutes: apptData.duration,
    appointmentType: apptData.type,
    notes: apptData.notes,
  });
  return (data.data ?? data) as Appointment;
}

export async function cancelAppointment(id: string): Promise<void> {
  await apiClient.patch(`/appointments/${id}/status`, { status: 'cancelled' });
}

export async function rescheduleAppointment(
  id: string,
  date: string,
  time: string,
): Promise<Appointment> {
  const { data } = await apiClient.patch(`/appointments/${id}/status`, {
    status: 'scheduled',
    scheduledAt: `${date}T${time}:00`,
  });
  return (data.data ?? data) as Appointment;
}
