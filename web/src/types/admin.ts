// ---------------------------------------------------------------------------
// Admin / System Types
// ---------------------------------------------------------------------------

import type { DateRange, PaginationParams, Timestamps } from "./common";
import type { UserRole, SubscriptionTier, VerificationStatus } from "./auth";

// ── Dashboard / Stats ──────────────────────────────────────────────────────

/** Top-level admin dashboard stats. */
export interface AdminStats {
  users: UserStats;
  revenue: RevenueStats;
  engagement: EngagementStats;
  system: SystemHealthStats;
  timestamp: string;
}

/** User statistics. */
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  usersByRole: Record<UserRole, number>;
  usersBySubscription: Record<SubscriptionTier, number>;
  userGrowth: Array<{ date: string; count: number }>;
  retentionRate: number;
  churnRate: number;
}

/** Revenue analytics. */
export interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  dailyRevenue: number;
  currency: string;
  mrr: number;
  arr: number;
  averageRevenuePerUser: number;
  revenueBySubscription: Record<SubscriptionTier, number>;
  revenueGrowth: Array<{ date: string; amount: number }>;
  conversionRate: number;
  trialToPayingRate: number;
}

/** Engagement / usage analytics. */
export interface EngagementStats {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  averageSessionsPerUser: number;
  mealLogsToday: number;
  mealLogsThisWeek: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  messagesThisWeek: number;
  plansCreatedThisWeek: number;
  topFeatures: Array<{ feature: string; usageCount: number }>;
}

/** System health & infrastructure. */
export interface SystemHealthStats {
  status: "healthy" | "degraded" | "down";
  uptime: number;
  uptimePercent: number;
  apiLatencyMs: number;
  errorRate: number;
  activeConnections: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  diskUsagePercent: number;
  databaseStatus: ServiceStatus;
  cacheStatus: ServiceStatus;
  storageStatus: ServiceStatus;
  emailStatus: ServiceStatus;
  aiServiceStatus: ServiceStatus;
  lastCheckedAt: string;
}

/** Individual service status. */
export interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down" | "maintenance";
  latencyMs: number;
  message?: string | null;
  lastIncidentAt?: string | null;
}

/** System health check result (detailed). */
export interface SystemHealth {
  overall: "healthy" | "degraded" | "down";
  services: ServiceStatus[];
  recentIncidents: SystemIncident[];
  scheduledMaintenance: ScheduledMaintenance[];
}

/** Incident record. */
export interface SystemIncident extends Timestamps {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "investigating" | "identified" | "monitoring" | "resolved";
  affectedServices: string[];
  startedAt: string;
  resolvedAt?: string | null;
  updates: IncidentUpdate[];
}

/** An update within an incident timeline. */
export interface IncidentUpdate {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  createdBy: string;
}

/** Scheduled maintenance window. */
export interface ScheduledMaintenance {
  id: string;
  title: string;
  description: string;
  scheduledStart: string;
  scheduledEnd: string;
  affectedServices: string[];
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
}

// ── User management ────────────────────────────────────────────────────────

/** Admin user management list filters. */
export interface UserManagementFilters {
  search?: string;
  roles?: UserRole[];
  subscriptionTiers?: SubscriptionTier[];
  verificationStatus?: VerificationStatus[];
  isActive?: boolean;
  dateRange?: DateRange;
  pagination: PaginationParams;
}

/** Admin action on a user account. */
export interface AdminUserAction {
  userId: string;
  action:
    | "activate"
    | "deactivate"
    | "suspend"
    | "unsuspend"
    | "verify"
    | "reject_verification"
    | "reset_password"
    | "change_role"
    | "change_subscription"
    | "delete"
    | "impersonate";
  reason?: string;
  newRole?: UserRole;
  newSubscriptionTier?: SubscriptionTier;
}

/** Result of an admin user action. */
export interface AdminUserActionResult {
  success: boolean;
  userId: string;
  action: string;
  message: string;
  timestamp: string;
}

/** Detailed user record for admin view. */
export interface AdminUserDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  verificationStatus: VerificationStatus;
  isEmailVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
  suspendedReason?: string | null;
  lastLoginAt?: string | null;
  lastActiveAt?: string | null;
  createdAt: string;
  /** Number of patients (if dietitian). */
  patientCount?: number;
  /** Dietitian id (if patient). */
  assignedDietitianName?: string | null;
  /** Revenue generated. */
  totalSpent?: number;
  /** Login count. */
  loginCount: number;
  /** Support tickets count. */
  supportTicketCount: number;
  /** Notes from admins. */
  adminNotes?: AdminNote[];
}

/** Admin note on a user account. */
export interface AdminNote extends Timestamps {
  id: string;
  userId: string;
  authorId: string;
  authorName: string;
  content: string;
  isPinned: boolean;
}

// ── Audit log ──────────────────────────────────────────────────────────────

/** Audit log entry. */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failure";
}

/** Audit log filters. */
export interface AuditLogFilters {
  userId?: string;
  action?: string[];
  resource?: string[];
  status?: ("success" | "failure")[];
  dateRange?: DateRange;
  search?: string;
  pagination: PaginationParams;
}

// ── Content management ─────────────────────────────────────────────────────

/** Feature flag. */
export interface FeatureFlag extends Timestamps {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  isEnabled: boolean;
  enabledForRoles?: UserRole[];
  enabledForTiers?: SubscriptionTier[];
  enabledForUserIds?: string[];
  rolloutPercent: number;
}

/** Platform configuration setting. */
export interface PlatformSetting {
  key: string;
  value: string | number | boolean;
  type: "string" | "number" | "boolean" | "json";
  category: string;
  label: string;
  description?: string;
  isEditable: boolean;
  updatedAt: string;
  updatedBy?: string;
}

/** Announcement / banner. */
export interface Announcement extends Timestamps {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "maintenance" | "feature" | "promotion";
  targetRoles?: UserRole[];
  targetTiers?: SubscriptionTier[];
  isActive: boolean;
  startDate: string;
  endDate?: string | null;
  dismissible: boolean;
  actionUrl?: string | null;
  actionLabel?: string | null;
}

// ── Support ────────────────────────────────────────────────────────────────

/** Support ticket. */
export interface SupportTicket extends Timestamps {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: "technical" | "billing" | "account" | "feature_request" | "bug_report" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting_on_user" | "resolved" | "closed";
  assignedTo?: string | null;
  assignedToName?: string | null;
  messages: SupportMessage[];
  attachments?: string[];
  resolvedAt?: string | null;
  satisfaction?: number | null;
}

/** A message within a support ticket. */
export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: "user" | "support" | "admin";
  content: string;
  attachments?: string[];
  createdAt: string;
}
