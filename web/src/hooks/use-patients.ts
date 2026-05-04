import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { usePatientStore } from "@/stores/patient-store";
import type { PatientFilters } from "@/stores/patient-store";
import { getPatients } from "@/services/patient.service";

/**
 * Patient list hook with filtering, searching, and sorting.
 */
export function usePatients() {
  const patients = usePatientStore((s) => s.patients);
  const filters = usePatientStore((s) => s.filters);
  const setPatients = usePatientStore((s) => s.setPatients);
  const updateFilters = usePatientStore((s) => s.updateFilters);
  const resetFilters = usePatientStore((s) => s.resetFilters);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPatients();
      setPatients(response.items as unknown as typeof patients);
    } catch {
      // silently fail — store keeps existing data
    } finally {
      setIsLoading(false);
    }
  }, [setPatients]);

  // Apply client-side filtering & sorting
  const filteredPatients = useMemo(() => {
    let result = [...patients];

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }

    // Filter by search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query),
      );
    }

    // Sort
    result.sort((a, b) => {
      const dir = filters.sortOrder === "asc" ? 1 : -1;
      switch (filters.sortBy) {
        case "name":
          return dir * `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "lastVisit":
          return dir * (new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime());
        case "adherenceScore":
          return dir * (a.adherenceScore - b.adherenceScore);
        case "nextAppointment": {
          const aTime = a.nextAppointment ? new Date(a.nextAppointment).getTime() : 0;
          const bTime = b.nextAppointment ? new Date(b.nextAppointment).getTime() : 0;
          return dir * (aTime - bTime);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [patients, filters]);

  // Initial fetch — only once per hook instance
  const didFetchRef = useRef(false);
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    fetchPatients();
  }, [fetchPatients]);

  const setSearch = useCallback(
    (search: string) => updateFilters({ search }),
    [updateFilters],
  );

  const setStatus = useCallback(
    (status: PatientFilters["status"]) => updateFilters({ status }),
    [updateFilters],
  );

  const setSortBy = useCallback(
    (sortBy: PatientFilters["sortBy"]) => updateFilters({ sortBy }),
    [updateFilters],
  );

  const toggleSortOrder = useCallback(() => {
    updateFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
  }, [filters.sortOrder, updateFilters]);

  return {
    patients: filteredPatients,
    allPatients: patients,
    filters,
    isLoading,
    fetchPatients,
    setSearch,
    setStatus,
    setSortBy,
    toggleSortOrder,
    updateFilters,
    resetFilters,
  };
}
