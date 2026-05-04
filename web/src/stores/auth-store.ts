import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getProfile,
  updateProfile as updateProfileApi,
} from "@/services/auth.service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "dietitian" | "nutritionist" | "patient" | "admin";
  avatar: string;
  phone?: string;
  bio?: string;
  specializations?: string[];
  licenseNumber?: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "dietitian" | "nutritionist" | "patient";
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  specializations?: string[];
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const result = await loginApi(credentials);
          const token = result.accessToken;
          // Sync token to localStorage for axios interceptor
          if (token) localStorage.setItem("accessToken", token);
          set({
            user: result.user as unknown as User,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
          throw new Error("Login failed");
        }
      },

      logout: () => {
        logoutApi();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const result = await registerApi(data as unknown as Parameters<typeof registerApi>[0]);
          set({
            user: result.user as unknown as User,
            token: result.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
          throw new Error("Registration failed");
        }
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        set({ isLoading: true });
        try {
          const user = await getProfile();
          set({
            user: user as unknown as User,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateProfile: async (data: ProfileUpdateData) => {
        set({ isLoading: true });
        try {
          const updated = await updateProfileApi(data as unknown as Parameters<typeof updateProfileApi>[0]);
          set({
            user: updated as unknown as User,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
          throw new Error("Profile update failed");
        }
      },
    }),
    {
      name: "nutriai-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      // After rehydration, derive isAuthenticated from token presence
      // (avoids stale "isAuthenticated: true" with no/invalid token)
      onRehydrateStorage: () => (state) => {
        if (state) {
          const hasValidToken =
            !!state.token && !!localStorage.getItem("accessToken");
          state.isAuthenticated = hasValidToken;
          if (!hasValidToken) {
            state.user = null;
            state.token = null;
          }
        }
      },
    },
  ),
);
