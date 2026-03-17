import { useState, useEffect } from 'react'
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

interface LivePatient {
  id: string
  name: string
  todayCalories: number
  calorieTarget: number
  waterIntakeMl: number
  waterTargetMl: number
  lastMealTime: string
  lastMealType: string
  alertLevel: 'none' | 'low' | 'medium' | 'high'
  alertReason?: string
  isOnline: boolean
}

const mockLivePatients: LivePatient[] = [
  { id: '1', name: 'Ayse Yılmaz', todayCalories: 1450, calorieTarget: 1800, waterIntakeMl: 1800, waterTargetMl: 2500, lastMealTime: '12:30', lastMealType: 'Ogle', alertLevel: 'none', isOnline: true },
  { id: '2', name: 'Mehmet Kaya', todayCalories: 2100, calorieTarget: 1600, waterIntakeMl: 1200, waterTargetMl: 2000, lastMealTime: '13:15', lastMealType: 'Ogle', alertLevel: 'high', alertReason: 'Kalori hedefi asıldı', isOnline: true },
  { id: '3', name: 'Fatma Demir', todayCalories: 1200, calorieTarget: 2200, waterIntakeMl: 2000, waterTargetMl: 2500, lastMealTime: '11:00', lastMealType: 'Ara Ogun', alertLevel: 'none', isOnline: true },
  { id: '4', name: 'Ali Ozturk', todayCalories: 800, calorieTarget: 1800, waterIntakeMl: 500, waterTargetMl: 2000, lastMealTime: '08:30', lastMealType: 'Kahvaltı', alertLevel: 'medium', alertReason: 'Su tuketimi dusuk', isOnline: false },
  { id: '5', name: 'Zeynep Celik', todayCalories: 1600, calorieTarget: 1700, waterIntakeMl: 2200, waterTargetMl: 2500, lastMealTime: '14:00', lastMealType: 'Ogle', alertLevel: 'none', isOnline: true },
  { id: '6', name: 'Hasan Yıldız', todayCalories: 0, calorieTarget: 2000, waterIntakeMl: 0, waterTargetMl: 2500, lastMealTime: '-', lastMealType: '-', alertLevel: 'high', alertReason: 'Bugun hic kayıt yok', isOnline: false },
  { id: '7', name: 'Elif Arslan', todayCalories: 1900, calorieTarget: 2000, waterIntakeMl: 1800, waterTargetMl: 2000, lastMealTime: '13:45', lastMealType: 'Ogle', alertLevel: 'none', isOnline: true },
  { id: '8', name: 'Burak Sahin', todayCalories: 1100, calorieTarget: 2400, waterIntakeMl: 800, waterTargetMl: 3000, lastMealTime: '10:00', lastMealType: 'Kahvaltı', alertLevel: 'low', alertReason: 'Ogle yemegi atlanmıs olabilir', isOnline: true },
]

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
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 400); return () => clearTimeout(t) }, [])
  const isConnected = true

  const filtered = mockLivePatients.filter((p) => {
    if (alertFilter === 'all') return true
    return p.alertLevel === alertFilter
  })

  const onlineCount = mockLivePatients.filter(p => p.isOnline).length
  const highAlertCount = mockLivePatients.filter(p => p.alertLevel === 'high').length
  const mediumAlertCount = mockLivePatients.filter(p => p.alertLevel === 'medium').length
  const okCount = mockLivePatients.filter(p => p.alertLevel === 'none').length

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
          const caloriePercent = Math.min(Math.round((patient.todayCalories / patient.calorieTarget) * 100), 100)
          const waterPercent = Math.min(Math.round((patient.waterIntakeMl / patient.waterTargetMl) * 100), 100)
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
        <EmptyState icon={Activity} title="Aktif hasta yok" description="Aktif hastaların gerçek zamanlı verileri burada görünecek." />
      )}
    </PageContainer>
  )
}
