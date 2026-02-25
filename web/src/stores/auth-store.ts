import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockUser, mockToken } from "@/mock";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "nutritionist" | "patient" | "admin";
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
  role: "nutritionist" | "patient";
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

      login: async (_credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));
          set({
            user: mockUser as User,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
          throw new Error("Login failed");
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      register: async (_data: RegisterData) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({
            user: mockUser as User,
            token: mockToken,
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
          // Simulate token validation
          await new Promise((resolve) => setTimeout(resolve, 500));
          set({
            user: mockUser as User,
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
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 600));
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, ...data, updatedAt: new Date().toISOString() },
              isLoading: false,
            });
          }
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
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
