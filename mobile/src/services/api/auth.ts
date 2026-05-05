import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types';
import apiClient from './client';
import { storage } from '@/services/storage';
import { STORAGE_KEYS } from '@/lib/constants';

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post('/auth/login', payload);
  const result = data.data ?? data;
  const token = result.tokens?.accessToken ?? result.token;
  if (token) {
    await storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }
  return {
    user: result.user,
    token,
  };
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  // Backend expects firstName/lastName; map from "name" if needed
  const raw = payload as RegisterPayload & { name?: string; firstName?: string; lastName?: string; inviteCode?: string }
  let firstName = raw.firstName
  let lastName = raw.lastName
  if ((!firstName || !lastName) && raw.name) {
    const parts = String(raw.name).trim().split(/\s+/)
    firstName = firstName || parts[0] || 'Kullanici'
    lastName = lastName || parts.slice(1).join(' ') || 'Hasta'
  }

  const body: Record<string, unknown> = {
    email: payload.email,
    password: payload.password,
    firstName: firstName || 'Kullanici',
    lastName: lastName || 'Hasta',
  }
  if (raw.inviteCode) body.inviteCode = raw.inviteCode

  const { data } = await apiClient.post('/auth/register/patient', body);
  const result = data.data ?? data;
  const token = result.tokens?.accessToken ?? result.token;
  if (token) {
    await storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }
  return {
    user: result.user,
    token,
  };
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get('/auth/me');
  return (data.data ?? data) as User;
}

export async function updateUser(userData: Partial<User>): Promise<User> {
  const { data } = await apiClient.put('/patients/me', userData);
  return (data.data ?? data) as User;
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await apiClient.post('/auth/change-password', { oldPassword, newPassword });
}

export async function forgotPassword(email: string): Promise<void> {
  // TODO: Backend forgot-password endpoint needed
  console.warn('forgotPassword not yet implemented on backend', email);
}
