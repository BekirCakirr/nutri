import { useState, useEffect, useCallback } from "react";
import { usePatientStore } from "@/stores/patient-store";
import type { Patient } from "@/stores/patient-store";
import { getPatient, updatePatient as updatePatientApi } from "@/services/patient.service";

/**
 * Fetch and manage a single patient's detail by ID.
 */
export function usePatientDetail(patientId: string | undefined) {
  const selectedPatient = usePatientStore((s) => s.selectedPatient);
  const selectPatient = usePatientStore((s) => s.selectPatient);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPatient(id);
        if (data) {
          selectPatient(data as unknown as Patient);
        } else {
          setError("Patient not found");
          selectPatient(null);
        }
      } catch {
        setError("Failed to fetch patient details");
        selectPatient(null);
      } finally {
        setIsLoading(false);
      }
    },
    [selectPatient],
  );

  useEffect(() => {
    if (patientId) {
      fetchPatient(patientId);
    } else {
      selectPatient(null);
    }
    return () => {
      selectPatient(null);
    };
  }, [patientId, fetchPatient, selectPatient]);

  const updatePatient = useCallback(
    async (data: Partial<Patient>) => {
      if (!selectedPatient) return;
      setIsLoading(true);
      try {
        const updated = await updatePatientApi(selectedPatient.id, data as unknown as Parameters<typeof updatePatientApi>[1]);
        selectPatient(updated as unknown as Patient);
      } catch {
        setError("Failed to update patient");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedPatient, selectPatient],
  );

  return {
    patient: selectedPatient,
    isLoading,
    error,
    fetchPatient,
    updatePatient,
  };
}
