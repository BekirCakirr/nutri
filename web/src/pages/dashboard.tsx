import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  CalendarDays,
  UtensilsCrossed,
  AlertTriangle,
  ArrowRight,
  UserPlus,
  ClipboardList,
  Bot,
  Clock,
  MessageSquare,
  Activity,
  Utensils,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/shared/stat-card'
import { TrendSparkline } from '@/components/charts/trend-sparkline'
import { CalorieChart } from '@/components/charts/calorie-chart'
import { PatientActivityChart } from '@/components/charts/patient-activity-chart'
import { MacroPieChart } from '@/components/charts/macro-pie-chart'
import { useAuthStore } from '@/stores/auth-store'
import { usePatients } from '@/hooks/use-patients'
import { useAppointments } from '@/hooks/use-appointments'
import { cn } from '@/lib/utils'

interface RecentActivity {
  id: string
  type: 'meal' | 'appointment' | 'message' | 'alert'
  patient: string
  description: string
  time: string
}

// Activities and attention patients are derived from real data below

const activityIcons = {
  meal: Utensils,
  appointment: CalendarDays,
  message: MessageSquare,
  alert: AlertTriangle,
}

const activityColors = {
  meal: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  appointment: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
  message: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30',
  alert: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
}

const severityBorder = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-emerald-500',
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Günaydın'
  if (hour < 18) return 'İyi günler'
  return 'İyi akşamlar'
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { allPatients, fetchPatients } = usePatients()
  const { appointments, upcoming, fetchAppointments } = useAppointments()
  const [isLoading, setIsLoading] = useState(true)

  const greeting = useMemo(() => getGreeting(), [])
  const displayName = user ? `${user.firstName}` : 'Diyetisyen'

  useEffect(() => {
    fetchPatients()
    fetchAppointments()
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  // Derive dashboard data from real data
  const upcomingAppointments = useMemo(() =>
    upcoming.slice(0, 3).map((a: any) => ({
      id: a.id,
      patient: a.patientName ?? 'Hasta',
      time: a.startTime ?? '—',
      type: a.type === 'follow_up' ? 'Kontrol' : a.type === 'initial' ? 'İlk Görüşme' : 'Görüşme',
    }))
  , [upcoming])

  const attentionPatients = useMemo(() =>
    allPatients
      .filter((p: any) => (p.adherenceScore ?? 100) < 60)
      .slice(0, 3)
      .map((p: any) => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        reason: (p.adherenceScore ?? 0) < 30 ? 'Düşük plan uyumu' : 'Orta düzey plan uyumu',
        severity: ((p.adherenceScore ?? 0) < 30 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
      }))
  , [allPatients])

  const recentActivities: RecentActivity[] = useMemo(() => {
    // Derive from appointments as a simple activity feed
    return appointments.slice(0, 5).map((a: any, i: number) => ({
      id: a.id ?? String(i),
      type: 'appointment' as const,
      patient: a.patientName ?? 'Hasta',
      description: a.status === 'completed' ? 'Randevu tamamlandı' : 'Randevu planlandı',
      time: a.date ?? '',
    }))
  }, [appointments])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Greeting + Quick actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bugün {upcomingAppointments.length} randevunuz var. İşte günlük özetiniz.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/patients')}>
            <UserPlus className="h-3.5 w-3.5" />
            Yeni Hasta
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/meal-review')}>
            <ClipboardList className="h-3.5 w-3.5" />
            Öğün İncele
          </Button>
          <Button size="sm" onClick={() => navigate('/ai-assistant')}>
            <Bot className="h-3.5 w-3.5" />
            AI Asistan
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in-stagger">
        <StatCard
          title="Toplam Hasta"
          value={allPatients.length}
          icon={Users}
          color="blue"
          featured
          sparkline={<TrendSparkline data={[allPatients.length]} height={28} width={100} />}
        />
        <StatCard
          title="Bugünkü Randevu"
          value={upcomingAppointments.length}
          icon={CalendarDays}
          color="green"
        />
        <StatCard
          title="Toplam Randevu"
          value={appointments.length}
          icon={UtensilsCrossed}
          color="yellow"
        />
        <StatCard
          title="Dikkat Gerektiren"
          value={attentionPatients.length}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Upcoming appointments mini-bar */}
      <Card className="py-0 gap-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Sonraki Randevular</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5 transition-colors hover:bg-secondary/50 cursor-pointer"
                onClick={() => navigate('/appointments')}
              >
                <span className="text-sm font-semibold tabular-nums text-primary">{apt.time}</span>
                <div>
                  <p className="text-sm font-medium leading-tight">{apt.patient}</p>
                  <p className="text-xs text-muted-foreground">{apt.type}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CalorieChart className="lg:col-span-2" title="Haftalık Kalori Trend'i" />
        <MacroPieChart title="Ortalama Makro Dağılımı" />
      </div>

      {/* Activity chart + timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientActivityChart title="Hasta Aktivite Dağılımı" />

        {/* Recent activities timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Son Aktiviteler</CardTitle>
            <CardAction>
              <Button variant="ghost" size="xs" className="text-muted-foreground">
                Tümü
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivities.map((activity, index) => {
                const Icon = activityIcons[activity.type]
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/50"
                  >
                    {/* Timeline dot + line */}
                    <div className="flex flex-col items-center gap-1 pt-0.5">
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          activityColors[activity.type]
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      {index < recentActivities.length - 1 && (
                        <div className="w-px flex-1 bg-border min-h-[16px]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-medium leading-tight">{activity.patient}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap pt-1 tabular-nums">
                      {activity.time}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attention required patients */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base">Dikkat Gerektiren Hastalar</CardTitle>
          </div>
          <CardAction>
            <Button variant="ghost" size="xs" className="text-muted-foreground" onClick={() => navigate('/patients')}>
              Tüm Hastalar
              <ArrowRight className="h-3 w-3" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {attentionPatients.length > 0 ? (
            <div className="space-y-2">
              {attentionPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={cn(
                    'flex items-center gap-4 rounded-lg border border-l-4 px-4 py-3 transition-all hover:shadow-sm cursor-pointer',
                    severityBorder[patient.severity]
                  )}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {patient.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.reason}</p>
                  </div>
                  <Badge
                    variant={
                      patient.severity === 'high'
                        ? 'destructive'
                        : patient.severity === 'medium'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {patient.severity === 'high'
                      ? 'Yüksek'
                      : patient.severity === 'medium'
                        ? 'Orta'
                        : 'Düşük'}
                  </Badge>
                  <Button variant="ghost" size="icon-xs">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                <Activity className="h-6 w-6 text-emerald-500" />
              </div>
              <p className="text-sm font-medium">Tüm hastalar yolunda!</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Dikkat gerektiren hasta bulunmuyor.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
