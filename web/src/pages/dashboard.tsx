import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  CalendarDays,
  UtensilsCrossed,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  pendingMealReviews: number
  criticalAlerts: number
}

interface RecentActivity {
  id: string
  type: 'meal' | 'appointment' | 'message' | 'alert'
  patient: string
  description: string
  time: string
}

const mockStats: DashboardStats = {
  totalPatients: 47,
  todayAppointments: 6,
  pendingMealReviews: 12,
  criticalAlerts: 3,
}

const mockActivities: RecentActivity[] = [
  { id: '1', type: 'meal', patient: 'Ayşe Yılmaz', description: 'Öğle yemeği kaydetti', time: '5 dk önce' },
  { id: '2', type: 'appointment', patient: 'Mehmet Kaya', description: 'Randevu talep etti', time: '15 dk önce' },
  { id: '3', type: 'alert', patient: 'Fatma Demir', description: 'Kalori hedefini %40 aştı', time: '1 saat önce' },
  { id: '4', type: 'message', patient: 'Ali Öztürk', description: 'Yeni mesaj gönderdi', time: '2 saat önce' },
  { id: '5', type: 'meal', patient: 'Zeynep Çelik', description: 'Kahvaltı kaydetti', time: '3 saat önce' },
]

const mockAttentionPatients = [
  { id: '1', name: 'Fatma Demir', reason: 'Kalori hedefi aşımı', severity: 'high' as const },
  { id: '2', name: 'Hasan Yıldız', reason: '3 gündür öğün kaydı yok', severity: 'medium' as const },
  { id: '3', name: 'Elif Arslan', reason: 'Su tüketimi düşük', severity: 'low' as const },
]

const statCards = [
  { title: 'Toplam Hasta', value: mockStats.totalPatients, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { title: "Bugünkü Randevu", value: mockStats.todayAppointments, icon: CalendarDays, color: 'text-green-500', bgColor: 'bg-green-50' },
  { title: 'Bekleyen Öğün', value: mockStats.pendingMealReviews, icon: UtensilsCrossed, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { title: 'Kritik Uyarı', value: mockStats.criticalAlerts, icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-50' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Hoş geldiniz! İşte bugünkü genel bakış.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Son Aktiviteler</CardTitle>
                <CardDescription>Hastalarınızın son etkinlikleri</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {activity.patient.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.patient}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attention Required */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dikkat Gerektiren Hastalar</CardTitle>
                <CardDescription>Acil takip gerektiren durumlar</CardDescription>
              </div>
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAttentionPatients.map((patient) => (
                <div key={patient.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.reason}</p>
                  </div>
                  <Badge
                    variant={patient.severity === 'high' ? 'destructive' : patient.severity === 'medium' ? 'default' : 'secondary'}
                  >
                    {patient.severity === 'high' ? 'Yüksek' : patient.severity === 'medium' ? 'Orta' : 'Düşük'}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/patients/${patient.id}`)}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
