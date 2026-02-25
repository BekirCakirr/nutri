import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  ClipboardList,
  Activity,
  MessageSquare,
  CalendarDays,
  Ticket,
  BookOpen,
  ShoppingCart,
  BarChart3,
  Star,
  Bot,
  Bell,
  Settings,
  Shield,
} from 'lucide-react'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth-store'

const mainNavItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'Hastalar', icon: Users, path: '/patients' },
  { title: 'Öğün İnceleme', icon: UtensilsCrossed, path: '/meal-review' },
  { title: 'Plan Oluşturucu', icon: ClipboardList, path: '/plans/create' },
  { title: 'Canlı Takip', icon: Activity, path: '/live-tracking' },
]

const communicationItems = [
  { title: 'Mesajlar', icon: MessageSquare, path: '/messages' },
  { title: 'Randevular', icon: CalendarDays, path: '/appointments' },
]

const featureItems = [
  { title: 'Davet Kodu', icon: Ticket, path: '/invite-code' },
  { title: 'Tarifler', icon: BookOpen, path: '/recipes' },
  { title: 'Alışveriş Listeleri', icon: ShoppingCart, path: '/shopping-lists' },
  { title: 'Raporlar', icon: BarChart3, path: '/reports' },
  { title: 'Değerlendirmeler', icon: Star, path: '/reviews' },
  { title: 'AI Asistan', icon: Bot, path: '/ai-assistant' },
]

const systemItems = [
  { title: 'Bildirimler', icon: Bell, path: '/notifications' },
  { title: 'Ayarlar', icon: Settings, path: '/settings' },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const userName = user ? `${user.firstName} ${user.lastName}` : 'Diyetisyen'
  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'DY'

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo-icon.png" alt="NutriAI" className="h-8 w-8" />
          <span className="text-xl font-bold">NutriAI</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Ana Menü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>İletişim</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communicationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Özellikler</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {featureItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistem</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive('/admin')}
                  onClick={() => navigate('/admin')}
                  tooltip="Admin Paneli"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Paneli</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
