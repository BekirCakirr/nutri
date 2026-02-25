import { useState } from 'react'
import {
  Users,
  UserCheck,
  UserPlus,
  Activity,
  Server,
  Database,
  HardDrive,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCcw,
  Settings,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

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

const statCards = [
  { title: 'Toplam Kullanıcı', value: mockStats.totalUsers, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { title: 'Diyetisyenler', value: mockStats.totalDietitians, icon: UserCheck, color: 'text-green-500', bgColor: 'bg-green-50' },
  { title: 'Hastalar', value: mockStats.totalPatients, icon: UserPlus, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  { title: 'Aktif Oturum', value: mockStats.activeSessions, icon: Activity, color: 'text-orange-500', bgColor: 'bg-orange-50' },
]

const statusConfig = {
  operational: { label: 'Aktif', icon: CheckCircle2, color: 'text-green-500', badge: 'default' as const },
  degraded: { label: 'Yavaş', icon: AlertTriangle, color: 'text-yellow-500', badge: 'secondary' as const },
  down: { label: 'Kapalı', icon: XCircle, color: 'text-red-500', badge: 'destructive' as const },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Yönetim Paneli</h1>
          <p className="text-muted-foreground">Sistem durumu ve genel istatistikler.</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value.toLocaleString('tr-TR')}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>Sistem Durumu</CardTitle>
            <CardDescription>Servis sağlık kontrolleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockHealth.map((service) => {
                const config = statusConfig[service.status]
                const ServiceIcon = healthIcons[service.name] ?? Server
                return (
                  <div key={service.name} className="flex items-center gap-3 p-3 rounded-lg border">
                    <ServiceIcon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">Çalışma süresi: {service.uptime} | {service.latency}</p>
                    </div>
                    <Badge variant={config.badge}>
                      <config.icon className={`mr-1 h-3 w-3 ${config.color}`} />
                      {config.label}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Son Kayıtlar</CardTitle>
                <CardDescription>Yeni kullanıcı kayıtları</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Tümünü Gör
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRegistrations.map((reg) => (
                <div key={reg.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {reg.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{reg.name}</p>
                    <p className="text-xs text-muted-foreground">{reg.email}</p>
                  </div>
                  <Badge variant={reg.role === 'dietitian' ? 'default' : 'secondary'}>
                    {reg.role === 'dietitian' ? 'Diyetisyen' : 'Hasta'}
                  </Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{reg.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
          <CardDescription>Sık kullanılan yönetim işlemleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <UserPlus className="h-5 w-5" />
              <span>Kullanıcı Ekle</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Diyetisyen Onayla</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <FileText className="h-5 w-5" />
              <span>Rapor Oluştur</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Settings className="h-5 w-5" />
              <span>Sistem Ayarları</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
