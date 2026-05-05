import { useState, useMemo } from 'react'
import {
  Wifi,
  WifiOff,
  Droplets,
  UtensilsCrossed,
  AlertTriangle,
  Filter,
  Users,
  ShieldAlert,
  ShieldCheck,
  CircleDot,
  Activity,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageContainer } from '@/components/shared/page-container'
import { DashboardSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { StatCard } from '@/components/shared/stat-card'
import { cn } from '@/lib/utils'
import { useLiveTracking, type LiveTrackingEntry } from '@/hooks/use-live-tracking'

const mockTrackingData: LiveTrackingEntry[] = [
  {
    patientId: 'mock-lt1', patientName: 'Ayşe Yılmaz', avatar: '',
    currentCalories: 1450, targetCalories: 1800, mealsLogged: 3, totalMealsExpected: 4,
    lastActivity: 'Öğle yemeği', lastActivityAt: new Date(Date.now() - 45 * 60000).toISOString(),
    waterIntake: 6, waterTarget: 8, isOnline: true,
  },
  {
    patientId: 'mock-lt2', patientName: 'Mehmet Kaya', avatar: '',
    currentCalories: 2100, targetCalories: 2000, mealsLogged: 4, totalMealsExpected: 4,
    lastActivity: 'Ara öğün', lastActivityAt: new Date(Date.now() - 20 * 60000).toISOString(),
    waterIntake: 5, waterTarget: 10, isOnline: true,
  },
  {
    patientId: 'mock-lt3', patientName: 'Fatma Demir', avatar: '',
    currentCalories: 980, targetCalories: 1600, mealsLogged: 2, totalMealsExpected: 4,
    lastActivity: 'Kahvaltı', lastActivityAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    waterIntake: 3, waterTarget: 8, isOnline: false,
  },
  {
    patientId: 'mock-lt4', patientName: 'Zeynep Çelik', avatar: '',
    currentCalories: 0, targetCalories: 1700, mealsLogged: 0, totalMealsExpected: 4,
    lastActivity: '', lastActivityAt: '',
    waterIntake: 0, waterTarget: 8, isOnline: false,
  },
  {
    patientId: 'mock-lt5', patientName: 'Ali Öztürk', avatar: '',
    currentCalories: 1650, targetCalories: 2200, mealsLogged: 3, totalMealsExpected: 5,
    lastActivity: 'Akşam yemeği', lastActivityAt: new Date(Date.now() - 90 * 60000).toISOString(),
    waterIntake: 7, waterTarget: 8, isOnline: true,
  },
  {
    patientId: 'mock-lt6', patientName: 'Selin Aydın', avatar: '',
    currentCalories: 1200, targetCalories: 1500, mealsLogged: 3, totalMealsExpected: 4,
    lastActivity: 'Öğle yemeği', lastActivityAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    waterIntake: 4, waterTarget: 8, isOnline: true,
  },
]

// Derive alert level from tracking data
function deriveAlertLevel(entry: LiveTrackingEntry): { level: 'none' | 'low' | 'medium' | 'high'; reason?: string } {
  if (entry.currentCalories === 0 && entry.waterIntake === 0) {
    return { level: 'high', reason: 'Bugun hic kayıt yok' }
  }
  if (entry.targetCalories > 0 && entry.currentCalories > entry.targetCalories) {
    return { level: 'high', reason: 'Kalori hedefi asıldı' }
  }
  if (entry.waterTarget > 0 && entry.waterIntake < entry.waterTarget * 0.3) {
    return { level: 'medium', reason: 'Su tuketimi dusuk' }
  }
  if (entry.totalMealsExpected > 0 && entry.mealsLogged < entry.totalMealsExpected * 0.5) {
    return { level: 'low', reason: 'Ogun sayısı dusuk' }
  }
  return { level: 'none' }
}

const alertBorderMap = {
  none: '',
  low: 'ring-1 ring-amber-300/50',
  medium: 'ring-1 ring-orange-400/60',
  high: 'ring-2 ring-red-500/60',
}

const alertBadgeMap: Record<string, { label: string; variant: 'success' | 'warning' | 'destructive' } | null> = {
  none: null,
  low: { label: 'Dusuk', variant: 'warning' },
  medium: { label: 'Orta', variant: 'warning' },
  high: { label: 'Yuksek', variant: 'destructive' },
}

export default function LiveTrackingPage() {
  const [alertFilter, setAlertFilter] = useState('all')
  const { trackingData: apiTrackingData, isLoading, lastUpdated } = useLiveTracking(30_000)
  const safeApiData = Array.isArray(apiTrackingData) ? apiTrackingData : []
  const trackingData = safeApiData.length > 0 ? safeApiData : mockTrackingData
  const isConnected = lastUpdated !== null || safeApiData.length === 0

  // Enrich tracking entries with derived alert levels
  const enrichedPatients = useMemo(() =>
    trackingData.map((entry) => {
      const alert = deriveAlertLevel(entry)
      return {
        id: entry.patientId,
        name: entry.patientName,
        todayCalories: entry.currentCalories,
        calorieTarget: entry.targetCalories,
        waterIntakeMl: entry.waterIntake * 250, // glasses to ml (approx 250ml per glass)
        waterTargetMl: entry.waterTarget * 250,
        lastMealTime: entry.lastActivityAt ? new Date(entry.lastActivityAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-',
        lastMealType: entry.lastActivity || '-',
        alertLevel: alert.level,
        alertReason: alert.reason,
        isOnline: entry.isOnline,
      }
    }),
    [trackingData],
  )

  const filtered = enrichedPatients.filter((p) => {
    if (alertFilter === 'all') return true
    return p.alertLevel === alertFilter
  })

  const onlineCount = enrichedPatients.filter(p => p.isOnline).length
  const highAlertCount = enrichedPatients.filter(p => p.alertLevel === 'high').length
  const mediumAlertCount = enrichedPatients.filter(p => p.alertLevel === 'medium').length
  const okCount = enrichedPatients.filter(p => p.alertLevel === 'none').length

  if (isLoading) return <DashboardSkeleton />

  return (
    <PageContainer
      title="Canlı Takip"
      description="Hastalarınızın anlık beslenme durumunu izleyin."
      actions={
        <div className="flex items-center gap-3">
          {/* Connection indicator */}
          <div
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium',
              isConnected
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400',
            )}
          >
            {isConnected ? (
              <>
                <Wifi className="h-3.5 w-3.5" />
                Baglı
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5" />
                Baglantı kesildi
              </>
            )}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={alertFilter} onValueChange={setAlertFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Uyarı Seviyesi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tumu</SelectItem>
                <SelectItem value="high">Yuksek</SelectItem>
                <SelectItem value="medium">Orta</SelectItem>
                <SelectItem value="low">Dusuk</SelectItem>
                <SelectItem value="none">Uyarı Yok</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-in-stagger">
        <StatCard
          title="Cevrimici Hasta"
          value={onlineCount}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Yuksek Uyarı"
          value={highAlertCount}
          icon={ShieldAlert}
          color="red"
        />
        <StatCard
          title="Orta Uyarı"
          value={mediumAlertCount}
          icon={AlertTriangle}
          color="yellow"
        />
        <StatCard
          title="Sorunsuz"
          value={okCount}
          icon={ShieldCheck}
          color="green"
        />
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in-stagger">
        {filtered.map((patient) => {
          const caloriePercent = patient.calorieTarget > 0
            ? Math.min(Math.round((patient.todayCalories / patient.calorieTarget) * 100), 100)
            : 0
          const waterPercent = patient.waterTargetMl > 0
            ? Math.min(Math.round((patient.waterIntakeMl / patient.waterTargetMl) * 100), 100)
            : 0
          const alertBadge = alertBadgeMap[patient.alertLevel]
          const isOverCalorie = patient.todayCalories > patient.calorieTarget

          return (
            <Card
              key={patient.id}
              className={cn(
                'py-0 gap-0 transition-all duration-[var(--duration-fast)] hover:shadow-md cursor-pointer',
                alertBorderMap[patient.alertLevel],
              )}
            >
              <CardContent className="p-4 space-y-3">
                {/* Patient Info */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online/Offline indicator */}
                    <span
                      className={cn(
                        'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background',
                        patient.isOnline ? 'bg-emerald-500' : 'bg-gray-400',
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{patient.name}</p>
                      <CircleDot
                        className={cn(
                          'h-3 w-3 shrink-0',
                          patient.isOnline
                            ? 'text-emerald-500'
                            : 'text-muted-foreground/40',
                        )}
                      />
                    </div>
                    {alertBadge && (
                      <Badge variant={alertBadge.variant} className="mt-0.5 text-[10px] h-5">
                        <AlertTriangle className="h-3 w-3" />
                        {alertBadge.label}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Alert reason */}
                {patient.alertReason && (
                  <p className="text-xs text-destructive font-medium">
                    {patient.alertReason}
                  </p>
                )}

                {/* Calories progress */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground font-medium">Kalori</span>
                    <span className={cn('tabular-nums', isOverCalorie && 'text-red-500 font-semibold')}>
                      {patient.todayCalories} / {patient.calorieTarget} kcal
                    </span>
                  </div>
                  <Progress
                    value={caloriePercent}
                    className={cn('h-2', isOverCalorie && '[&>div]:bg-red-500')}
                  />
                </div>

                {/* Water progress */}
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 shrink-0 text-cyan-500" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground font-medium">Su</span>
                      <span className="tabular-nums">
                        {(patient.waterIntakeMl / 1000).toFixed(1)} / {(patient.waterTargetMl / 1000).toFixed(1)} L
                      </span>
                    </div>
                    <Progress value={waterPercent} className="h-1.5" />
                  </div>
                </div>

                {/* Last Meal */}
                <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-2.5 py-1.5">
                  <UtensilsCrossed className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    Son: {patient.lastMealType} - {patient.lastMealTime}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-up">
          <img
            src="https://picsum.photos/seed/tracking/600/400"
            alt="Canlı takip görseli"
            className="rounded-2xl shadow-md mb-6 max-w-md w-full opacity-90"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <EmptyState
            icon={Activity}
            title="Aktif hasta yok"
            description="Aktif hastaların gerçek zamanlı verileri burada görünecek."
          />
        </div>
      )}
    </PageContainer>
  )
}
