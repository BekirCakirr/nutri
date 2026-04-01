import { useState, useCallback, useEffect, useRef } from "react";
import { getPatients } from "@/services/patient.service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LiveTrackingEntry {
  patientId: string;
  patientName: string;
  avatar: string;
  currentCalories: number;
  targetCalories: number;
  mealsLogged: number;
  totalMealsExpected: number;
  lastActivity: string;
  lastActivityAt: string;
  waterIntake: number;
  waterTarget: number;
  isOnline: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Live patient tracking data with polling support.
 *
 * Note: Backend does not yet have a dedicated dietitian-facing aggregation
 * endpoint. Currently we derive partial tracking data from the patients list
 * endpoint. A future `/api/tracking/dietitian-overview` would improve this.
 *
 * @param pollIntervalMs - Polling interval in milliseconds (default: 30000).
 *                          Pass 0 to disable polling.
 */
export function useLiveTracking(pollIntervalMs = 30_000) {
  const [trackingData, setTrackingData] = useState<LiveTrackingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTrackingData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPatients();
      const entries: LiveTrackingEntry[] = response.items.map((p: any) => ({
        patientId: p.id,
        patientName: `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || p.name || "Hasta",
        avatar: p.avatarUrl ?? p.avatar ?? "",
        currentCalories: p.todayCalories ?? 0,
        targetCalories: p.targetCalories ?? 2000,
        mealsLogged: p.todayMeals ?? 0,
        totalMealsExpected: 4,
        lastActivity: p.lastActivity ?? "Bilgi yok",
        lastActivityAt: p.lastActivityAt ?? p.updatedAt ?? new Date().toISOString(),
        waterIntake: p.todayWater ?? 0,
        waterTarget: p.waterTarget ?? 8,
        isOnline: p.isOnline ?? false,
      }));
      setTrackingData(entries);
      setLastUpdated(new Date());
    } catch {
      setError("Failed to fetch tracking data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start/stop polling
  useEffect(() => {
    fetchTrackingData();

    if (pollIntervalMs > 0) {
      intervalRef.current = setInterval(fetchTrackingData, pollIntervalMs);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pollIntervalMs, fetchTrackingData]);

  const onlinePatients = trackingData.filter((p) => p.isOnline);
  const offlinePatients = trackingData.filter((p) => !p.isOnline);

  const getPatientProgress = useCallback(
    (patientId: string) => {
      const entry = trackingData.find((p) => p.patientId === patientId);
      if (!entry) return null;
      return {
        calorieProgress: entry.targetCalories > 0
          ? Math.round((entry.currentCalories / entry.targetCalories) * 100)
          : 0,
        mealProgress: entry.totalMealsExpected > 0
          ? Math.round((entry.mealsLogged / entry.totalMealsExpected) * 100)
          : 0,
        waterProgress: entry.waterTarget > 0
          ? Math.round((entry.waterIntake / entry.waterTarget) * 100)
          : 0,
      };
    },
    [trackingData],
  );

  return {
    trackingData,
    onlinePatients,
    offlinePatients,
    isLoading,
    error,
    lastUpdated,
    fetchTrackingData,
    getPatientProgress,
  };
}
