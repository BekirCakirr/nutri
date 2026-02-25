// ---------------------------------------------------------------------------
// Notification Types
// ---------------------------------------------------------------------------

import type { PaginationParams, Timestamps } from "./common";

/** Notification category. */
export enum NotificationType {
  /** Appointment reminders & updates. */
  Appointment = "appointment",
  /** New message received. */
  Message = "message",
  /** Diet plan assigned, updated, or reviewed. */
  PlanUpdate = "plan_update",
  /** Goal milestone reached. */
  GoalProgress = "goal_progress",
  /** Meal logging reminders. */
  MealReminder = "meal_reminder",
  /** Weight / metric logging reminder. */
  TrackingReminder = "tracking_reminder",
  /** Patient activity for the dietitian. */
  PatientActivity = "patient_activity",
  /** Gamification badge, level up, streak. */
  Achievement = "achievement",
  /** System announcements. */
  System = "system",
  /** Billing / subscription. */
  Billing = "billing",
  /** Review request or received. */
  Review = "review",
  /** Invite code redeemed. */
  InviteCode = "invite_code",
  /** AI-generated insight or suggestion. */
  AiInsight = "ai_insight",
  /** Report is ready. */
  Report = "report",
  /** Shopping list reminder. */
  ShoppingList = "shopping_list",
}

/** Notification priority. */
export type NotificationPriority = "low" | "normal" | "high" | "urgent";

/** Delivery channel. */
export type NotificationChannel = "in_app" | "push" | "email" | "sms";

// ── Core entities ──────────────────────────────────────────────────────────

/** A single notification. */
export interface Notification extends Timestamps {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  title: string;
  body: string;
  imageUrl?: string | null;
  /** Deep-link or route path within the app. */
  actionUrl?: string | null;
  /** Action label for the CTA button. */
  actionLabel?: string | null;
  /** Extra structured data for rendering. */
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string | null;
  isDismissed: boolean;
  dismissedAt?: string | null;
  /** Scheduled delivery (null = immediate). */
  scheduledAt?: string | null;
  sentAt?: string | null;
  /** Grouping key for collapsing similar notifications. */
  groupKey?: string | null;
}

/** Grouped notification summary (e.g. "3 new messages"). */
export interface NotificationGroup {
  groupKey: string;
  type: NotificationType;
  count: number;
  latestNotification: Notification;
  notifications: Notification[];
}

/** Lightweight notification for the bell dropdown. */
export interface NotificationSummary {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string;
  imageUrl?: string | null;
  actionUrl?: string | null;
  isRead: boolean;
  createdAt: string;
  groupKey?: string | null;
}

// ── Preferences ────────────────────────────────────────────────────────────

/** Per-type notification preference. */
export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  channels: NotificationChannel[];
  /** Quiet hours override. */
  respectQuietHours: boolean;
}

/** Global notification settings for a user. */
export interface NotificationSettings {
  userId: string;
  preferences: NotificationPreference[];
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  quietHoursTimezone: string;
  emailDigest: "none" | "daily" | "weekly";
  pushEnabled: boolean;
  smsEnabled: boolean;
  doNotDisturb: boolean;
}

// ── Requests ───────────────────────────────────────────────────────────────

/** Mark one or more notifications as read. */
export interface MarkNotificationsReadRequest {
  notificationIds?: string[];
  /** If true, mark ALL as read. */
  markAll?: boolean;
}

/** Dismiss notifications. */
export interface DismissNotificationsRequest {
  notificationIds: string[];
}

/** Update notification settings. */
export interface UpdateNotificationSettingsRequest {
  preferences?: Partial<NotificationPreference>[];
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  quietHoursTimezone?: string;
  emailDigest?: "none" | "daily" | "weekly";
  pushEnabled?: boolean;
  smsEnabled?: boolean;
  doNotDisturb?: boolean;
}

/** Register a push notification device token. */
export interface RegisterDeviceTokenRequest {
  token: string;
  platform: "web" | "ios" | "android";
  deviceId: string;
  deviceName?: string;
}

/** Notification list filters. */
export interface NotificationFilters {
  types?: NotificationType[];
  priority?: NotificationPriority[];
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  pagination: PaginationParams;
}

/** Unread notification counts broken down by type. */
export interface UnreadCounts {
  total: number;
  byType: Partial<Record<NotificationType, number>>;
}

/** Real-time notification event (WebSocket). */
export interface NotificationEvent {
  type: "notification:new" | "notification:read" | "notification:dismissed";
  payload: Notification;
  timestamp: string;
}
