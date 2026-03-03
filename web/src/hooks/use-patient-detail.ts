import { useState, useEffect, useCallback } from "react";
import { usePatientStore } from "@/stores/patient-store";
import type { Patient } from "@/stores/patient-store";
import { mockPatients, simulateApiCall } from "@/mock";

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
        const patients = await simulateApiCall(mockPatients, 600);
        const found = patients.find((p) => p.id === id);
        if (found) {
          selectPatient(found as unknown as Patient);
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
        const updated = { ...selectedPatient, ...data, updatedAt: new Date().toISOString() };
        await simulateApiCall(updated, 500);
        selectPatient(updated);
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
