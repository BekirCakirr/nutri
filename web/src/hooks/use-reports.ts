import { useState, useCallback } from "react";
import {
  getReports,
  generateReport as generateReportApi,
  deleteReport as deleteReportApi,
} from "@/services/report.service";

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
      const data = await getReports(patientId ? { patientId } : undefined);
      setReports(data as unknown as Report[]);
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
      const created = await generateReportApi({
        weekStart: data.period.startDate,
        weekEnd: data.period.endDate,
      });
      setReports((prev) => [created as unknown as Report, ...prev]);
      return created as unknown as Report;
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
      await deleteReportApi(reportId);
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
