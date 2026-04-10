import { create } from 'zustand';
import type { Appointment } from '@/types';
import * as appointmentApi from '@/services/api/appointment';

interface AppointmentState {
  appointments: Appointment[];
  upcomingAppointment: Appointment | null;
}

interface AppointmentActions {
  loadAppointments: () => Promise<void>;
  bookAppointment: (data: {
    patientId: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    type: 'online' | 'in_person';
    notes?: string;
    dietitianId?: string;
  }) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
}

type AppointmentStore = AppointmentState & AppointmentActions;

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  upcomingAppointment: null,

  loadAppointments: async () => {
    const appointments = await appointmentApi.getAppointments();
    const upcomingAppointment =
      appointments.find((a) => a.status === 'scheduled') ?? null;
    set({ appointments, upcomingAppointment });
  },

  bookAppointment: async (data) => {
    const appointment = await appointmentApi.bookAppointment(data);
    set((state) => {
      const appointments = [...state.appointments, appointment];
      const upcomingAppointment =
        appointments.find((a) => a.status === 'scheduled') ?? null;
      return { appointments, upcomingAppointment };
    });
  },

  cancelAppointment: async (id) => {
    await appointmentApi.cancelAppointment(id);
    set((state) => {
      const appointments = state.appointments.map((a) =>
        a.id === id ? { ...a, status: 'cancelled' as const } : a,
      );
      const upcomingAppointment =
        appointments.find((a) => a.status === 'scheduled') ?? null;
      return { appointments, upcomingAppointment };
    });
  },
}));
