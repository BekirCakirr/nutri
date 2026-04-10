import type { Appointment } from '@/types';
import apiClient from './client';

export async function getAppointments(): Promise<Appointment[]> {
  try {
    const { data } = await apiClient.get('/appointments');
    const items = data.data ?? data ?? [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export async function getUpcomingAppointment(): Promise<Appointment | null> {
  const all = await getAppointments();
  return all.find((a: any) => a.status === 'scheduled') ?? null;
}

export async function bookAppointment(apptData: {
  patientId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type: 'online' | 'in_person';
  notes?: string;
  dietitianId?: string;
}): Promise<Appointment> {
  try {
    const { data } = await apiClient.post('/appointments', {
      patientId: apptData.patientId,
      appointmentDate: apptData.appointmentDate,
      startTime: apptData.startTime,
      endTime: apptData.endTime,
      type: apptData.type,
      notes: apptData.notes,
    });
    return (data.data ?? data) as Appointment;
  } catch {
    throw new Error('Randevu oluşturulamadı');
  }
}

export async function cancelAppointment(id: string): Promise<void> {
  try {
    await apiClient.patch(`/appointments/${id}/status`, { status: 'cancelled' });
  } catch {
    throw new Error('Randevu iptal edilemedi');
  }
}

export async function rescheduleAppointment(
  id: string,
  date: string,
  time: string,
): Promise<Appointment> {
  try {
    const { data } = await apiClient.patch(`/appointments/${id}/status`, {
      status: 'scheduled',
      scheduledAt: `${date}T${time}:00`,
    });
    return (data.data ?? data) as Appointment;
  } catch {
    throw new Error('Randevu yeniden planlanamadı');
  }
}
