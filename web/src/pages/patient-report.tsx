import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useReports } from '@/hooks/use-reports'
import { usePatients } from '@/hooks/use-patients'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  ArrowLeft,
  Download,
  Printer,
  UtensilsCrossed,
  Droplets,
  Dumbbell,
  Flame,
  Lightbulb,
  Share2,
  FileWarning
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { DetailPageSkeleton } from '@/components/shared/page-skeletons'
import { PageContainer } from '@/components/shared/page-container'
import { StatCard } from '@/components/shared/stat-card'
import { WeightProgressChart } from '@/components/charts/weight-progress-chart'
import { CalorieChart } from '@/components/charts/calorie-chart'
import { MacroPieChart } from '@/components/charts/macro-pie-chart'
import { NutrientRadarChart } from '@/components/charts/nutrient-radar-chart'
import { AdherenceGauge } from '@/components/charts/adherence-gauge'
import { cn } from '@/lib/utils'

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

// Removed unused helpers

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PatientReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { reports, fetchReports, isLoading: reportsLoading } = useReports()
  const { patients, isLoading: patientsLoading } = usePatients()

  useEffect(() => {
    if (id) fetchReports(id)
  }, [id, fetchReports])

  type ReportPatientData = Partial<{
    first_name: string; firstName: string; last_name: string; lastName: string;
    dateOfBirth: string; date_of_birth: string; birth_date: string; age: number;
    height_cm: number; current_weight_kg: number; weight: number; bmi: number;
    target_weight_kg: number; targetWeight: number;
    goal_type: string; goalType: string;
    diet_type: string; dietType: string;
    daily_calorie_target: number; dailyCalorieTarget: number;
    adherence_score: number; adherenceScore: number;
  }>

  type ReportDataField = Partial<{
    report_content: string | Record<string, any>;
    week_start: string; created_at: string; week_end: string;
  }>

  const patient = useMemo(() => (Array.isArray(patients) ? patients.find((p) => p.id === id) : undefined), [patients, id])
  const latestReport = useMemo(() => reports?.[0] as unknown as ReportDataField, [reports])

  if (reportsLoading || patientsLoading) return <DetailPageSkeleton />

  const patientData = patient as unknown as ReportPatientData | undefined

  const patientName = patientData ? `${patientData.first_name || patientData.firstName || ''} ${patientData.last_name || patientData.lastName || ''}`.trim() || 'Hasta' : 'Hasta'
  const patientInitials = patientName.split(' ').map((n: string) => n[0]).join('')

  if (!latestReport) {
    return (
      <PageContainer
        title="Hasta Raporu"
        narrow
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Geri
          </Button>
        }
      >
        <Card className="flex flex-col items-center justify-center p-12 mt-4 gap-4 animate-fade-up border-dashed shadow-sm">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
            <FileWarning className="w-8 h-8 text-muted-foreground/60" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Rapor Bulunamadi</h3>
            <p className="text-sm text-muted-foreground max-w-sm">Bu hasta icin henuz haftalik AI raporu olusturulmamis veya veri girilmemis.</p>
          </div>
          <Button onClick={() => navigate('/plan-creator')} className="mt-2" variant="default">
            Plan Olusturucuya Git
          </Button>
        </Card>
      </PageContainer>
    )
  }

  // Parse report_content from backend (safe)
  let content: any = {}
  try {
    const raw = latestReport?.report_content
    if (typeof raw === 'string') {
      content = raw.trim() ? JSON.parse(raw) : {}
    } else if (raw && typeof raw === 'object') {
      content = raw
    }
  } catch {
    content = {}
  }
  const startDate = new Date((latestReport?.week_start || latestReport?.created_at) as string || Date.now())
  const endDate = new Date(latestReport?.week_end as string || Date.now())
  const periodStr = `${format(startDate, 'd MMM', { locale: tr })} - ${format(endDate, 'd MMMM yyyy', { locale: tr })}`

  // Demographics
  const bmi = patientData?.height_cm && patientData?.current_weight_kg ? +(patientData.current_weight_kg / Math.pow(patientData.height_cm / 100, 2)).toFixed(1) : (patientData?.bmi || 0)
  const startWeight = content?.weight?.startWeight || patientData?.current_weight_kg || patientData?.weight || 0
  const currentWeight = content?.weight?.endWeight || patientData?.current_weight_kg || patientData?.weight || 0
  const targetWeight = patientData?.target_weight_kg || patientData?.targetWeight || currentWeight
  const weightLost = +(startWeight - currentWeight).toFixed(2)
  const totalWeightToLose = startWeight - targetWeight
  const weightProgress = totalWeightToLose > 0 ? (weightLost / totalWeightToLose) * 100 : 0

  // Stats
  const dailyCalories: any[] = Array.isArray(content?.nutrition?.dailyCalories) ? content.nutrition.dailyCalories : []
  const avgCals = dailyCalories.length > 0
    ? Math.round(dailyCalories.reduce((s: number, c: any) => s + (c?.calories ?? 0), 0) / dailyCalories.length)
    : 0
  const completedMeals = dailyCalories.length || 0
  const totalMealSlots = 7
  const adherenceScore = patientData?.adherence_score ?? patientData?.adherenceScore ?? content?.water?.goalAdherencePercent ?? Math.round((completedMeals / totalMealSlots) * 100)

  // Chart data
  const calorieChartData = dailyCalories.map((d: any) => ({
    date: format(new Date(d.date), 'EEE', { locale: tr }),
    calories: d.calories,
    target: patientData?.daily_calorie_target || patientData?.dailyCalorieTarget || 2000
  }))

  const macroData = [
    { name: 'Protein', value: content?.nutrition?.avgProtein || 0, color: 'hsl(210, 100%, 50%)' },
    { name: 'Karbonhidrat', value: content?.nutrition?.avgCarbs || 0, color: 'hsl(45, 100%, 50%)' },
    { name: 'Yag', value: content?.nutrition?.avgFat || 0, color: 'hsl(140, 70%, 45%)' },
  ]

  const weightChartData = [
    { date: format(startDate, 'd MMM'), weight: startWeight, target: targetWeight },
    { date: format(endDate, 'd MMM'), weight: currentWeight, target: targetWeight },
  ]

  const nutrientData = [
    { nutrient: 'Protein', value: Math.min(100, content?.nutrition?.avgProtein || 0), max: 100 },
    { nutrient: 'Karb', value: Math.min(100, content?.nutrition?.avgCarbs || 0), max: 100 },
    { nutrient: 'Yag', value: Math.min(100, content?.nutrition?.avgFat || 0), max: 100 },
    { nutrient: 'Su (Adherence)', value: content?.water?.goalAdherencePercent || 0, max: 100 },
  ]

  const recommendations = [
    'Su tuketimini gunluk hedefinize ulasacak sekilde artirin.',
    'Karbonhidrat odagini azaltarak protein dengesini iyilestirin.',
    'Duzenli egzersizlere devam edin, gunde en az 30 dk yurumeye calisin.',
    'Aksam ogunlerini daha erken tuketerek uyku kalitenizi artirabilirsiniz.'
  ]

  return (
    <PageContainer
      title="Hasta Raporu"
      description={periodStr}
      narrow
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Geri
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" />
            Yazdir
          </Button>
          <Button variant="outline" size="sm" disabled title="Yakinda">
            <Share2 className="h-3.5 w-3.5" />
            Paylas
          </Button>
          <Button size="sm" disabled title="Yakinda">
            <Download className="h-3.5 w-3.5" />
            PDF Indir
          </Button>
        </div>
      }
    >
      {/* Patient Header Card */}
      <Card className="mb-6 overflow-hidden animate-fade-up">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarFallback className={cn('text-xl font-bold', getInitialColor(patientName))}>
                {patientInitials}
              </AvatarFallback>
            </Avatar>

            {/* Patient info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{patientName}</h2>
                <Badge variant="info">{patientData?.goal_type || patientData?.goalType || 'Kilo Verme'}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {patientData?.birth_date ? (new Date().getFullYear() - new Date(patientData.birth_date as string).getFullYear()) : (patientData?.age || 30)} yas &middot; BMI {bmi} &middot; {patientData?.diet_type || patientData?.dietType || 'Standart'}
              </p>

              {/* Weight progress bar */}
              <div className="mt-3 max-w-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Baslangic: {startWeight} kg</span>
                  <span>Hedef: {targetWeight} kg</span>
                </div>
                <div className="relative">
                  <Progress value={Math.max(0, Math.min(weightProgress, 100))} className="h-2" />
                </div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                  {Math.abs(weightLost)} kg {weightLost > 0 ? 'verildi' : 'alindi'} &middot; %{Math.max(0, Math.round(weightProgress))} tamamlandi
                </p>
              </div>
            </div>

            {/* Weight stats */}
            <div className="flex gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Baslangic</p>
                <p className="text-lg font-bold tabular-nums">{startWeight}</p>
                <p className="text-[11px] text-muted-foreground">kg</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Mevcut</p>
                <p className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {currentWeight}
                </p>
                <p className="text-[11px] text-muted-foreground">kg</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Hedef</p>
                <p className="text-lg font-bold tabular-nums">{targetWeight}</p>
                <p className="text-[11px] text-muted-foreground">kg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 animate-in-stagger">
        <StatCard
          title="Ort. Kalori"
          value={`${avgCals}`}
          icon={Flame}
          color="yellow"
        />
        <StatCard
          title="Kayitli Gun"
          value={`${completedMeals}/${totalMealSlots}`}
          icon={UtensilsCrossed}
          color="green"
        />
        <StatCard
          title="Su Tuketimi"
          value={`${content?.water?.avgGlassesPerDay || 0} Bardak`}
          icon={Droplets}
          trend={content?.water?.goalAdherencePercent >= 100 ? 'up' : 'down'}
          color="blue"
        />
        <StatCard
          title="Uyku"
          value={`${content?.sleep?.avgHours || 0}S`}
          icon={Dumbbell}
          color="purple"
        />
      </div>

      {/* Weight Progress Chart + Adherence Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <WeightProgressChart
          data={weightChartData}
          title="Kilo Ilerlemesi"
          className="lg:col-span-2"
        />
        <AdherenceGauge
          value={adherenceScore}
          title="Genel Uyum"
          label="uyum orani"
        />
      </div>

      {/* Calorie Chart + Macro Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CalorieChart data={calorieChartData.length > 0 ? calorieChartData : []} title="Haftalik Kalori Alimi" />
        <MacroPieChart data={macroData} title="Makro Dagilimi" />
      </div>

      {/* Nutrient Radar */}
      <NutrientRadarChart data={nutrientData} title="Besin Dengesi" className="mb-6" />

      {/* Recommendations */}
      <Card className="animate-fade-up">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base">Oneriler</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-in-stagger">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-secondary/30 animate-fade-up"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">{rec}</p>
                </div>
                <Badge
                  variant={i < 1 ? 'destructive' : i < 3 ? 'warning' : 'info'}
                  className="shrink-0 mt-0.5"
                >
                  {i < 1 ? 'Oncelikli' : i < 3 ? 'Onemli' : 'Tavsiye'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
