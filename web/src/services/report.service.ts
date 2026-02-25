// ---------------------------------------------------------------------------
// Report Service
// ---------------------------------------------------------------------------

import { mockReports, simulateApiCall } from "@/mock";

type Report = (typeof mockReports)[number];

// ── Types ────────────────────────────────────────────────────────────────────

export interface ReportFilters {
  type?: string;
  patientId?: string;
  period?: { startDate: string; endDate: string };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getReports(
  filters?: ReportFilters,
): Promise<Report[]> {
  let items = [...mockReports];

  if (filters?.type) {
    items = items.filter((r) => r.type === filters.type);
  }
  if (filters?.patientId) {
    items = items.filter((r) => r.patientId === filters.patientId);
  }

  return simulateApiCall(items, 350);
}

export async function generateReport(params: {
  type: string;
  patientId?: string;
  startDate: string;
  endDate: string;
}): Promise<Report> {
  const newReport: Report = {
    ...mockReports[0],
    id: `rpt_${Date.now()}`,
    type: params.type as Report["type"],
    period: { startDate: params.startDate, endDate: params.endDate },
    generatedAt: new Date().toISOString(),
    status: "ready",
  };
  return simulateApiCall(newReport, 500);
}

export async function getPatientReport(
  patientId: string,
): Promise<Report | null> {
  const report = mockReports.find((r) => r.patientId === patientId) ?? null;
  return simulateApiCall(report, 300);
}

export async function exportReport(
  reportId: string,
  format: "pdf" | "csv",
): Promise<{ url: string }> {
  void reportId;
  void format;
  return simulateApiCall(
    { url: `https://api.nutriai.com/reports/${reportId}/export.${format}` },
    400,
  );
}
