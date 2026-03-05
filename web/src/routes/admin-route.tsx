import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export function AdminRoute() {
  const user = useAuthStore((s) => s.user)

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
