import { create } from 'zustand';
import type { User } from '@/types';
import { createPersistMiddleware } from './persist';
import * as authApi from '@/services/api/auth';
import { storage } from '@/services/storage';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setOnboarded: (value: boolean) => void;
  checkAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>(
  createPersistMiddleware<AuthStore>('@nutriai/auth')((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isOnboarded: false,
    isLoading: false,

    login: async (email, password) => {
      set({ isLoading: true });
      try {
        const res = await authApi.login({ email, password });
        if (!res?.token) {
          throw new Error('No token returned');
        }
        await storage.set(STORAGE_KEYS.AUTH_TOKEN, res.token);
        // Fetch full profile (login response only has id/email/role/firstName)
        // so DashboardScreen can read first_name, daily_calorie_target, etc.
        let fullUser: User | null = res.user ?? null;
        try {
          const me = await authApi.getMe();
          if (me) fullUser = me as User;
        } catch {
          // Keep the lightweight user from login response if /auth/me fails
        }
        // Existing users skip onboarding (they already have a profile)
        await storage.set(STORAGE_KEYS.ONBOARDED, true);
        set({
          user: fullUser,
          token: res.token,
          isAuthenticated: true,
          isOnboarded: true,
          isLoading: false,
        });
      } catch (err: unknown) {
        set({ isLoading: false });
        const e = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
        const backendMsg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Giris basarisiz';
        throw new Error(backendMsg);
      }
    },

    register: async (name, email, password) => {
      set({ isLoading: true });
      try {
        const res = await authApi.register({ name, email, password });
        if (!res?.token) {
          throw new Error('No token returned');
        }
        await storage.set(STORAGE_KEYS.AUTH_TOKEN, res.token);
        // New users go through onboarding flow
        set({
          user: res.user ?? null,
          token: res.token,
          isAuthenticated: true,
          isOnboarded: false,
          isLoading: false,
        });
      } catch (err: unknown) {
        set({ isLoading: false });
        // Surface the real backend message so the UI can show useful context
        // (e.g. "Bu e-posta zaten kayitli", "Sifre cok kisa", validation errors).
        const e = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
        const backendMsg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Kayit basarisiz';
        throw new Error(backendMsg);
      }
    },

    logout: async () => {
      try {
        await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
        await storage.remove(STORAGE_KEYS.USER);
      } catch {
        // ignore storage errors during logout
      }
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isOnboarded: false,
        isLoading: false,
      });
    },

    setOnboarded: (value) => {
      set({ isOnboarded: value });
      storage.set(STORAGE_KEYS.ONBOARDED, value);
    },

    checkAuth: async () => {
      set({ isLoading: true });
      try {
        const token = await storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          const user = await authApi.getMe();
          // Token still valid — keep authenticated and assume onboarded (existing user)
          set({
            user: user ?? null,
            token,
            isAuthenticated: true,
            isOnboarded: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false, isAuthenticated: false });
        }
      } catch {
        // Token invalid or network failure — log the user out cleanly
        set({
          isAuthenticated: false,
          isOnboarded: false,
          token: null,
          user: null,
          isLoading: false,
        });
      }
    },
  })),
);
