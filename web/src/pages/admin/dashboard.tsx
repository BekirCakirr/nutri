import { useState, useEffect, useCallback } from 'react'
import { avatarFor } from '@/lib/avatar'
import { Link } from 'react-router-dom'
import {
  Users,
  UserCheck,
  UserPlus,
  Activity,
  Server,
  Database,
  HardDrive,
  ArrowRight,
  RefreshCcw,
  Settings,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PageContainer } from '@/components/shared/page-container'
import { DashboardSkeleton } from '@/components/shared/page-skeletons'
import { StatCard } from '@/components/shared/stat-card'
import { cn } from '@/lib/utils'
import {
  getStats as fetchAdminStats,
  getSystemHealth as fetchSystemHealth,
  getUsers as fetchAdminUsers,
  type AdminStats,
  type AdminUser,
} from '@/services/admin.service'
import type { SystemHealth as ApiSystemHealth } from '@/services/admin.service'

interface SystemHealth {
  name: string
  status: 'operational' | 'degraded' | 'down'
  latency: string
  uptime: string
}

interface RecentRegistration {
  id: string
  name: string
  email: string
  role: 'patient' | 'dietitian'
  date: string
}



/** Convert API AdminUser to local RecentRegistration format */
function toRecentRegistration(user: AdminUser): RecentRegistration {
  const role = user.role === 'dietitian' ? 'dietitian' : 'patient'
  const createdDate = new Date(user.createdAt)
  const now = new Date()
  const diffMs = now.getTime() - createdDate.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  let dateStr: string
  if (diffMin < 1) dateStr = 'az önce'
  else if (diffMin < 60) dateStr = `${diffMin} dk önce`
  else if (diffMin < 1440) dateStr = `${Math.floor(diffMin / 60)} saat önce`
  else dateStr = `${Math.floor(diffMin / 1440)} gün önce`

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
  return { id: user.id, name, email: user.email, role, date: dateStr }
}

/** Convert API SystemHealth to local SystemHealth format */
function toLocalHealth(apiHealth: ApiSystemHealth): SystemHealth[] {
  const dbStatus: SystemHealth['status'] =
    apiHealth.database.status === 'connected' ? 'operational' : 'down'
  const apiStatus: SystemHealth['status'] =
    apiHealth.status === 'ok' ? 'operational' : 'degraded'

  return [
    {
      name: 'API Sunucusu',
      status: apiStatus,
      latency: '-',
      uptime: `${Math.floor(apiHealth.uptime / 3600)} saat`,
    },
    {
      name: 'Veritabanı',
      status: dbStatus,
      latency: `${apiHealth.database.latencyMs}ms`,
      uptime: '-',
    },
  ]
}

const statusConfig = {
  operational: { label: 'Aktif', icon: CheckCircle2, badge: 'success' as const },
  degraded: { label: 'Yavaş', icon: AlertTriangle, badge: 'warning' as const },
  down: { label: 'Kapalı', icon: XCircle, badge: 'destructive' as const },
}

const healthIcons: Record<string, typeof Server> = {
  'API Sunucusu': Server,
  'Veritabanı': Database,
  'Depolama': HardDrive,
}

export default function AdminDashboardPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDietitians: 0,
    totalPatients: 0,
    activeSessions: 0,
  })
  const [health, setHealth] = useState<SystemHealth[]>([])
  const [registrations, setRegistrations] = useState<RecentRegistration[]>([])

  const loadData = useCallback(async () => {
    const results = await Promise.allSettled([
      fetchAdminStats(),
      fetchSystemHealth(),
      fetchAdminUsers({ page: 1, limit: 6 }),
    ])

    // Stats
    if (results[0].status === 'fulfilled') {
      const s = results[0].value as AdminStats
      setStats({
        totalUsers: s.totalUsers,
        totalDietitians: s.totalDietitians,
        totalPatients: s.totalPatients,
        activeSessions: s.activePatients,
      })
    }

    // Health
    if (results[1].status === 'fulfilled') {
      const h = results[1].value as ApiSystemHealth
      setHealth(toLocalHealth(h))
    }

    // Recent registrations
    if (results[2].status === 'fulfilled') {
      const resp = results[2].value
      if (resp.items.length > 0) {
        setRegistrations(
          resp.items
            .filter((u: AdminUser) => u.role !== 'admin')
            .slice(0, 6)
            .map(toRecentRegistration)
        )
      }
    }
  }, [])

  useEffect(() => {
    loadData().finally(() => setIsLoading(false))
  }, [loadData])

  if (isLoading) return <DashboardSkeleton />

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData().catch(() => {})
    setRefreshing(false)
  }

  return (
    <PageContainer
      title="Yönetim Paneli"
      description="Sistem durumu ve genel istatistikler."
      actions={
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCcw className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')} />
          Yenile
        </Button>
      }
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-in-stagger">
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers.toLocaleString('tr-TR')}
          icon={Users}
          color="blue"
          featured
        />
        <StatCard
          title="Diyetisyenler"
          value={stats.totalDietitians.toLocaleString('tr-TR')}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Hastalar"
          value={stats.totalPatients.toLocaleString('tr-TR')}
          icon={UserPlus}
          color="purple"
        />
        <StatCard
          title="Aktif Oturum"
          value={stats.activeSessions.toLocaleString('tr-TR')}
          icon={Activity}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* System Health */}
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle className="text-base">Sistem Durumu</CardTitle>
            <CardDescription>Servis sağlık kontrolleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {health.map((service) => {
                const config = statusConfig[service.status]
                const ServiceIcon = healthIcons[service.name] ?? Server
                return (
                  <div
                    key={service.name}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <ServiceIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{service.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Çalışma: {service.uptime} | {service.latency}
                      </p>
                    </div>
                    <Badge variant={config.badge}>
                      <config.icon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card className="lg:col-span-2 animate-fade-up">
          <CardHeader>
            <div>
              <CardTitle className="text-base">Son Kayıtlar</CardTitle>
              <CardDescription>Yeni kullanıcı kayıtları</CardDescription>
            </div>
            <CardAction>
              <Button asChild variant="ghost" size="xs" className="text-muted-foreground">
                <Link to="/admin/users">
                  Tümünü Gör
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {registrations.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">Henüz yeni kayıt yok.</p>
              )}
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/50"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarFor(`${reg.name} ${reg.email}`, 80)} alt={reg.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {reg.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{reg.name}</p>
                    <p className="text-xs text-muted-foreground">{reg.email}</p>
                  </div>
                  <Badge variant={reg.role === 'dietitian' ? 'info' : 'secondary'}>
                    {reg.role === 'dietitian' ? 'Diyetisyen' : 'Hasta'}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap tabular-nums">
                    {reg.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle className="text-base">Hızlı İşlemler</CardTitle>
          <CardDescription>Sık kullanılan yönetim işlemleri</CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: UserPlus, label: 'Kullanıcı Ekle', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
                { icon: ShieldCheck, label: 'Diyetisyen Onayla', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
                { icon: FileText, label: 'Rapor Oluştur', color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30' },
                { icon: Settings, label: 'Sistem Ayarları', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
              ].map((action) => (
                <Tooltip key={action.label}>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="cursor-not-allowed">
                      <Button
                        variant="outline"
                        disabled
                        className="h-auto w-full py-4 flex flex-col gap-2.5 transition-all hover:shadow-sm pointer-events-none"
                      >
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', action.color)}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">{action.label}</span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Yakında</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
