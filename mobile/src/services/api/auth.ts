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
  const { data } = await apiClient.post('/auth/register/patient', payload);
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
