// ---------------------------------------------------------------------------
// Auth Service
// ---------------------------------------------------------------------------

import api from "@/lib/axios";
import type { User, AuthResponse, LoginRequest, RegisterRequest, ChangePasswordRequest, UpdateProfileRequest } from "@/types/auth";

// ── Public API ───────────────────────────────────────────────────────────────

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post("/auth/login", payload);
  // data = { user, tokens: { accessToken, refreshToken, expiresIn, tokenType } }
  const { user, tokens } = data as any;
  // Store tokens
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  // Normalize user object — backend login returns minimal fields (id, email, role, firstName, lastName)
  // Fill in defaults expected by the auth store
  const normalizedUser = {
    ...user,
    avatar: user.avatar ?? user.avatarUrl ?? user.profilePhotoUrl ?? '',
    status: user.status ?? (user.isActive === false ? 'inactive' : 'active'),
    createdAt: user.createdAt ?? '',
    updatedAt: user.updatedAt ?? '',
  };
  return { user: normalizedUser, ...tokens };
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  // Determine endpoint based on role (default patient)
  const endpoint = (payload as any).licenseNumber
    ? "/auth/register/dietitian"
    : "/auth/register/patient";
  const { data } = await api.post(endpoint, payload);
  const { user, tokens } = data as any;
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  // Normalize user object — backend register returns minimal fields
  const normalizedUser = {
    ...user,
    avatar: user.avatar ?? user.avatarUrl ?? user.profilePhotoUrl ?? '',
    status: user.status ?? 'active',
    createdAt: user.createdAt ?? '',
    updatedAt: user.updatedAt ?? '',
  };
  return { user: normalizedUser, ...tokens };
}

export async function logout(): Promise<void> {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get("/auth/me");
  // Backend returns { id, email, role, profile: { firstName, lastName, profilePhotoUrl, ... } }
  // Flatten profile into top-level user object and normalize field names
  const raw = data as any;
  let merged: any;
  if (raw.profile) {
    const { profile, ...rest } = raw;
    merged = { ...rest, ...profile };
  } else {
    merged = { ...raw };
  }
  // Normalize fields expected by auth store
  merged.avatar = merged.avatar ?? merged.avatarUrl ?? merged.profilePhotoUrl ?? '';
  merged.status = merged.status ?? (merged.isActive === false ? 'inactive' : 'active');
  merged.phone = merged.phone ?? '';
  return merged as User;
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<User> {
  const { data } = await api.put("/patients/me", payload);
  return data as User;
}

export async function changePassword(payload: ChangePasswordRequest): Promise<{ success: boolean }> {
  await api.post("/auth/change-password", payload);
  return { success: true };
}
