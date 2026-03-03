// ---------------------------------------------------------------------------
// Report Types
// ---------------------------------------------------------------------------

import type { DateRange, Timestamps } from "./common";

/** Report type. */
export const ReportType = {
  NutritionSummary: "nutrition_summary",
  WeightProgress: "weight_progress",
  MealCompliance: "meal_compliance",
  PlanAdherence: "plan_adherence",
  GoalProgress: "goal_progress",
  PatientOverview: "patient_overview",
  HealthMetrics: "health_metrics",
  ExerciseSummary: "exercise_summary",
  WaterIntake: "water_intake",
  SleepAnalysis: "sleep_analysis",
  MoodWellness: "mood_wellness",
  BloodValues: "blood_values",
  DietitianPerformance: "dietitian_performance",
  RevenueAnalytics: "revenue_analytics",
  PlatformUsage: "platform_usage",
  Custom: "custom",
} as const
export type ReportType = (typeof ReportType)[keyof typeof ReportType]

/** Time period granularity. */
export type ReportPeriod = "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | "custom";

/** Report output format. */
export type ReportFormat = "json" | "pdf" | "csv" | "xlsx";

/** Report generation status. */
export type ReportStatus = "pending" | "generating" | "completed" | "failed" | "expired";

// ── Core entities ──────────────────────────────────────────────────────────

/** A generated report. */
export interface Report extends Timestamps {
  id: string;
  type: ReportType;
  title: string;
  description?: string | null;
  status: ReportStatus;
  period: ReportPeriod;
  dateRange: DateRange;
  format: ReportFormat;

  /** Who generated it. */
  generatedBy: string;
  generatedByName: string;
  /** Target patient (if applicable). */
  patientId?: string | null;
  patientName?: string | null;

  /** Download URL (once generated). */
  downloadUrl?: string | null;
  /** File size in bytes. */
  fileSize?: number | null;
  /** Expiry of the download link. */
  expiresAt?: string | null;

  /** Structured report data (for in-app rendering). */
  data?: ReportData | null;

  /** Report parameters / config used. */
  parameters?: Record<string, unknown>;

  /** Error message if failed. */
  errorMessage?: string | null;
}

/** Lightweight report for listings. */
export interface ReportSummary {
  id: string;
  type: ReportType;
  title: string;
  status: ReportStatus;
  period: ReportPeriod;
  dateRange: DateRange;
  format: ReportFormat;
  patientName?: string | null;
  createdAt: string;
  downloadUrl?: string | null;
}

// ── Report data structures ─────────────────────────────────────────────────

/** Top-level structured report data. */
export interface ReportData {
  summary: ReportSummaryData;
  sections: ReportSection[];
  charts: ChartData[];
  tables?: ReportTable[];
  insights?: ReportInsight[];
}

/** High-level summary numbers at the top of a report. */
export interface ReportSummaryData {
  metrics: ReportMetric[];
}

/** A single KPI / metric in a report summary. */
export interface ReportMetric {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  change?: number | null;
  changePercent?: number | null;
  changeDirection?: "up" | "down" | "stable";
  isPositiveChange?: boolean;
  target?: number | null;
  icon?: string;
}

/** A titled section of a report. */
export interface ReportSection {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  content: string;
  chartIds?: string[];
  tableIds?: string[];
}

/** Chart / visualisation data. */
export interface ChartData {
  id: string;
  title: string;
  description?: string | null;
  type: ChartType;
  datasets: ChartDataset[];
  labels: string[];
  options?: ChartOptions;
}

/** Supported chart types. */
export type ChartType =
  | "line"
  | "bar"
  | "horizontal_bar"
  | "stacked_bar"
  | "pie"
  | "donut"
  | "area"
  | "scatter"
  | "radar"
  | "heatmap"
  | "gauge";

/** A single dataset within a chart. */
export interface ChartDataset {
  label: string;
  data: (number | null)[];
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  fill?: boolean;
  yAxisId?: string;
  type?: ChartType;
}

/** Chart rendering options. */
export interface ChartOptions {
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  yAxisMin?: number;
  yAxisMax?: number;
  stacked?: boolean;
  aspectRatio?: number;
  annotations?: ChartAnnotation[];
}

/** Chart annotation (goal line, event marker, etc.). */
export interface ChartAnnotation {
  type: "line" | "point" | "range";
  label: string;
  value?: number;
  startValue?: number;
  endValue?: number;
  color: string;
  axis: "x" | "y";
}

/** A data table within a report. */
export interface ReportTable {
  id: string;
  title: string;
  columns: ReportTableColumn[];
  rows: Record<string, unknown>[];
  summary?: Record<string, unknown>;
}

/** Column definition for a report table. */
export interface ReportTableColumn {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "percent" | "currency" | "badge";
  align?: "left" | "center" | "right";
  width?: string;
  sortable?: boolean;
  formatter?: string;
}

/** AI-generated or rule-based insight. */
export interface ReportInsight {
  id: string;
  type: "positive" | "negative" | "neutral" | "warning" | "suggestion";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  relatedMetric?: string;
  actionable: boolean;
  suggestedAction?: string;
}

// ── Requests ───────────────────────────────────────────────────────────────

/** Request to generate a report. */
export interface GenerateReportRequest {
  type: ReportType;
  title?: string;
  patientId?: string;
  period: ReportPeriod;
  dateRange: DateRange;
  format?: ReportFormat;
  sections?: string[];
  includeCharts?: boolean;
  includeTables?: boolean;
  includeInsights?: boolean;
  parameters?: Record<string, unknown>;
}

/** Schedule recurring report generation. */
export interface ScheduleReportRequest {
  type: ReportType;
  patientId?: string;
  period: ReportPeriod;
  format: ReportFormat;
  frequency: "daily" | "weekly" | "monthly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  recipients?: string[];
  isActive: boolean;
}

/** Scheduled report configuration. */
export interface ScheduledReport extends Timestamps {
  id: string;
  type: ReportType;
  patientId?: string | null;
  patientName?: string | null;
  period: ReportPeriod;
  format: ReportFormat;
  frequency: "daily" | "weekly" | "monthly";
  schedule: string;
  timezone: string;
  recipients: string[];
  isActive: boolean;
  lastGeneratedAt?: string | null;
  nextGenerationAt: string;
}

/** Report listing filters. */
export interface ReportFilters {
  type?: ReportType[];
  status?: ReportStatus[];
  patientId?: string;
  format?: ReportFormat[];
  dateRange?: DateRange;
  search?: string;
  pagination: {
    page: number;
    limit: number;
  };
}
