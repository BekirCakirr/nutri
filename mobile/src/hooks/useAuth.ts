import { useCallback } from 'react';
import { useAuthStore } from '@/stores';

export function useAuth() {
  const store = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      await store.login(email, password);
    },
    [store.login],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await store.register(name, email, password);
    },
    [store.register],
  );

  const logout = useCallback(async () => {
    await store.logout();
  }, [store.logout]);

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isOnboarded: store.isOnboarded,
    isLoading: store.isLoading,
    login,
    register,
    logout,
    setOnboarded: store.setOnboarded,
    checkAuth: store.checkAuth,
  };
}
