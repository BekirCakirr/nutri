import { useState, useCallback } from "react";
import { mockAppointments, simulateApiCall } from "@/mock";

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
        const all = await simulateApiCall(mockAppointments, 600);
        const filtered = pid
          ? all.filter((a) => a.patientId === pid)
          : all;
        setAppointments(filtered as unknown as Appointment[]);
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
        const newAppointment: Appointment = {
          id: `apt_${Date.now()}`,
          ...data,
          nutritionistId: "usr_001",
          status: "scheduled",
          notes: data.notes ?? "",
          location: data.location ?? "Video Call",
          meetingUrl: null,
          createdAt: new Date().toISOString(),
        };
        const created = await simulateApiCall(newAppointment, 500);
        setAppointments((prev) => [...prev, created]);
        return created;
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
        await simulateApiCall(null, 400);
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
      await updateAppointment(appointmentId, { status: "cancelled" });
    },
    [updateAppointment],
  );

  // Derived state
  const upcoming = appointments
    .filter((a) => a.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = appointments
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
