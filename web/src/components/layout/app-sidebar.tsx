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
  LogOut,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/auth-store'
import { useNotificationStore } from '@/stores/notification-store'
import { useMessageStore } from '@/stores/message-store'

const mainNavItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'Hastalar', icon: Users, path: '/patients' },
  { title: 'Öğün İnceleme', icon: UtensilsCrossed, path: '/meal-review' },
  { title: 'Plan Oluşturucu', icon: ClipboardList, path: '/plans/create' },
  { title: 'Canlı Takip', icon: Activity, path: '/live-tracking' },
]

const communicationItems = [
  { title: 'Mesajlar', icon: MessageSquare, path: '/messages', badgeKey: 'messages' as const },
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
  { title: 'Bildirimler', icon: Bell, path: '/notifications', badgeKey: 'notifications' as const },
  { title: 'Ayarlar', icon: Settings, path: '/settings' },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const unreadNotifications = useNotificationStore((s) => s.unreadCount)
  const conversations = useMessageStore((s) => s.conversations)
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const getBadgeCount = (key?: 'messages' | 'notifications') => {
    if (key === 'messages') return unreadMessages
    if (key === 'notifications') return unreadNotifications
    return 0
  }

  const userName = user ? `${user.firstName} ${user.lastName}` : 'Diyetisyen'
  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
    : 'DY'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const renderNavItems = (items: typeof mainNavItems & { badgeKey?: 'messages' | 'notifications' }[]) =>
    items.map((item) => {
      const badge = getBadgeCount((item as { badgeKey?: 'messages' | 'notifications' }).badgeKey)
      return (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            isActive={isActive(item.path)}
            onClick={() => navigate(item.path)}
            tooltip={item.title}
            className="relative group/nav-item transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quart)]"
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1">{item.title}</span>
            {badge > 0 && (
              <Badge
                variant="default"
                className="ml-auto h-5 min-w-5 px-1.5 text-[10px] font-semibold"
              >
                {badge > 99 ? '99+' : badge}
              </Badge>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })

  return (
    <Sidebar>
      {/* Brand header */}
      <SidebarHeader className="border-b border-sidebar-border px-5 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <img src="/logo-icon.png" alt="NutriAI" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight">
            Nutri<span className="text-primary">AI</span>
          </span>
        </button>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3">
            Ana Menü
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(mainNavItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Communication */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3">
            İletişim
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(communicationItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Features */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3">
            Özellikler
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(featureItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3">
            Sistem
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderNavItems(systemItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <Avatar className="h-8 w-8 ring-2 ring-primary/10">
            {user?.avatar && <AvatarImage src={user.avatar} alt={userName} />}
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate leading-tight">{userName}</p>
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
  )
}
