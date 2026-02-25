// ---------------------------------------------------------------------------
// Auth Service
// ---------------------------------------------------------------------------

import type { User, AuthResponse, LoginRequest, RegisterRequest, ChangePasswordRequest, UpdateProfileRequest } from "@/types/auth";
import { mockUser, mockToken, simulateApiCall } from "@/mock";

// ── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

function buildAuthResponse(): AuthResponse {
  return {
    user: mockUser as unknown as User,
    accessToken: mockToken,
    refreshToken: "mock-refresh-token-xyz789",
    expiresIn: 3600,
    tokenType: "Bearer",
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function login(_payload: LoginRequest): Promise<AuthResponse> {
  await delay(500);
  return buildAuthResponse();
}

export async function register(_payload: RegisterRequest): Promise<AuthResponse> {
  await delay(500);
  return buildAuthResponse();
}

export async function logout(): Promise<void> {
  await delay(300);
}

export async function getProfile(): Promise<User> {
  return simulateApiCall(mockUser as unknown as User, 300);
}

export async function updateProfile(_payload: UpdateProfileRequest): Promise<User> {
  await delay(400);
  return mockUser as unknown as User;
}

export async function changePassword(_payload: ChangePasswordRequest): Promise<{ success: boolean }> {
  await delay(400);
  return { success: true };
}
