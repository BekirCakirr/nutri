// ---------------------------------------------------------------------------
// Common / Shared Types
// ---------------------------------------------------------------------------

/** Generic paginated request parameters. */
export interface PaginationParams {
  /** 1-based page index. */
  page: number;
  /** Number of items per page. */
  limit: number;
  /** Field to sort by. */
  sortBy?: string;
  /** Sort direction. */
  sortOrder?: "asc" | "desc";
}

/** Metadata returned alongside a paginated list. */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Standard envelope for every API response. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
  meta?: PaginationMeta;
  timestamp: string;
}

/** Structured API error. */
export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

/** Paginated list wrapper. */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/** Generic dropdown / select option. */
export interface SelectOption<V = string> {
  label: string;
  value: V;
  disabled?: boolean;
  icon?: string;
  description?: string;
  group?: string;
}

/** Inclusive date range. */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/** Time range within a single day (HH:mm format). */
export interface TimeRange {
  startTime: string;
  endTime: string;
}

/** File upload metadata. */
export interface FileUpload {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
}

/** Image variant (thumbnail, medium, full). */
export interface ImageVariant {
  url: string;
  width: number;
  height: number;
  format: string;
}

/** A set of responsive image variants. */
export interface ImageSet {
  original: string;
  thumbnail?: ImageVariant;
  medium?: ImageVariant;
  large?: ImageVariant;
}

/** Address information. */
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  apartment?: string;
  latitude?: number;
  longitude?: number;
}

/** Contact information. */
export interface ContactInfo {
  email: string;
  phone?: string;
  secondaryEmail?: string;
  secondaryPhone?: string;
  website?: string;
}

/** Audit timestamp fields shared by most entities. */
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/** Soft-delete flag. */
export interface SoftDeletable {
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
}

/** Locale / i18n preference. */
export interface LocalePreference {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  measurementSystem: "metric" | "imperial";
  currency: string;
}

/** Key-value metadata bag. */
export type Metadata = Record<string, string | number | boolean | null>;

/** Color theme preference. */
export type ThemeMode = "light" | "dark" | "system";

/** Generic status that can apply to many entities. */
export type GenericStatus = "active" | "inactive" | "pending" | "archived" | "suspended";

/** Day of week. */
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/** Gender options used across user profiles. */
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

/** Physical activity level classification. */
export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extremely_active";

/** Macro nutrient identifier. */
export type MacroNutrient = "calories" | "protein" | "carbohydrates" | "fat" | "fiber";

/** Standard unit of measure for nutrition values. */
export type NutritionUnit = "g" | "mg" | "mcg" | "kcal" | "kJ" | "IU" | "ml" | "oz" | "lb" | "kg";

/** Bulk action result. */
export interface BulkActionResult {
  total: number;
  succeeded: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

/** Search / filter base. */
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  pagination: PaginationParams;
}

/** Tab definition for UI tab bars. */
export interface TabItem {
  key: string;
  label: string;
  icon?: string;
  badge?: number;
  disabled?: boolean;
}

/** Breadcrumb navigation item. */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

/** Confirmation dialog descriptor. */
export interface ConfirmationDialog {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "info" | "warning" | "danger";
}

/** Toast / snackbar notification. */
export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}
