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
  return { user, ...tokens };
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
  return { user, ...tokens };
}

export async function logout(): Promise<void> {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data as User;
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<User> {
  const { data } = await api.put("/patients/me", payload);
  return data as User;
}

export async function changePassword(payload: ChangePasswordRequest): Promise<{ success: boolean }> {
  await api.post("/auth/change-password", payload);
  return { success: true };
}
