import { useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginCredentials, RegisterData, ProfileUpdateData } from "@/stores/auth-store";

/**
 * Convenience wrapper around the auth store.
 * Provides the authenticated user, loading state, and auth actions.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const storeLogin = useAuthStore((s) => s.login);
  const storeLogout = useAuthStore((s) => s.logout);
  const storeRegister = useAuthStore((s) => s.register);
  const storeCheckAuth = useAuthStore((s) => s.checkAuth);
  const storeUpdateProfile = useAuthStore((s) => s.updateProfile);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      await storeLogin(credentials);
    },
    [storeLogin],
  );

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const register = useCallback(
    async (data: RegisterData) => {
      await storeRegister(data);
    },
    [storeRegister],
  );

  const checkAuth = useCallback(async () => {
    await storeCheckAuth();
  }, [storeCheckAuth]);

  const updateProfile = useCallback(
    async (data: ProfileUpdateData) => {
      await storeUpdateProfile(data);
    },
    [storeUpdateProfile],
  );

  const fullName = user ? `${user.firstName} ${user.lastName}` : null;
  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : null;

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    fullName,
    initials,
    login,
    logout,
    register,
    checkAuth,
    updateProfile,
  };
}
