// ---------------------------------------------------------------------------
// Invite Code Types
// ---------------------------------------------------------------------------

import type { PaginationParams, Timestamps } from "./common";
import type { UserRole } from "./auth";

/** Invite code status. */
export enum InviteCodeStatus {
  Active = "active",
  Used = "used",
  Expired = "expired",
  Revoked = "revoked",
  Exhausted = "exhausted",
}

/** Invite code type / purpose. */
export type InviteCodeType =
  | "patient_invite"
  | "dietitian_invite"
  | "referral"
  | "promotional"
  | "beta_access"
  | "group_onboarding";

// ── Core entities ──────────────────────────────────────────────────────────

/** An invite code. */
export interface InviteCode extends Timestamps {
  id: string;
  code: string;
  type: InviteCodeType;
  status: InviteCodeStatus;

  /** Who created the code. */
  createdById: string;
  createdByName: string;
  createdByRole: UserRole;

  /** Role assigned to the user who redeems the code. */
  targetRole: UserRole;

  /** Specific dietitian this code associates the new user with. */
  dietitianId?: string | null;
  dietitianName?: string | null;

  /** Usage limits. */
  maxUses: number;
  currentUses: number;
  remainingUses: number;

  /** Validity window. */
  expiresAt?: string | null;
  isExpired: boolean;

  /** Personalized (for a specific email). */
  restrictedToEmail?: string | null;

  /** Custom welcome message shown on redemption. */
  welcomeMessage?: string | null;

  /** Metadata for tracking campaigns. */
  campaign?: string | null;
  source?: string | null;
  tags: string[];

  /** Redemption history. */
  redemptions: InviteCodeRedemption[];
}

/** Lightweight invite code for listings. */
export interface InviteCodeSummary {
  id: string;
  code: string;
  type: InviteCodeType;
  status: InviteCodeStatus;
  createdByName: string;
  dietitianName?: string | null;
  maxUses: number;
  currentUses: number;
  expiresAt?: string | null;
  createdAt: string;
}

/** A single redemption event. */
export interface InviteCodeRedemption {
  id: string;
  inviteCodeId: string;
  userId: string;
  userName: string;
  userEmail: string;
  redeemedAt: string;
}

// ── Requests ───────────────────────────────────────────────────────────────

/** Create a new invite code. */
export interface CreateInviteCodeRequest {
  type: InviteCodeType;
  targetRole: UserRole;
  dietitianId?: string;
  maxUses?: number;
  expiresAt?: string;
  restrictedToEmail?: string;
  welcomeMessage?: string;
  campaign?: string;
  source?: string;
  tags?: string[];
  /** Auto-generate a code or provide a custom one. */
  customCode?: string;
}

/** Create multiple invite codes at once. */
export interface BulkCreateInviteCodesRequest {
  count: number;
  type: InviteCodeType;
  targetRole: UserRole;
  dietitianId?: string;
  maxUsesEach?: number;
  expiresAt?: string;
  campaign?: string;
  source?: string;
  tags?: string[];
  prefix?: string;
}

/** Redeem an invite code. */
export interface RedeemInviteCodeRequest {
  code: string;
  userId?: string;
  email?: string;
}

/** Redemption result. */
export interface RedeemInviteCodeResponse {
  success: boolean;
  inviteCode: InviteCode;
  assignedDietitianId?: string | null;
  assignedDietitianName?: string | null;
  welcomeMessage?: string | null;
  message: string;
}

/** Revoke an invite code. */
export interface RevokeInviteCodeRequest {
  inviteCodeId: string;
  reason?: string;
}

/** Validate an invite code (check before redeeming). */
export interface ValidateInviteCodeRequest {
  code: string;
  email?: string;
}

/** Validation result. */
export interface ValidateInviteCodeResponse {
  isValid: boolean;
  code: string;
  type?: InviteCodeType;
  targetRole?: UserRole;
  dietitianName?: string | null;
  welcomeMessage?: string | null;
  errorMessage?: string | null;
}

/** Invite code filters. */
export interface InviteCodeFilters {
  search?: string;
  type?: InviteCodeType[];
  status?: InviteCodeStatus[];
  createdById?: string;
  dietitianId?: string;
  campaign?: string;
  tags?: string[];
  hasRemainingUses?: boolean;
  isExpired?: boolean;
  pagination: PaginationParams;
}

/** Invite code analytics. */
export interface InviteCodeAnalytics {
  totalCodes: number;
  activeCodes: number;
  totalRedemptions: number;
  redemptionRate: number;
  byCampaign: Array<{
    campaign: string;
    codesCreated: number;
    redemptions: number;
    conversionRate: number;
  }>;
  byType: Array<{
    type: InviteCodeType;
    count: number;
    redemptions: number;
  }>;
  recentRedemptions: InviteCodeRedemption[];
  redemptionTrend: Array<{ date: string; count: number }>;
}
