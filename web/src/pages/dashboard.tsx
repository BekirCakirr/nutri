import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { getNotifications } from '@/services/notification.service'
import { cn } from '@/lib/utils'

// Generate a deterministic avatar URL for a patient (presentation visuals)
const avatarUrl = (seed: string) =>
  `https://i.pravatar.cc/150?u=${encodeURIComponent(seed || 'patient')}`

interface RecentActivity {
  id: string
  type: 'meal' | 'appointment' | 'message' | 'alert'
  patient: string
  description: string
  time: string
}

// Map backend notification types to activity feed icon types
function mapNotificationType(t: string): RecentActivity['type'] {
  if (t === 'meal_review' || t === 'meal') return 'meal'
  if (t === 'appointment') return 'appointment'
  if (t === 'message') return 'message'
  return 'alert'
}

// Format an ISO timestamp to "HH:mm" (Turkish locale)
function fmtTime(iso: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

// Extract a patient name from notification body, e.g. "Ayse Yilmaz kahvalti..."
function extractPatientName(body: string): string {
  if (!body) return ''
  const match = body.match(/^([A-ZÇĞİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+)+)/)
  return match ? match[1] : ''
}

// ---------------------------------------------------------------------------
// Mock / fallback data – used when API returns empty results
// ---------------------------------------------------------------------------

const MOCK_PATIENTS = [
  {
    id: 'mock-p1',
    firstName: 'Ayşe',
    lastName: 'Yılmaz',
    email: 'ayse.yilmaz@email.com',
    status: 'active' as const,
    adherenceScore: 92,
    lastVisit: '2026-04-14',
    nextAppointment: '2026-04-18',
  },
  {
    id: 'mock-p2',
    firstName: 'Mehmet',
    lastName: 'Kaya',
    email: 'mehmet.kaya@email.com',
    status: 'active' as const,
    adherenceScore: 45,
    lastVisit: '2026-04-10',
    nextAppointment: '2026-04-17',
  },
  {
    id: 'mock-p3',
    firstName: 'Fatma',
    lastName: 'Demir',
    email: 'fatma.demir@email.com',
    status: 'active' as const,
    adherenceScore: 25,
    lastVisit: '2026-04-08',
    nextAppointment: null,
  },
  {
    id: 'mock-p4',
    firstName: 'Zeynep',
    lastName: 'Çelik',
    email: 'zeynep.celik@email.com',
    status: 'active' as const,
    adherenceScore: 78,
    lastVisit: '2026-04-12',
    nextAppointment: '2026-04-20',
  },
  {
    id: 'mock-p5',
    firstName: 'Ali',
    lastName: 'Öztürk',
    email: 'ali.ozturk@email.com',
    status: 'inactive' as const,
    adherenceScore: 55,
    lastVisit: '2026-03-28',
    nextAppointment: null,
  },
  {
    id: 'mock-p6',
    firstName: 'Elif',
    lastName: 'Arslan',
    email: 'elif.arslan@email.com',
    status: 'pending' as const,
    adherenceScore: 100,
    lastVisit: '2026-04-15',
    nextAppointment: '2026-04-22',
  },
]

const MOCK_APPOINTMENTS = [
  {
    id: 'mock-a1',
    patientId: 'mock-p1',
    patientName: 'Ayşe Yılmaz',
    title: 'Kontrol Randevusu',
    type: 'follow_up' as const,
    status: 'scheduled' as const,
    date: '2026-04-16',
    startTime: '09:30',
    endTime: '10:00',
    duration: 30,
    notes: '',
    location: 'Klinik',
    meetingUrl: null,
    nutritionistId: '',
    createdAt: '2026-04-10',
  },
  {
    id: 'mock-a2',
    patientId: 'mock-p2',
    patientName: 'Mehmet Kaya',
    title: 'Diyet Plan Değerlendirme',
    type: 'follow_up' as const,
    status: 'scheduled' as const,
    date: '2026-04-16',
    startTime: '11:00',
    endTime: '11:30',
    duration: 30,
    notes: 'Kilo takip',
    location: 'Online',
    meetingUrl: 'https://meet.example.com/abc',
    nutritionistId: '',
    createdAt: '2026-04-11',
  },
  {
    id: 'mock-a3',
    patientId: 'mock-p4',
    patientName: 'Zeynep Çelik',
    title: 'İlk Görüşme',
    type: 'initial' as const,
    status: 'scheduled' as const,
    date: '2026-04-16',
    startTime: '14:00',
    endTime: '15:00',
    duration: 60,
    notes: 'Yeni hasta kaydı',
    location: 'Klinik',
    meetingUrl: null,
    nutritionistId: '',
    createdAt: '2026-04-12',
  },
  {
    id: 'mock-a4',
    patientId: 'mock-p3',
    patientName: 'Fatma Demir',
    title: 'Beslenme Değerlendirme',
    type: 'assessment' as const,
    status: 'completed' as const,
    date: '2026-04-14',
    startTime: '10:00',
    endTime: '10:45',
    duration: 45,
    notes: 'Detaylı beslenme analizi',
    location: 'Klinik',
    meetingUrl: null,
    nutritionistId: '',
    createdAt: '2026-04-08',
  },
  {
    id: 'mock-a5',
    patientId: 'mock-p1',
    patientName: 'Ayşe Yılmaz',
    title: 'Kontrol',
    type: 'follow_up' as const,
    status: 'completed' as const,
    date: '2026-04-12',
    startTime: '09:00',
    endTime: '09:30',
    duration: 30,
    notes: '',
    location: 'Online',
    meetingUrl: null,
    nutritionistId: '',
    createdAt: '2026-04-06',
  },
]

const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 'mock-act1',
    type: 'meal',
    patient: 'Ayşe Yılmaz',
    description: 'Öğün fotoğrafı yüklendi — Kahvaltı (420 kcal)',
    time: '08:45',
  },
  {
    id: 'mock-act2',
    type: 'appointment',
    patient: 'Mehmet Kaya',
    description: 'Kontrol randevusu onaylandı',
    time: '09:12',
  },
  {
    id: 'mock-act3',
    type: 'alert',
    patient: 'Fatma Demir',
    description: '3 gündür öğün kaydı girilmedi',
    time: '10:30',
  },
  {
    id: 'mock-act4',
    type: 'message',
    patient: 'Zeynep Çelik',
    description: 'Yeni mesaj: "Diyet listesi hakkında sorum var"',
    time: '11:05',
  },
  {
    id: 'mock-act5',
    type: 'meal',
    patient: 'Mehmet Kaya',
    description: 'Öğle yemeği kaydedildi — 650 kcal',
    time: '13:20',
  },
]

// ---------------------------------------------------------------------------

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
  const { appointments, upcoming, fetchAppointments, error: appointmentsError } = useAppointments()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const greeting = useMemo(() => getGreeting(), [])
  const displayName = user ? `${user.firstName}` : 'Diyetisyen'

  useEffect(() => {
    const load = async () => {
      try {
        const results = await Promise.allSettled([
          fetchPatients(),
          fetchAppointments(),
          getNotifications().catch(() => []),
        ])
        const notifResult = results[2]
        if (notifResult.status === 'fulfilled') {
          const raw = notifResult.value as any
          // Backend returns array directly after axios envelope unwrap
          const list = Array.isArray(raw) ? raw : raw?.notifications ?? []
          setNotifications(list)
        }
      } catch {}
      setIsLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (appointmentsError) toast.error(appointmentsError)
  }, [appointmentsError])

  // Use real data when available, otherwise fall back to mocks
  const safePatients = Array.isArray(allPatients) ? allPatients : []
  const safeAppointments = Array.isArray(appointments) ? appointments : []
  const safeUpcoming = Array.isArray(upcoming) ? upcoming : []
  const effectivePatients = safePatients.length > 0 ? safePatients : MOCK_PATIENTS as any[]
  const effectiveAppointments = safeAppointments.length > 0 ? safeAppointments : MOCK_APPOINTMENTS as any[]
  const effectiveUpcoming = safeUpcoming.length > 0
    ? safeUpcoming
    : MOCK_APPOINTMENTS.filter((a) => a.status === 'scheduled') as any[]

  // Derive dashboard data from real data (with mock fallback)
  const upcomingAppointments = useMemo(() =>
    effectiveUpcoming.slice(0, 3).map((a: any) => {
      // Backend format: appointment_date + start_time, patient_first_name + patient_last_name
      const firstName = a.patientFirstName ?? a.patientName?.split(' ')?.[0] ?? ''
      const lastName = a.patientLastName ?? a.patientName?.split(' ')?.slice(1).join(' ') ?? ''
      const fullName = a.patientName ?? `${firstName} ${lastName}`.trim() ?? 'Hasta'
      const startTime = a.startTime ?? a.start_time ?? '—'
      // Strip seconds if backend returns "HH:MM:SS"
      const time = typeof startTime === 'string' ? startTime.slice(0, 5) : startTime
      return {
        id: a.id,
        patient: fullName,
        avatar: avatarUrl(a.patientEmail || fullName),
        time,
        type: a.type === 'follow_up' ? 'Kontrol' : a.type === 'initial' ? 'İlk Görüşme' : a.type === 'online' ? 'Online' : 'Görüşme',
      }
    })
  , [effectiveUpcoming])

  const attentionPatients = useMemo(() =>
    effectivePatients
      .filter((p: any) => (p.adherenceScore ?? 100) < 60)
      .slice(0, 3)
      .map((p: any) => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        avatar: p.avatar || p.profilePhotoUrl || avatarUrl(p.email || `${p.firstName}${p.lastName}`),
        reason: (p.adherenceScore ?? 0) < 30 ? 'Düşük plan uyumu' : 'Orta düzey plan uyumu',
        severity: ((p.adherenceScore ?? 0) < 30 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
      }))
  , [effectivePatients])

  const recentActivities: RecentActivity[] = useMemo(() => {
    // Prefer real notifications when available — richer content per type
    if (Array.isArray(notifications) && notifications.length > 0) {
      return notifications.slice(0, 5).map((n: any, i: number) => ({
        id: n.id ?? String(i),
        type: mapNotificationType(n.type),
        patient: extractPatientName(n.body) || n.title || 'Bildirim',
        description: n.body || n.title || '',
        time: fmtTime(n.createdAt),
      }))
    }
    // Fallback to appointment-derived feed
    if (Array.isArray(appointments) && appointments.length > 0) {
      return appointments.slice(0, 5).map((a: any, i: number) => ({
        id: a.id ?? String(i),
        type: 'appointment' as const,
        patient: a.patientName ?? 'Hasta',
        description: a.status === 'completed' ? 'Randevu tamamlandı' : 'Randevu planlandı',
        time: a.date ?? '',
      }))
    }
    // Final mock fallback
    return MOCK_RECENT_ACTIVITIES
  }, [notifications, appointments])

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
          value={effectivePatients.length}
          icon={Users}
          color="blue"
          featured
          sparkline={<TrendSparkline data={[effectivePatients.length]} height={28} width={100} />}
        />
        <StatCard
          title="Bugünkü Randevu"
          value={upcomingAppointments.length}
          icon={CalendarDays}
          color="green"
        />
        <StatCard
          title="Toplam Randevu"
          value={effectiveAppointments.length}
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
            {upcomingAppointments.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">Bugün planlanmış randevu bulunmuyor.</p>
            )}
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5 transition-colors hover:bg-secondary/50 cursor-pointer"
                onClick={() => navigate('/appointments')}
              >
                <span className="text-sm font-semibold tabular-nums text-primary">{apt.time}</span>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={apt.avatar} alt={apt.patient} />
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                    {apt.patient.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
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
                    <AvatarImage src={patient.avatar} alt={patient.name} />
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
