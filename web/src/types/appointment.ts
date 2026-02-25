// ---------------------------------------------------------------------------
// Appointment Types
// ---------------------------------------------------------------------------

import type { DateRange, DayOfWeek, PaginationParams, TimeRange, Timestamps } from "./common";

/** Appointment lifecycle status. */
export enum AppointmentStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  InProgress = "in_progress",
  Completed = "completed",
  Cancelled = "cancelled",
  NoShow = "no_show",
  Rescheduled = "rescheduled",
}

/** How the appointment is conducted. */
export type AppointmentMode = "video" | "phone" | "in_person" | "chat";

/** Appointment type / purpose. */
export type AppointmentType =
  | "initial_consultation"
  | "follow_up"
  | "plan_review"
  | "progress_check"
  | "emergency"
  | "group_session"
  | "cooking_demo"
  | "other";

/** Cancellation reason. */
export type CancellationReason =
  | "patient_request"
  | "dietitian_request"
  | "schedule_conflict"
  | "illness"
  | "emergency"
  | "no_show"
  | "other";

/** Recurrence pattern for repeating appointments. */
export type RecurrencePattern = "none" | "daily" | "weekly" | "biweekly" | "monthly";

// ── Core entities ──────────────────────────────────────────────────────────

/** Full appointment entity. */
export interface Appointment extends Timestamps {
  id: string;
  patientId: string;
  dietitianId: string;
  status: AppointmentStatus;
  type: AppointmentType;
  mode: AppointmentMode;

  title: string;
  description?: string | null;

  /** ISO-8601 date-time. */
  scheduledAt: string;
  /** Duration in minutes. */
  durationMinutes: number;
  /** Computed end time. */
  endsAt: string;

  /** Timezone of the appointment. */
  timezone: string;

  /** Video / call link. */
  meetingUrl?: string | null;
  meetingId?: string | null;
  /** In-person location. */
  location?: string | null;

  /** Recurrence. */
  recurrence: RecurrencePattern;
  recurrenceEndDate?: string | null;
  recurringGroupId?: string | null;

  /** Notes. */
  patientNotes?: string | null;
  dietitianNotes?: string | null;
  internalNotes?: string | null;

  /** Pre-appointment forms / questionnaires. */
  preAppointmentFormId?: string | null;
  preAppointmentFormCompleted: boolean;

  /** Post-appointment summary. */
  summary?: AppointmentSummary | null;

  /** Reminders sent. */
  reminders: AppointmentReminder[];

  /** Cancellation. */
  cancelledAt?: string | null;
  cancelledBy?: string | null;
  cancellationReason?: CancellationReason | null;

  /** Rescheduled from. */
  rescheduledFromId?: string | null;

  /** Cost / billing. */
  price?: number | null;
  currency?: string | null;
  isPaid: boolean;
  paymentId?: string | null;

  /** Participant details (denormalized for display). */
  patient: AppointmentParticipant;
  dietitian: AppointmentParticipant;
}

/** Participant info embedded in an appointment. */
export interface AppointmentParticipant {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string | null;
  email: string;
}

/** Lightweight appointment for calendars / lists. */
export interface AppointmentSummaryItem {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatarUrl?: string | null;
  dietitianId: string;
  dietitianName: string;
  status: AppointmentStatus;
  type: AppointmentType;
  mode: AppointmentMode;
  scheduledAt: string;
  durationMinutes: number;
  endsAt: string;
  title: string;
}

/** Post-appointment summary filled in by the dietitian. */
export interface AppointmentSummary {
  id: string;
  appointmentId: string;
  dietitianId: string;
  summary: string;
  keyFindings?: string[];
  recommendations?: string[];
  followUpActions?: FollowUpAction[];
  attachments?: string[];
  sharedWithPatient: boolean;
  createdAt: string;
}

/** Follow-up action assigned during an appointment. */
export interface FollowUpAction {
  id: string;
  description: string;
  assignedTo: "patient" | "dietitian";
  dueDate?: string | null;
  isCompleted: boolean;
  completedAt?: string | null;
}

/** Reminder for an upcoming appointment. */
export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  type: "email" | "sms" | "push";
  scheduledAt: string;
  sentAt?: string | null;
  minutesBefore: number;
}

// ── Time slots / availability ──────────────────────────────────────────────

/** An available time slot for booking. */
export interface TimeSlot {
  id: string;
  dietitianId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  isAvailable: boolean;
  isBooked: boolean;
  appointmentId?: string | null;
  mode: AppointmentMode[];
}

/** Availability for a specific date. */
export interface DayAvailability {
  date: string;
  dayOfWeek: DayOfWeek;
  slots: TimeSlot[];
  totalSlots: number;
  availableSlots: number;
  isWorkingDay: boolean;
}

/** Availability override (vacation, blocked time). */
export interface AvailabilityOverride extends Timestamps {
  id: string;
  dietitianId: string;
  date: string;
  timeRange?: TimeRange | null;
  type: "blocked" | "available";
  reason?: string | null;
  isAllDay: boolean;
}

/** Availability query. */
export interface AvailabilityQuery {
  dietitianId: string;
  startDate: string;
  endDate: string;
  mode?: AppointmentMode;
  durationMinutes?: number;
}

// ── Requests ───────────────────────────────────────────────────────────────

/** Book a new appointment. */
export interface CreateAppointmentRequest {
  patientId: string;
  dietitianId: string;
  type: AppointmentType;
  mode: AppointmentMode;
  title?: string;
  description?: string;
  scheduledAt: string;
  durationMinutes: number;
  timezone: string;
  location?: string;
  recurrence?: RecurrencePattern;
  recurrenceEndDate?: string;
  patientNotes?: string;
  price?: number;
  currency?: string;
}

/** Reschedule an appointment. */
export interface RescheduleAppointmentRequest {
  appointmentId: string;
  newScheduledAt: string;
  newDurationMinutes?: number;
  reason?: string;
}

/** Cancel an appointment. */
export interface CancelAppointmentRequest {
  appointmentId: string;
  reason: CancellationReason;
  notes?: string;
}

/** Complete an appointment with summary. */
export interface CompleteAppointmentRequest {
  appointmentId: string;
  summary: string;
  keyFindings?: string[];
  recommendations?: string[];
  followUpActions?: Omit<FollowUpAction, "id" | "isCompleted" | "completedAt">[];
  shareWithPatient?: boolean;
}

/** Appointment list filters. */
export interface AppointmentFilters {
  patientId?: string;
  dietitianId?: string;
  status?: AppointmentStatus[];
  type?: AppointmentType[];
  mode?: AppointmentMode[];
  dateRange?: DateRange;
  search?: string;
  pagination: PaginationParams;
}

/** Calendar view range. */
export interface CalendarViewParams {
  dietitianId: string;
  view: "day" | "week" | "month";
  date: string;
  timezone: string;
}
