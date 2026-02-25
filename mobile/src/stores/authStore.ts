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
        await storage.set(STORAGE_KEYS.AUTH_TOKEN, res.token);
        set({
          user: res.user,
          token: res.token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        set({ isLoading: false });
        throw new Error('Giri\u015f ba\u015far\u0131s\u0131z');
      }
    },

    register: async (name, email, password) => {
      set({ isLoading: true });
      try {
        const res = await authApi.register({ name, email, password });
        await storage.set(STORAGE_KEYS.AUTH_TOKEN, res.token);
        set({
          user: res.user,
          token: res.token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        set({ isLoading: false });
        throw new Error('Kay\u0131t ba\u015far\u0131s\u0131z');
      }
    },

    logout: async () => {
      await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      await storage.remove(STORAGE_KEYS.USER);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
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
          set({ user, token, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      } catch {
        set({ isAuthenticated: false, token: null, user: null, isLoading: false });
      }
    },
  })),
);
