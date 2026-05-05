import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Download,
  Calendar,
  Users,
  BarChart3,
  ArrowRight,
  ClipboardList,
  Activity,
  Target,
  Utensils,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DashboardSkeleton } from '@/components/shared/page-skeletons'
import { PageContainer } from '@/components/shared/page-container'
import { StatCard } from '@/components/shared/stat-card'
import { CalorieChart } from '@/components/charts/calorie-chart'
import { WeeklySummaryChart } from '@/components/charts/weekly-summary-chart'
import { MealComplianceChart } from '@/components/charts/meal-compliance-chart'
// TrendSparkline removed — not used in this page
import { cn } from '@/lib/utils'
import { usePatients } from '@/hooks/use-patients'

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const reportTypes = [
  {
    id: 'weekly',
    label: 'Haftalik Rapor',
    description: 'Son 7 gunluk ozet',
    icon: Calendar,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    id: 'monthly',
    label: 'Aylik Rapor',
    description: '30 gunluk detayli analiz',
    icon: BarChart3,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    id: 'custom',
    label: 'Ozel Tarih',
    description: 'Istediginiz aralik',
    icon: ClipboardList,
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  },
] as const

// patientSummary is now derived from the usePatients hook inside the component

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitialColor(name: string): string {
  const colors = [
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function getAdherenceColor(value: number): string {
  if (value >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (value >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function getAdherenceBadge(value: number) {
  if (value >= 80) return { variant: 'success' as const, label: 'Iyi' }
  if (value >= 50) return { variant: 'warning' as const, label: 'Orta' }
  return { variant: 'destructive' as const, label: 'Dusuk' }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReportsPage() {
  const navigate = useNavigate()
  const [reportType, setReportType] = useState('weekly')
  const [selectedPatient, setSelectedPatient] = useState('all')
  const { patients: allPatients, isLoading: patientsLoading } = usePatients()

  // Dynamic default dates: last 7 days
  const today = new Date()
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7)
  const fmtDate = (d: Date) => d.toISOString().split('T')[0]

  // Derive patient summary from real patient data
  const safeAllPatients = Array.isArray(allPatients) ? allPatients : []
  const patientSummary = useMemo(() =>
    safeAllPatients.map((p: any) => ({
      id: p.id,
      name: `${p.firstName || p.first_name || ''} ${p.lastName || p.last_name || ''}`.trim() || 'Hasta',
      adherence: p.adherence_score ?? p.adherenceScore ?? 0,
      avgCalories: p.avg_calories ?? p.avgCalories ?? 0,
      meals: p.total_meals ?? p.totalMeals ?? 0,
      weight: p.weight_change || p.weightChange ? `${(p.weight_change || p.weightChange) > 0 ? '+' : ''}${p.weight_change || p.weightChange} kg` : '-',
      status: p.status ?? 'active',
    })),
    [safeAllPatients],
  )

  const activePatientCount = safeAllPatients.filter((p: any) => p.status === 'active').length
  const avgAdherence = safeAllPatients.length > 0
    ? Math.round(safeAllPatients.reduce((sum: number, p: any) => sum + (p.adherenceScore ?? 0), 0) / safeAllPatients.length)
    : 0

  if (patientsLoading) return <DashboardSkeleton />

  return (
    <PageContainer
      title="Raporlar"
      description="Hasta ilerlemesi ve beslenme raporlarini olusturun."
      actions={
        <Button size="sm" onClick={async () => {
          try {
            const { generateReport } = await import('@/services/report.service')
            const today = new Date()
            const weekStart = new Date(today); weekStart.setDate(today.getDate() - 7)
            const fmt = (d: Date) => d.toISOString().split('T')[0]
            await generateReport({ weekStart: fmt(weekStart), weekEnd: fmt(today) })
            alert('Rapor başarıyla oluşturuldu.')
          } catch { alert('Rapor oluşturulamadı.') }
        }}>
          <Download className="h-3.5 w-3.5" />
          Rapor Oluştur
        </Button>
      }
    >
      {/* Report Type Selection — Visual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-in-stagger">
        {reportTypes.map((type) => {
          const Icon = type.icon
          const isSelected = reportType === type.id
          return (
            <Card
              key={type.id}
              className={cn(
                'cursor-pointer py-0 gap-0 transition-all duration-[var(--duration-fast)] hover:shadow-md',
                isSelected && 'ring-2 ring-primary shadow-md'
              )}
              onClick={() => setReportType(type.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors',
                      isSelected ? 'bg-primary text-primary-foreground' : type.color
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-semibold', isSelected && 'text-primary')}>
                      {type.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                  </div>
                  {isSelected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-1 animate-fade-up" />
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Date Range & Patient Filters */}
      <Card className="py-0 gap-0 mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Baslangic Tarihi</Label>
              <Input type="date" defaultValue={fmtDate(weekAgo)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Bitis Tarihi</Label>
              <Input type="date" defaultValue={fmtDate(today)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Hasta</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Hasta secin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tum Hastalar</SelectItem>
                  {(patientSummary ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-in-stagger">
        <StatCard
          title="Aktif Hasta"
          value={activePatientCount}
          icon={Users}
          color="blue"
          featured
        />
        <StatCard
          title="Ort. Uyum"
          value={`%${avgAdherence}`}
          icon={Target}
          color="green"
        />
        <StatCard
          title="Toplam Hasta"
          value={safeAllPatients.length}
          icon={Utensils}
          color="yellow"
        />
        <StatCard
          title="Raporlar"
          value={patientSummary.length}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CalorieChart title="Haftalik Kalori Takibi" />
        <MealComplianceChart title="Ogun Uyum Orani" />
      </div>

      <WeeklySummaryChart title="Haftalik Besin Dagilimi" className="mb-6" />

      {/* Patient Summary Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Hasta Ozeti</CardTitle>
          </div>
          <CardAction>
            <Badge variant="secondary" className="tabular-nums">
              {patientSummary.length} hasta
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 animate-in-stagger">
            {patientSummary.map((patient) => {
              const initials = patient.name
                .split(' ')
                .map((n) => n[0])
                .join('')
              const adherenceBadge = getAdherenceBadge(patient.adherence)
              return (
                <div
                  key={patient.id}
                  className="flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-[var(--duration-fast)] hover:shadow-sm hover:bg-secondary/30 cursor-pointer animate-fade-up"
                  onClick={() => navigate(`/reports/patient/${patient.id}`)}
                >
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback
                      className={cn('text-xs font-semibold', getInitialColor(patient.name))}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{patient.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {patient.meals} ogun kaydi
                    </p>
                  </div>

                  {/* Adherence */}
                  <div className="hidden sm:flex items-center gap-2 w-32">
                    <Progress value={patient.adherence} className="h-1.5 flex-1" />
                    <span
                      className={cn(
                        'text-xs font-semibold tabular-nums',
                        getAdherenceColor(patient.adherence)
                      )}
                    >
                      %{patient.adherence}
                    </span>
                  </div>

                  {/* Calories */}
                  <div className="hidden md:block text-center w-20">
                    <p className="text-xs text-muted-foreground">Ort. Kalori</p>
                    <p className="text-sm font-semibold tabular-nums">{patient.avgCalories}</p>
                  </div>

                  {/* Weight change */}
                  <div className="hidden md:block text-center w-16">
                    <p className="text-xs text-muted-foreground">Kilo</p>
                    <p
                      className={cn(
                        'text-sm font-semibold tabular-nums',
                        patient.weight.startsWith('-')
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      )}
                    >
                      {patient.weight}
                    </p>
                  </div>

                  {/* Badge */}
                  <Badge variant={adherenceBadge.variant} className="hidden sm:inline-flex">
                    {adherenceBadge.label}
                  </Badge>

                  {/* Arrow */}
                  <Button variant="ghost" size="icon-xs">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
