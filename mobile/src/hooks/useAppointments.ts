import { useCallback } from 'react';
import { useAppointmentStore } from '@/stores';

export function useAppointments() {
  const store = useAppointmentStore();

  const loadAppointments = useCallback(async () => {
    await store.loadAppointments();
  }, [store.loadAppointments]);

  const bookAppointment = useCallback(
    async (data: {
      patientId: string;
      appointmentDate: string;
      startTime: string;
      endTime: string;
      type: 'online' | 'in_person';
      notes?: string;
      dietitianId?: string;
    }) => {
      await store.bookAppointment(data);
    },
    [store.bookAppointment],
  );

  const cancelAppointment = useCallback(
    async (id: string) => {
      await store.cancelAppointment(id);
    },
    [store.cancelAppointment],
  );

  const pastAppointments = store.appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled',
  );

  const upcomingAppointments = store.appointments.filter(
    (a) => a.status === 'scheduled',
  );

  return {
    appointments: store.appointments,
    upcomingAppointment: store.upcomingAppointment,
    pastAppointments,
    upcomingAppointments,
    loadAppointments,
    bookAppointment,
    cancelAppointment,
  };
}
