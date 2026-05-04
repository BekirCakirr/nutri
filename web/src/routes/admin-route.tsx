import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export function AdminRoute() {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  // Avoid redirect flash while auth state is rehydrating from storage
  if (isLoading) return null

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
