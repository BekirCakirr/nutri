import { useState, useCallback } from "react";
import { mockReports, simulateApiCall } from "@/mock";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Report {
  id: string;
  type: "progress" | "overview" | "compliance" | "custom";
  title: string;
  patientId: string | null;
  patientName: string | null;
  period: { startDate: string; endDate: string };
  summary: string;
  metrics: Record<string, number>;
  generatedAt: string;
  status: "ready" | "generating" | "failed";
}

interface GenerateReportData {
  type: Report["type"];
  patientId?: string;
  period: Report["period"];
  title?: string;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Report generation and retrieval operations.
 */
export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (patientId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const all = await simulateApiCall(mockReports, 700);
      const filtered = patientId
        ? all.filter((r) => r.patientId === patientId)
        : all;
      setReports(filtered as Report[]);
    } catch {
      setError("Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateReport = useCallback(async (data: GenerateReportData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newReport: Report = {
        id: `rpt_${Date.now()}`,
        type: data.type,
        title: data.title ?? `${data.type} Report`,
        patientId: data.patientId ?? null,
        patientName: null,
        period: data.period,
        summary: "Report is being generated...",
        metrics: {},
        generatedAt: new Date().toISOString(),
        status: "generating",
      };

      // Simulate generation delay
      const created = await simulateApiCall(
        { ...newReport, status: "ready" as const, summary: "Report generated successfully." },
        1500,
      );
      setReports((prev) => [created, ...prev]);
      return created;
    } catch {
      setError("Failed to generate report");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteReport = useCallback(async (reportId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await simulateApiCall(null, 400);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch {
      setError("Failed to delete report");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    reports,
    isLoading,
    error,
    fetchReports,
    generateReport,
    deleteReport,
  };
}
