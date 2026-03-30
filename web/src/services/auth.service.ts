// ---------------------------------------------------------------------------
// Auth Service
// ---------------------------------------------------------------------------

import api from "@/lib/axios";
import type { User, AuthResponse, LoginRequest, RegisterRequest, ChangePasswordRequest, UpdateProfileRequest } from "@/types/auth";

/** Shape backend returns on login/register after camelCase transform */
interface ApiAuthPayload {
  user: Record<string, unknown>;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: "Bearer";
  };
}

/** Shape backend returns on GET /auth/me */
interface ApiProfilePayload {
  id: string;
  email: string;
  role: string;
  profile?: Record<string, unknown>;
  [key: string]: unknown;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function normalizeUser(raw: Record<string, unknown>): User {
  return {
    ...raw,
    avatar: (raw.avatar ?? raw.avatarUrl ?? raw.profilePhotoUrl ?? '') as string,
    status: (raw.status ?? (raw.isActive === false ? 'inactive' : 'active')) as string,
    createdAt: (raw.createdAt ?? '') as string,
    updatedAt: (raw.updatedAt ?? '') as string,
  } as unknown as User;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post("/auth/login", payload);
  const { user, tokens } = data as ApiAuthPayload;
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  return { user: normalizeUser(user), ...tokens };
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const endpoint = 'licenseNumber' in payload
    ? "/auth/register/dietitian"
    : "/auth/register/patient";
  const { data } = await api.post(endpoint, payload);
  const { user, tokens } = data as ApiAuthPayload;
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  return { user: normalizeUser(user), ...tokens };
}

export async function logout(): Promise<void> {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get("/auth/me");
  const raw = data as ApiProfilePayload;
  let merged: Record<string, unknown>;
  if (raw.profile) {
    const { profile, ...rest } = raw;
    merged = { ...rest, ...(profile as Record<string, unknown>) };
  } else {
    merged = { ...raw };
  }
  merged.avatar = merged.avatar ?? merged.avatarUrl ?? merged.profilePhotoUrl ?? '';
  merged.status = merged.status ?? (merged.isActive === false ? 'inactive' : 'active');
  merged.phone = merged.phone ?? '';
  return merged as unknown as User;
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<User> {
  const { data } = await api.put("/patients/me", payload);
  return data as User;
}

export async function changePassword(payload: ChangePasswordRequest): Promise<{ success: boolean }> {
  await api.post("/auth/change-password", payload);
  return { success: true };
}

