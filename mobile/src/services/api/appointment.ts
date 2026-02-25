import type { Appointment } from '@/types';
import { mockAppointments } from '@/mock';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function getAppointments(): Promise<Appointment[]> {
  await delay();
  return mockAppointments;
}

export async function getUpcomingAppointment(): Promise<Appointment | null> {
  await delay(400);
  return mockAppointments.find((a) => a.status === 'scheduled') ?? null;
}

export async function bookAppointment(data: {
  dietitianId: string;
  date: string;
  time: string;
  duration: number;
  type: 'online' | 'in_person';
  notes?: string;
}): Promise<Appointment> {
  await delay(1000);
  return {
    id: 'apt-' + Date.now(),
    dietitianId: data.dietitianId,
    dietitianName: 'Dyt. Zeynep Kaya',
    date: data.date,
    time: data.time,
    duration: data.duration,
    type: data.type,
    status: 'scheduled',
    notes: data.notes,
  };
}

export async function cancelAppointment(id: string): Promise<void> {
  await delay();
}

export async function rescheduleAppointment(
  id: string,
  date: string,
  time: string,
): Promise<Appointment> {
  await delay();
  const apt = mockAppointments.find((a) => a.id === id)!;
  return { ...apt, date, time };
}
