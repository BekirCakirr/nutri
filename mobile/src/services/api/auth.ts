import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types';
import { mockUser } from '@/mock';

const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  await delay();
  return {
    user: mockUser,
    token: 'mock-jwt-token-' + Date.now(),
  };
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  await delay(1000);
  return {
    user: { ...mockUser, name: payload.name, email: payload.email },
    token: 'mock-jwt-token-' + Date.now(),
  };
}

export async function getMe(): Promise<User> {
  await delay(500);
  return mockUser;
}

export async function updateUser(data: Partial<User>): Promise<User> {
  await delay();
  return { ...mockUser, ...data };
}

export async function changePassword(_oldPassword: string, _newPassword: string): Promise<void> {
  await delay();
}

export async function forgotPassword(_email: string): Promise<void> {
  await delay();
}
