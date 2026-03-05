import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Database,
  AlertTriangle,
  BookOpen,
  Stethoscope,
  Users,
  BarChart3,
  Shield,
  LogOut,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { AppHeader } from '@/components/layout/app-header'
import { useAuthStore } from '@/stores/auth-store'

const adminNavItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { title: 'Besin Veritabanı', icon: Database, path: '/admin/food-db' },
  { title: 'Alerjenler', icon: AlertTriangle, path: '/admin/allergens' },
  { title: 'Tarifler', icon: BookOpen, path: '/admin/recipes' },
  { title: 'Diyetisyenler', icon: Stethoscope, path: '/admin/dietitians' },
  { title: 'Kullanıcılar', icon: Users, path: '/admin/users' },
  { title: 'Raporlar', icon: BarChart3, path: '/admin/reports' },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold tracking-tight">
              Nutri<span className="text-primary">AI</span>{' '}
              <span className="text-sm font-medium text-muted-foreground">Admin</span>
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3">
              Yönetim
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive(item.path)}
                      onClick={() => navigate(item.path)}
                      tooltip={item.title}
                      className="transition-colors duration-[var(--duration-fast)]"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate leading-tight">
                {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-[var(--duration-fast)]"
              title="Çıkış Yap"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto">
          <div className="animate-fade-up px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
