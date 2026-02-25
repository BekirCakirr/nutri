import { useState, useCallback, useEffect, useRef } from "react";
import { mockLiveTrackingData, simulateApiCall } from "@/mock";

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
      const data = await simulateApiCall(mockLiveTrackingData, 500);
      setTrackingData(data as LiveTrackingEntry[]);
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
        calorieProgress: Math.round(
          (entry.currentCalories / entry.targetCalories) * 100,
        ),
        mealProgress: Math.round(
          (entry.mealsLogged / entry.totalMealsExpected) * 100,
        ),
        waterProgress: Math.round(
          (entry.waterIntake / entry.waterTarget) * 100,
        ),
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
