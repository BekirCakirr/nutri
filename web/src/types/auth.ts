// ---------------------------------------------------------------------------
// Authentication & Authorization Types
// ---------------------------------------------------------------------------

import type { ContactInfo, Gender, LocalePreference, Timestamps, ThemeMode } from "./common";

/** Roles available in the platform. */
export enum UserRole {
  Admin = "admin",
  Dietitian = "dietitian",
  Patient = "patient",
  Support = "support",
}

/** Account verification status. */
export enum VerificationStatus {
  Unverified = "unverified",
  Pending = "pending",
  Verified = "verified",
  Rejected = "rejected",
}

/** Subscription tier. */
export enum SubscriptionTier {
  Free = "free",
  Basic = "basic",
  Premium = "premium",
  Enterprise = "enterprise",
}

/** Two-factor authentication method. */
export type TwoFactorMethod = "totp" | "sms" | "email";

/** OAuth / social provider identifier. */
export type OAuthProvider = "google" | "apple" | "facebook";

// ── Core user ──────────────────────────────────────────────────────────────

/** Full user entity as stored in the backend. */
export interface User extends Timestamps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string | null;
  role: UserRole;
  gender?: Gender;
  dateOfBirth?: string | null;
  phone?: string | null;
  contact?: ContactInfo;
  locale: LocalePreference;
  theme: ThemeMode;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  verificationStatus: VerificationStatus;
  subscriptionTier: SubscriptionTier;
  twoFactorEnabled: boolean;
  twoFactorMethod?: TwoFactorMethod | null;
  lastLoginAt?: string | null;
  lastActiveAt?: string | null;
  oauthProviders: OAuthProvider[];
  metadata?: Record<string, unknown>;
}

/** Slimmed-down user object returned in lists / search results. */
export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  subscriptionTier: SubscriptionTier;
}

// ── Auth requests & responses ──────────────────────────────────────────────

/** Email + password login request. */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

/** New user registration request. */
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole.Dietitian | UserRole.Patient;
  gender?: Gender;
  dateOfBirth?: string;
  phone?: string;
  inviteCode?: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}

/** Successful auth response containing tokens. */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

/** Refresh token request body. */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** Refresh token response body. */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** Forgot-password request. */
export interface ForgotPasswordRequest {
  email: string;
}

/** Reset-password request (with token from email link). */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/** Change-password request (authenticated). */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Email verification request. */
export interface VerifyEmailRequest {
  token: string;
}

/** Enable 2FA request. */
export interface EnableTwoFactorRequest {
  method: TwoFactorMethod;
  phoneNumber?: string;
}

/** Enable 2FA response (e.g. QR code URI for TOTP). */
export interface EnableTwoFactorResponse {
  secret?: string;
  qrCodeUrl?: string;
  backupCodes: string[];
}

/** Verify 2FA setup. */
export interface VerifyTwoFactorRequest {
  code: string;
}

/** OAuth login initiation. */
export interface OAuthLoginRequest {
  provider: OAuthProvider;
  redirectUri: string;
}

/** OAuth callback payload. */
export interface OAuthCallbackRequest {
  provider: OAuthProvider;
  code: string;
  state: string;
}

/** Update current user profile. */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  gender?: Gender;
  dateOfBirth?: string;
  phone?: string;
  locale?: Partial<LocalePreference>;
  theme?: ThemeMode;
}

/** Session / device information. */
export interface Session {
  id: string;
  deviceName: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  isCurrent: boolean;
  lastActiveAt: string;
  createdAt: string;
}

/** Permission key (RBAC). */
export type Permission =
  | "patients:read"
  | "patients:write"
  | "patients:delete"
  | "plans:read"
  | "plans:write"
  | "plans:delete"
  | "appointments:read"
  | "appointments:write"
  | "appointments:delete"
  | "messages:read"
  | "messages:write"
  | "reports:read"
  | "reports:generate"
  | "admin:access"
  | "admin:manage_users"
  | "admin:manage_system";

/** Role → permission mapping. */
export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}
