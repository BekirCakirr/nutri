import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useReports } from '@/hooks/use-reports'
import {
  ArrowLeft,
  Download,
  Printer,
  Activity,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Droplets,
  Dumbbell,
  Flame,
  Lightbulb,
  Share2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockReport = {
  patient: {
    name: 'Ayse Yilmaz',
    age: 32,
    goal: 'Kilo Verme',
    startWeight: 76,
    currentWeight: 72,
    targetWeight: 65,
    bmi: 26.4,
    plan: 'Kilo Verme Programi',
  },
  period: '18 Subat - 25 Subat 2026',
  adherence: {
    overall: 87,
    calories: 85,
    protein: 92,
    carbs: 80,
    fat: 88,
  },
  mealCompliance: [
    { day: 'Pazartesi', breakfast: true, lunch: true, dinner: true, snack: true },
    { day: 'Sali', breakfast: true, lunch: true, dinner: true, snack: false },
    { day: 'Carsamba', breakfast: true, lunch: false, dinner: true, snack: true },
    { day: 'Persembe', breakfast: true, lunch: true, dinner: true, snack: true },
    { day: 'Cuma', breakfast: true, lunch: true, dinner: false, snack: true },
    { day: 'Cumartesi', breakfast: false, lunch: true, dinner: true, snack: true },
    { day: 'Pazar', breakfast: true, lunch: true, dinner: true, snack: true },
  ],
  weeklyStats: {
    avgCalories: 1720,
    avgProtein: 108,
    avgCarbs: 195,
    avgFat: 58,
    avgWater: 1.9,
    totalMeals: 28,
    exerciseDays: 4,
  },
  recommendations: [
    'Su tuketimini gunluk 2.5 litreye cikarmaya calisin.',
    'Ogle yemeklerinde protein miktarini artirin.',
    'Hafta sonu kahvaltilarini atlamaktan kacinin.',
    'Aksam yemeklerinde karbonhidrat miktarini azaltin.',
    'Egzersiz sikligini haftada 5 gune cikarin.',
  ],
}

const weightChartData = [
  { date: 'Aralik', weight: 76, target: 65 },
  { date: 'Ocak', weight: 75.2, target: 65 },
  { date: '1 Sub', weight: 74.1, target: 65 },
  { date: '8 Sub', weight: 73.4, target: 65 },
  { date: '15 Sub', weight: 72.8, target: 65 },
  { date: '22 Sub', weight: 72.2, target: 65 },
  { date: '25 Sub', weight: 72, target: 65 },
]

const calorieChartData = [
  { date: 'Pzt', calories: 1750, target: 1800 },
  { date: 'Sal', calories: 1680, target: 1800 },
  { date: 'Car', calories: 1820, target: 1800 },
  { date: 'Per', calories: 1700, target: 1800 },
  { date: 'Cum', calories: 1650, target: 1800 },
  { date: 'Cmt', calories: 1790, target: 1800 },
  { date: 'Paz', calories: 1640, target: 1800 },
]

const macroData = [
  { name: 'Protein', value: 108, color: 'hsl(210, 100%, 50%)' },
  { name: 'Karbonhidrat', value: 195, color: 'hsl(45, 100%, 50%)' },
  { name: 'Yag', value: 58, color: 'hsl(140, 70%, 45%)' },
]

const nutrientData = [
  { nutrient: 'Protein', value: 92, max: 100 },
  { nutrient: 'Karbonhidrat', value: 80, max: 100 },
  { nutrient: 'Yag', value: 88, max: 100 },
  { nutrient: 'Lif', value: 65, max: 100 },
  { nutrient: 'Vitamin', value: 78, max: 100 },
  { nutrient: 'Mineral', value: 70, max: 100 },
]

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

function getAdherenceBarColor(value: number): string {
  if (value >= 90) return 'bg-emerald-500'
  if (value >= 70) return 'bg-blue-500'
  if (value >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

function getAdherenceLabel(value: number) {
  if (value >= 90) return { variant: 'success' as const, label: 'Mukemmel' }
  if (value >= 70) return { variant: 'info' as const, label: 'Iyi' }
  if (value >= 50) return { variant: 'warning' as const, label: 'Orta' }
  return { variant: 'destructive' as const, label: 'Dusuk' }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PatientReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchReports, isLoading } = useReports()

  useEffect(() => {
    if (id) fetchReports(id)
  }, [id, fetchReports])

  if (isLoading) return <DetailPageSkeleton />

  const weightLost = mockReport.patient.startWeight - mockReport.patient.currentWeight
  const weightProgress =
    ((mockReport.patient.startWeight - mockReport.patient.currentWeight) /
      (mockReport.patient.startWeight - mockReport.patient.targetWeight)) *
    100
  const totalMealSlots = mockReport.mealCompliance.length * 4
  const completedMeals = mockReport.mealCompliance.reduce(
    (acc, day) =>
      acc +
      (day.breakfast ? 1 : 0) +
      (day.lunch ? 1 : 0) +
      (day.dinner ? 1 : 0) +
      (day.snack ? 1 : 0),
    0
  )

  return (
    <PageContainer
      title="Hasta Raporu"
      description={mockReport.period}
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
          <Button variant="outline" size="sm">
            <Share2 className="h-3.5 w-3.5" />
            Paylas
          </Button>
          <Button size="sm">
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
              <AvatarFallback
                className={cn(
                  'text-xl font-bold',
                  getInitialColor(mockReport.patient.name)
                )}
              >
                {mockReport.patient.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            {/* Patient info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{mockReport.patient.name}</h2>
                <Badge variant="info">{mockReport.patient.goal}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {mockReport.patient.age} yas &middot; BMI {mockReport.patient.bmi} &middot; {mockReport.patient.plan}
              </p>

              {/* Weight progress bar */}
              <div className="mt-3 max-w-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Baslangic: {mockReport.patient.startWeight} kg</span>
                  <span>Hedef: {mockReport.patient.targetWeight} kg</span>
                </div>
                <div className="relative">
                  <Progress value={Math.min(weightProgress, 100)} className="h-2" />
                </div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                  {weightLost} kg verildi &middot; %{Math.round(weightProgress)} tamamlandi
                </p>
              </div>
            </div>

            {/* Weight stats */}
            <div className="flex gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Baslangic</p>
                <p className="text-lg font-bold tabular-nums">{mockReport.patient.startWeight}</p>
                <p className="text-[11px] text-muted-foreground">kg</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Mevcut</p>
                <p className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {mockReport.patient.currentWeight}
                </p>
                <p className="text-[11px] text-muted-foreground">kg</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Hedef</p>
                <p className="text-lg font-bold tabular-nums">{mockReport.patient.targetWeight}</p>
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
          value={`${mockReport.weeklyStats.avgCalories}`}
          icon={Flame}
          color="yellow"
        />
        <StatCard
          title="Toplam Ogun"
          value={`${completedMeals}/${totalMealSlots}`}
          icon={UtensilsCrossed}
          color="green"
        />
        <StatCard
          title="Su Tuketimi"
          value={`${mockReport.weeklyStats.avgWater}L`}
          icon={Droplets}
          trend="down"
          trendLabel="Dusuk"
          color="blue"
        />
        <StatCard
          title="Egzersiz"
          value={`${mockReport.weeklyStats.exerciseDays} gun`}
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
          value={mockReport.adherence.overall}
          title="Genel Uyum"
          label="uyum orani"
        />
      </div>

      {/* Calorie Chart + Macro Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CalorieChart data={calorieChartData} title="Haftalik Kalori Alimi" />
        <MacroPieChart data={macroData} title="Makro Dagilimi" />
      </div>

      {/* Nutrient Radar */}
      <NutrientRadarChart data={nutrientData} title="Besin Dengesi" className="mb-6" />

      {/* Adherence Progress Bars */}
      <Card className="mb-6 animate-fade-up">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Beslenme Uyumu</CardTitle>
          </div>
          <CardAction>
            <Badge variant={getAdherenceLabel(mockReport.adherence.overall).variant}>
              {getAdherenceLabel(mockReport.adherence.overall).label}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Genel', value: mockReport.adherence.overall },
            { label: 'Kalori', value: mockReport.adherence.calories },
            { label: 'Protein', value: mockReport.adherence.protein },
            { label: 'Karbonhidrat', value: mockReport.adherence.carbs },
            { label: 'Yag', value: mockReport.adherence.fat },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 animate-fade-up">
              <span className="w-28 text-sm text-muted-foreground">{item.label}</span>
              <div className="flex-1 relative">
                <div className="h-2.5 w-full rounded-full bg-secondary">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      getAdherenceBarColor(item.value)
                    )}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
              <span
                className={cn(
                  'text-sm font-semibold w-12 text-right tabular-nums',
                  item.value >= 80
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : item.value >= 60
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-amber-600 dark:text-amber-400'
                )}
              >
                %{item.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Meal Compliance Table */}
      <Card className="mb-6 overflow-hidden animate-fade-up">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Ogun Uyumu</CardTitle>
          </div>
          <CardAction>
            <Badge variant="secondary" className="tabular-nums">
              {completedMeals}/{totalMealSlots} ogun
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Gun</TableHead>
                <TableHead className="text-center">Kahvalti</TableHead>
                <TableHead className="text-center">Ogle</TableHead>
                <TableHead className="text-center">Aksam</TableHead>
                <TableHead className="text-center pr-6">Ara Ogun</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReport.mealCompliance.map((day) => {
                const dayCompleted = [day.breakfast, day.lunch, day.dinner, day.snack].filter(
                  Boolean
                ).length
                return (
                  <TableRow key={day.day} className="group">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{day.day}</span>
                        <Badge
                          variant={
                            dayCompleted === 4
                              ? 'success'
                              : dayCompleted >= 3
                                ? 'info'
                                : 'warning'
                          }
                          className="text-[10px] px-1.5 py-0"
                        >
                          {dayCompleted}/4
                        </Badge>
                      </div>
                    </TableCell>
                    {[day.breakfast, day.lunch, day.dinner, day.snack].map((completed, i) => (
                      <TableCell key={i} className={cn('text-center', i === 3 && 'pr-6')}>
                        {completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="animate-fade-up">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base">Oneriler</CardTitle>
          </div>
          <CardAction>
            <Badge variant="warning">{mockReport.recommendations.length} oneri</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-in-stagger">
            {mockReport.recommendations.map((rec, i) => (
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
                  variant={i < 2 ? 'destructive' : i < 4 ? 'warning' : 'info'}
                  className="shrink-0 mt-0.5"
                >
                  {i < 2 ? 'Oncelikli' : i < 4 ? 'Onemli' : 'Tavsiye'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
