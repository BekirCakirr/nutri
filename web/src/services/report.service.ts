import api from "@/lib/axios";

import type { Report } from "@/types/report";
export type { Report };

export interface ReportFilters {
  patientId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

interface ApiReportListResponse {
  reports?: Report[];
}

export async function getReports(filters?: ReportFilters): Promise<Report[]> {
  const { data } = await api.get("/reports/weekly", { params: filters });
  const result = data as ApiReportListResponse;
  return result.reports ?? (Array.isArray(data) ? (data as Report[]) : []);
}

export async function generateReport(params: {
  weekStart: string;
  weekEnd: string;
}): Promise<Report> {
  const { data } = await api.post("/reports/weekly/generate", params);
  return data as Report;
}

export async function getPatientReport(patientId: string): Promise<Report | null> {
  try {
    const { data } = await api.get("/reports/summary", { params: { patientId } });
    return data as Report;
  } catch {
    return null;
  }
}

export async function exportReport(
  reportId: string,
  _format: string,
): Promise<{ url: string }> {
  // PDF export not yet implemented in backend — return placeholder
  return { url: `/api/reports/weekly/${reportId}` };
}

export async function deleteReport(reportId: string): Promise<void> {
  await api.delete(`/reports/weekly/${reportId}`);
}
