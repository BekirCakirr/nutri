import { useNavigate } from 'react-router-dom'
import { Bell, Moon, Sun, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { useUiStore } from '@/stores/ui-store'
import { useNotificationStore } from '@/stores/notification-store'
import { Breadcrumbs } from './breadcrumbs'

export function AppHeader() {
  const navigate = useNavigate()
  const { theme, setTheme } = useUiStore()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const notifications = useNotificationStore((s) => s.notifications)

  const recentUnread = notifications
    .filter((n) => !n.read)
    .slice(0, 3)

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-10">
      <SidebarTrigger className="shrink-0" />
      <Separator orientation="vertical" className="h-5" />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <div className="flex-1" />

      {/* Search trigger */}
      <Button
        variant="outline"
        size="sm"
        className="hidden md:inline-flex gap-2 text-muted-foreground font-normal h-8 px-3 w-56 justify-start"
        onClick={() => {
          // cmdk integration point
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
        }}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-xs">Hızlı arama...</span>
        <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </Button>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="text-muted-foreground hover:text-foreground"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      {/* Notifications dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm font-semibold">Bildirimler</p>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {unreadCount} yeni
              </Badge>
            )}
          </div>
          <DropdownMenuSeparator />
          {recentUnread.length > 0 ? (
            recentUnread.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex flex-col items-start gap-1 px-3 py-2.5 cursor-pointer"
                onClick={() => n.actionUrl && navigate(n.actionUrl)}
              >
                <p className="text-sm font-medium leading-tight">{n.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              Yeni bildirim yok
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="justify-center text-sm font-medium text-primary cursor-pointer"
            onClick={() => navigate('/notifications')}
          >
            Tümünü Gör
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
