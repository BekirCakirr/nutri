import { useState } from 'react'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/shared/page-container'
import { StatCard } from '@/components/shared/stat-card'
import { cn } from '@/lib/utils'

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

const mockStats = {
  totalUsers: 1_247,
  totalDietitians: 86,
  totalPatients: 1_143,
  activeSessions: 312,
}

const mockHealth: SystemHealth[] = [
  { name: 'API Sunucusu', status: 'operational', latency: '45ms', uptime: '%99.98' },
  { name: 'Veritabanı', status: 'operational', latency: '12ms', uptime: '%99.95' },
  { name: 'Depolama', status: 'degraded', latency: '320ms', uptime: '%98.70' },
]

const mockRegistrations: RecentRegistration[] = [
  { id: '1', name: 'Elif Arslan', email: 'elif.arslan@mail.com', role: 'patient', date: '5 dk önce' },
  { id: '2', name: 'Dr. Ahmet Yıldırım', email: 'ahmet.y@mail.com', role: 'dietitian', date: '12 dk önce' },
  { id: '3', name: 'Selin Korkmaz', email: 'selin.k@mail.com', role: 'patient', date: '28 dk önce' },
  { id: '4', name: 'Burak Şahin', email: 'burak.s@mail.com', role: 'patient', date: '1 saat önce' },
  { id: '5', name: 'Dr. Merve Öztürk', email: 'merve.oz@mail.com', role: 'dietitian', date: '2 saat önce' },
  { id: '6', name: 'Canan Demir', email: 'canan.d@mail.com', role: 'patient', date: '3 saat önce' },
]

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

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
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
          value={mockStats.totalUsers.toLocaleString('tr-TR')}
          icon={Users}
          color="blue"
          featured
        />
        <StatCard
          title="Diyetisyenler"
          value={mockStats.totalDietitians.toLocaleString('tr-TR')}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Hastalar"
          value={mockStats.totalPatients.toLocaleString('tr-TR')}
          icon={UserPlus}
          color="purple"
        />
        <StatCard
          title="Aktif Oturum"
          value={mockStats.activeSessions.toLocaleString('tr-TR')}
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
              {mockHealth.map((service) => {
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
              <Button variant="ghost" size="xs" className="text-muted-foreground">
                Tümünü Gör
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {mockRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/50"
                >
                  <Avatar className="h-9 w-9">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: UserPlus, label: 'Kullanıcı Ekle', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
              { icon: ShieldCheck, label: 'Diyetisyen Onayla', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
              { icon: FileText, label: 'Rapor Oluştur', color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30' },
              { icon: Settings, label: 'Sistem Ayarları', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2.5 transition-all hover:shadow-sm"
              >
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', action.color)}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
