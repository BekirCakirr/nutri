import { useState, useCallback } from "react";
import {
  getAppointments,
  createAppointment as createAppointmentApi,
  updateAppointment as updateAppointmentApi,
  cancelAppointment as cancelAppointmentApi,
} from "@/services/appointment.service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Appointment {
  id: string;
  patientId: string;
  nutritionistId: string;
  patientName: string;
  title: string;
  type: "consultation" | "follow_up" | "assessment" | "initial";
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes: string;
  location: string;
  meetingUrl: string | null;
  createdAt: string;
}

interface CreateAppointmentData {
  patientId: string;
  patientName: string;
  title: string;
  type: Appointment["type"];
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes?: string;
  location?: string;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Appointment CRUD operations.
 */
export function useAppointments(patientId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(
    async (targetPatientId?: string) => {
      const pid = targetPatientId ?? patientId;
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAppointments();
        const items = (Array.isArray(response.items) ? response.items : []) as unknown as Appointment[];
        const filtered = pid
          ? items.filter((a) => a.patientId === pid)
          : items;
        setAppointments(filtered);
      } catch {
        setError("Failed to fetch appointments");
      } finally {
        setIsLoading(false);
      }
    },
    [patientId],
  );

  const createAppointment = useCallback(
    async (data: CreateAppointmentData) => {
      setIsLoading(true);
      setError(null);
      try {
        const created = await createAppointmentApi(data as unknown as Parameters<typeof createAppointmentApi>[0]);
        setAppointments((prev) => [...prev, created as unknown as Appointment]);
        return created as unknown as Appointment;
      } catch {
        setError("Failed to create appointment");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const updateAppointment = useCallback(
    async (appointmentId: string, data: Partial<Appointment>) => {
      setIsLoading(true);
      setError(null);
      try {
        await updateAppointmentApi(appointmentId, data as unknown as Parameters<typeof updateAppointmentApi>[1]);
        setAppointments((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, ...data } : a)),
        );
      } catch {
        setError("Failed to update appointment");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const cancelAppointment = useCallback(
    async (appointmentId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await cancelAppointmentApi(appointmentId);
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === appointmentId ? { ...a, status: "cancelled" as const } : a,
          ),
        );
      } catch {
        setError("Failed to cancel appointment");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Derived state — guard against non-array states
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const upcoming = safeAppointments
    .filter((a) => a.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = safeAppointments
    .filter((a) => a.status === "completed" || a.status === "cancelled")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    appointments,
    upcoming,
    past,
    isLoading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
  };
}
