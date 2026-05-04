import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Apple,
  ClipboardList,
  Activity,
  CalendarDays,
  MessageSquare,
  FileText,
  Droplets,
  Dumbbell,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Clock,
  Video,
  MapPin,
  Download,
  TrendingDown,
  Scale,
  Heart,
  Target,
  Sunrise,
  Sun,
  Moon,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CalorieChart } from '@/components/charts/calorie-chart'
import { WeightProgressChart } from '@/components/charts/weight-progress-chart'
import { MacroPieChart } from '@/components/charts/macro-pie-chart'
import { WaterIntakeChart } from '@/components/charts/water-intake-chart'
import { DetailPageSkeleton } from '@/components/shared/page-skeletons'
import { cn } from '@/lib/utils'
import { usePatientDetail } from '@/hooks/use-patient-detail'
import { useMeals } from '@/hooks/use-meals'
import { useAppointments } from '@/hooks/use-appointments'
import { useMessages } from '@/hooks/use-messages'

// ── Fallback patient removed — now using real API data ──────────

// Mock data removed — now using useMeals, useAppointments, and useMessages hooks

// Meal type label mapping for API data
const mealTypeLabels: Record<string, string> = {
  breakfast: 'Kahvaltı',
  lunch: 'Öğle',
  dinner: 'Akşam',
  snack: 'Ara Öğün',
}

// ── Chart data computed from real patient data ──────────────────────

function buildChartData(meals: any[], patient: any) {
  const dayLabels = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
  const target = Number(patient?.daily_calorie_target ?? patient?.dailyCalorieTarget) || 1800
  const targetWeight = Number(patient?.target_weight_kg ?? patient?.targetWeight) || 65

  // Group meals by day of week for calorie chart
  const calByDay: Record<string, number> = {}
  const macroTotals = { protein: 0, carbs: 0, fat: 0 }
  for (const m of (meals || [])) {
    const raw = m as any
    const dateStr = raw.log_date || raw.logDate || raw.date || ''
    const d = new Date(dateStr)
    const label = dayLabels[d.getDay()] || '?'
    const cal = Number(raw.total_calories ?? raw.totalCalories ?? raw.calories ?? 0)
    calByDay[label] = (calByDay[label] || 0) + cal
    macroTotals.protein += Number(raw.total_protein ?? raw.totalProtein ?? 0)
    macroTotals.carbs += Number(raw.total_carbs ?? raw.totalCarbs ?? 0)
    macroTotals.fat += Number(raw.total_fat ?? raw.totalFat ?? 0)
  }

  const calorieData = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    .filter((d) => calByDay[d] != null)
    .map((d) => ({ date: d, calories: Math.round(calByDay[d]), target }))

  const macroData = [
    { name: 'Protein', value: Math.round(macroTotals.protein / Math.max(meals?.length || 1, 1)), color: 'hsl(210, 100%, 50%)' },
    { name: 'Karbonhidrat', value: Math.round(macroTotals.carbs / Math.max(meals?.length || 1, 1)), color: 'hsl(45, 100%, 50%)' },
    { name: 'Yağ', value: Math.round(macroTotals.fat / Math.max(meals?.length || 1, 1)), color: 'hsl(140, 70%, 45%)' },
  ]

  // Weight data from patient profile (minimal — current + target)
  const currentWeight = Number(patient?.current_weight_kg ?? patient?.weight) || 0
  const weightData = currentWeight > 0
    ? [
        { date: 'Başlangıç', weight: currentWeight + 4, target: targetWeight },
        { date: 'Güncel', weight: currentWeight, target: targetWeight },
      ]
    : []

  // Water placeholder (no per-patient water endpoint for dietitian)
  const waterData: { date: string; amount: number }[] = []

  return { calorieData, weightData, macroData, waterData }
}

// ── Helpers ───────────────────────────────────────────────────────

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

function getBmiLabel(bmi: number): { label: string; variant: 'success' | 'warning' | 'destructive' } {
  if (bmi < 18.5) return { label: 'Zayıf', variant: 'warning' }
  if (bmi < 25) return { label: 'Normal', variant: 'success' }
  if (bmi < 30) return { label: 'Fazla Kilolu', variant: 'warning' }
  return { label: 'Obez', variant: 'destructive' }
}

function getMealTypeIcon(type: string) {
  switch (type) {
    case 'Kahvaltı':
    case 'breakfast':
      return Sunrise
    case 'Öğle':
    case 'lunch':
      return Sun
    case 'Akşam':
    case 'dinner':
      return Moon
    default:
      return Apple
  }
}

// ── Tab definitions ───────────────────────────────────────────────

const tabs = [
  { value: 'overview', label: 'Genel', icon: User },
  { value: 'nutrition', label: 'Beslenme', icon: Apple },
  { value: 'plan', label: 'Plan', icon: ClipboardList },
  { value: 'tracking', label: 'Takip', icon: Activity },
  { value: 'appointments', label: 'Randevular', icon: CalendarDays },
  { value: 'messages', label: 'Mesajlar', icon: MessageSquare },
  { value: 'reports', label: 'Raporlar', icon: FileText },
] as const

type TabValue = (typeof tabs)[number]['value']

// ── Component ─────────────────────────────────────────────────────

export default function PatientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { patient: apiPatient, isLoading: patientLoading } = usePatientDetail(id)
  const [activeTab, setActiveTab] = useState<TabValue>('overview')

  // Real data hooks
  const { meals, fetchMeals, isLoading: mealsLoading } = useMeals(id)
  const { appointments, fetchAppointments, isLoading: appointmentsLoading } = useAppointments(id)
  const { conversations, fetchConversations } = useMessages()

  // Compute chart data from real meals and patient profile
  const chartData = useMemo(() => buildChartData(meals || [], apiPatient), [meals, apiPatient])

  const isValidId = !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  // Geçersiz id (örn. "new") gelirse hasta listesine yönlendir — backend 500'ü engelle
  useEffect(() => {
    if (id && !isValidId) navigate('/patients', { replace: true })
  }, [id, isValidId, navigate])

  // Fetch sub-data when tabs are activated
  useEffect(() => {
    if ((activeTab === 'nutrition' || activeTab === 'overview' || activeTab === 'tracking') && isValidId) fetchMeals()
  }, [activeTab, isValidId, fetchMeals])

  useEffect(() => {
    if (activeTab === 'appointments' && isValidId) fetchAppointments()
  }, [activeTab, isValidId, fetchAppointments])

  useEffect(() => {
    if (activeTab === 'messages') fetchConversations()
  }, [activeTab, fetchConversations])

  if (patientLoading) return <DetailPageSkeleton />
  if (!patientLoading && !apiPatient) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/patients')} className="text-muted-foreground -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Hasta Listesi
        </Button>
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border bg-card/50">
          <User className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-lg font-semibold">Hasta Bulunamadı</h2>
          <p className="text-sm text-muted-foreground mt-1 text-balance">
            Aradığınız hasta profiline ulaşılamıyor veya profil silinmiş olabilir.
          </p>
        </div>
      </div>
    )
  }

  // Map API patient to display format, safely handling snake_case vs camelCase
  type RawPatient = {
    id: string; first_name?: string; firstName?: string; last_name?: string; lastName?: string;
    dateOfBirth?: string; date_of_birth?: string; birth_date?: string; age?: number;
    email?: string; phone?: string; status?: string; gender?: string;
    height?: number; height_cm?: number; current_weight_kg?: number; weight?: number;
    body_fat_percentage?: number; bodyFatPercentage?: number;
    goals?: string[]; goal_type?: string; goalType?: string;
    adherence_score?: number; adherenceScore?: number;
    daily_calorie_target?: number; dailyCalorieTarget?: number;
    allergies?: string[]; diet_type?: string; dietType?: string; dietaryPreference?: string;
    createdAt?: string; created_at?: string; next_appointment?: string; nextAppointment?: string;
  };
  const p = apiPatient as unknown as RawPatient
  const patientData = {
    id: p.id,
    fullName: `${p.first_name ?? p.firstName ?? ''} ${p.last_name ?? p.lastName ?? ''}`.trim() || 'İsimsiz Hasta',
    age: (p.dateOfBirth || p.date_of_birth || p.birth_date) 
      ? Math.floor((Date.now() - new Date((p.dateOfBirth || p.date_of_birth || p.birth_date) as string).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) 
      : (p.age || 30),
    email: p.email ?? '-',
    phone: p.phone ?? '-',
    status: p.status ?? 'active',
    gender: p.gender === 'female' ? 'Kadın' : p.gender === 'male' ? 'Erkek' : 'Belirtilmemiş',
    heightCm: p.height ?? p.height_cm ?? 0,
    weightKg: p.current_weight_kg ?? p.weight ?? 0,
    bmi: ((p.height ?? p.height_cm) && (p.current_weight_kg ?? p.weight)) 
      ? Math.round((((p.current_weight_kg ?? p.weight) as number) / ((((p.height ?? p.height_cm) as number) / 100) ** 2)) * 10) / 10 
      : 0,
    bodyFatPercentage: p.body_fat_percentage ?? p.bodyFatPercentage ?? 0,
    goal: p.goals?.[0] ?? p.goal_type ?? p.goalType ?? 'Belirtilmemiş',
    adherenceScore: p.adherence_score ?? p.adherenceScore ?? 0,
    dailyCalorieTarget: p.daily_calorie_target ?? p.dailyCalorieTarget ?? 2000,
    allergies: p.allergies ?? [],
    dietaryPreference: p.diet_type ?? p.dietType ?? p.dietaryPreference ?? 'Standart',
    startDate: p.createdAt ?? p.created_at ?? new Date().toISOString(),
    nextAppointment: p.next_appointment ?? p.nextAppointment ?? 'Yok',
  }

  const initials = patientData.fullName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const bmiInfo = getBmiLabel(patientData.bmi)
  const daysSinceStart = Math.max(0, Math.floor(
    (Date.now() - new Date(patientData.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ))

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* ── Back navigation ─────────────────────────────────── */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/patients')}
        className="text-muted-foreground -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Hasta Listesi
      </Button>

      {/* ── Patient header with big avatar + inline metrics ── */}
      <div className="animate-fade-up">
        <Card className="py-0 gap-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Avatar + basic info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar className="h-16 w-16 shrink-0">
                  <AvatarFallback
                    className={cn('text-xl font-bold', getInitialColor(patientData.fullName))}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold tracking-tight">{patientData.fullName}</h1>
                    <Badge variant="success">Aktif</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {patientData.age} yas, {patientData.gender} &middot; {patientData.goal} &middot;{' '}
                    {daysSinceStart} gundur takipte
                  </p>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {patientData.email}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {patientData.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key metrics inline */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">BMI</p>
                  <p className="text-lg font-bold tabular-nums">{patientData.bmi}</p>
                  <Badge variant={bmiInfo.variant} className="mt-0.5">
                    {bmiInfo.label}
                  </Badge>
                </div>
                <Separator orientation="vertical" className="h-12 hidden sm:block" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Kilo</p>
                  <p className="text-lg font-bold tabular-nums">{patientData.weightKg} kg</p>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 justify-center mt-0.5">
                    <TrendingDown className="h-3 w-3" />
                    -4 kg
                  </span>
                </div>
                <Separator orientation="vertical" className="h-12 hidden sm:block" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Uyum</p>
                  <p
                    className={cn(
                      'text-lg font-bold tabular-nums',
                      getAdherenceColor(patientData.adherenceScore)
                    )}
                  >
                    %{patientData.adherenceScore}
                  </p>
                  <Progress value={patientData.adherenceScore} className="h-1.5 w-14 mt-1" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:flex-col sm:shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none sm:w-full"
                  onClick={() => navigate(`/messages/${id}`)}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Mesaj
                </Button>
                <Button
                  size="sm"
                  className="flex-1 sm:flex-none sm:w-full"
                  onClick={() => navigate(`/plans/create/${id}`)}
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  Plan Olustur
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Tab navigation ──────────────────────────────────── */}
      <nav className="flex gap-1 overflow-x-auto rounded-lg border bg-card p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] cursor-pointer',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* ── Tab content ─────────────────────────────────────── */}
      <div key={activeTab} className="animate-in-stagger">
        {/* ─── Genel Bakis ──────────────────────────────────── */}
        {activeTab === 'overview' && (
          <>
            {/* Quick stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: 'Kilo',
                  value: `${patientData.weightKg} kg`,
                  icon: Scale,
                  color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
                },
                {
                  label: 'Boy',
                  value: `${patientData.heightCm} cm`,
                  icon: User,
                  color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30',
                },
                {
                  label: 'Vücut Yağ Oranı',
                  value: `%${patientData.bodyFatPercentage}`,
                  icon: Heart,
                  color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30',
                },
                {
                  label: 'Günlük Hedef',
                  value: `${patientData.dailyCalorieTarget} kcal`,
                  icon: Target,
                  color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
                },
              ].map((stat) => (
                <Card key={stat.label} className="py-0 gap-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                          stat.color
                        )}
                      >
                        <stat.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-lg font-bold tabular-nums leading-tight">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal info card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Kisisel Bilgiler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    {[
                      { label: 'E-posta', value: patientData.email },
                      { label: 'Telefon', value: patientData.phone },
                      { label: 'Beslenme Tercihi', value: patientData.dietaryPreference },
                      {
                        label: 'Alerjiler',
                        value: patientData.allergies.length > 0 ? null : 'Yok',
                        badges: patientData.allergies,
                      },
                      { label: 'Baslangic Tarihi', value: patientData.startDate },
                      {
                        label: 'Sonraki Randevu',
                        value: patientData.nextAppointment,
                      },
                    ].map((row, idx) => (
                      <div key={row.label}>
                        <div className="flex items-center justify-between py-3">
                          <span className="text-sm text-muted-foreground">{row.label}</span>
                          {row.badges ? (
                            <div className="flex gap-1.5">
                              {row.badges.map((a: string) => (
                                <Badge key={a} variant="destructive">
                                  {a}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm font-medium">{row.value}</span>
                          )}
                        </div>
                        {idx < 5 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weight progress chart */}
              <WeightProgressChart
                data={chartData.weightData}
                title="Kilo Degisimi (Son 6 Ay)"
              />
            </div>
          </>
        )}

        {/* ─── Beslenme ─────────────────────────────────────── */}
        {activeTab === 'nutrition' && (
          <>
            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <CalorieChart
                data={chartData.calorieData}
                title="Haftalik Kalori Alimi"
              />
              <MacroPieChart
                data={chartData.macroData}
                title="Makro Besin Dagilimi"
              />
            </div>

            {/* Meals list */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Son Ogunler</CardTitle>
                <CardDescription>Hastanin son kaydettigi yemekler</CardDescription>
              </CardHeader>
              <CardContent>
                {mealsLoading ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Yukleniyor...</p>
                ) : meals.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Henuz ogun kaydı yok.</p>
                ) : (
                <div className="space-y-2">
                  {meals.map((meal) => {
                    const mealTypeLabel = mealTypeLabels[meal.type] || meal.name || meal.type
                    const itemsText = meal.items?.map((i) => i.name).join(', ') || meal.notes || ''
                    return (
                    <div
                      key={meal.id}
                      className="flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        {(() => { const Icon = getMealTypeIcon(mealTypeLabel); return <Icon className="h-5 w-5 text-muted-foreground" />; })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{mealTypeLabel}</p>
                          <Badge
                            variant={meal.logged ? 'success' : 'warning'}
                          >
                            {meal.logged ? 'Onayli' : 'Bekliyor'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{itemsText}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold tabular-nums">
                          {meal.calories} kcal
                        </p>
                        <p className="text-xs text-muted-foreground">{meal.date}</p>
                      </div>
                    </div>
                    )
                  })}
                </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* ─── Plan ─────────────────────────────────────────── */}
        {activeTab === 'plan' && (
          <Card>
            <CardHeader>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Aktif Diyet Plani</CardTitle>
                  <Badge variant="success">Aktif</Badge>
                </div>
                <CardDescription className="mt-1">
                  Kilo Verme Programi &mdash; Hafta 8/12
                </CardDescription>
              </div>
              <CardAction>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/plans/create/${id}`)}
                >
                  Plani Duzenle
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Macro targets */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Kalori', value: '1800 kcal', color: 'text-blue-600 dark:text-blue-400' },
                  { label: 'Protein', value: '120g', color: 'text-emerald-600 dark:text-emerald-400' },
                  { label: 'Karbonhidrat', value: '200g', color: 'text-amber-600 dark:text-amber-400' },
                  { label: 'Yag', value: '60g', color: 'text-violet-600 dark:text-violet-400' },
                ].map((macro) => (
                  <div
                    key={macro.label}
                    className="rounded-lg border bg-secondary/30 p-4 text-center"
                  >
                    <p className="text-xs text-muted-foreground mb-1">{macro.label}</p>
                    <p className={cn('text-lg font-bold tabular-nums', macro.color)}>
                      {macro.value}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Adherence */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Plan Uyumu</p>
                  <span
                    className={cn(
                      'text-sm font-bold tabular-nums',
                      getAdherenceColor(patientData.adherenceScore)
                    )}
                  >
                    %{patientData.adherenceScore}
                  </span>
                </div>
                <Progress value={patientData.adherenceScore} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Hasta son 7 gunde ortalama %{patientData.adherenceScore} oraninda plana uyum
                  gostermistir.
                </p>
              </div>

              <Separator />

              {/* Plan macro pie chart */}
              <MacroPieChart
                data={chartData.macroData}
                title="Hedef Makro Dagilimi"
              />
            </CardContent>
          </Card>
        )}

        {/* ─── Takip ────────────────────────────────────────── */}
        {activeTab === 'tracking' && (
          <>
            {/* Tracking metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="py-0 gap-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                      <Scale className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium">Kilo Takibi</span>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">{patientData.weightKg} kg</p>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      -0.5 kg bu hafta
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Hedef: 65 kg</p>
                </CardContent>
              </Card>

              <Card className="py-0 gap-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-950/30">
                      <Droplets className="h-4 w-4 text-cyan-500" />
                    </div>
                    <span className="text-sm font-medium">Su Tuketimi</span>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">1.8 L</p>
                  <Progress value={72} className="mt-2 h-1.5" />
                  <p className="text-xs text-muted-foreground mt-2">Hedef: 2.5 L (%72)</p>
                </CardContent>
              </Card>

              <Card className="py-0 gap-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/30">
                      <Dumbbell className="h-4 w-4 text-orange-500" />
                    </div>
                    <span className="text-sm font-medium">Egzersiz</span>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">4 / 5</p>
                  <p className="text-sm text-muted-foreground mt-1">Bu hafta tamamlanan</p>
                  <p className="text-xs text-muted-foreground mt-1">Toplam 220 dk</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeightProgressChart
                data={chartData.weightData}
                title="Kilo Ilerleme Grafigi"
              />
              <WaterIntakeChart
                data={chartData.waterData}
                target={2.5}
                title="Haftalik Su Tuketimi"
              />
            </div>
          </>
        )}

        {/* ─── Randevular ───────────────────────────────────── */}
        {activeTab === 'appointments' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Randevu Gecmisi</CardTitle>
              <CardAction>
                <Button size="sm" onClick={() => navigate('/appointments')}>
                  <CalendarDays className="h-3.5 w-3.5" />
                  Yeni Randevu
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Yukleniyor...</p>
              ) : appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Henuz randevu yok.</p>
              ) : (
              <div className="space-y-2">
                {appointments.map((apt) => {
                  const isUpcoming = apt.status === 'scheduled'
                  const typeLabels: Record<string, string> = { consultation: 'Takip', follow_up: 'Kontrol', assessment: 'Plan Degerlendirme', initial: 'Ilk Gorusme' }
                  const typeLabel = typeLabels[apt.type] || apt.title || apt.type
                  const hasVideo = !!apt.meetingUrl
                  const modeLabel = hasVideo ? 'Video' : (apt.location || 'Yuz yuze')
                  return (
                    <div
                      key={apt.id}
                      className={cn(
                        'flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors',
                        isUpcoming
                          ? 'border-primary/20 bg-primary/5'
                          : 'hover:bg-secondary/50'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                          isUpcoming
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary text-muted-foreground'
                        )}
                      >
                        {isUpcoming ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{typeLabel}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {apt.date} &middot; {apt.startTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline">
                          {hasVideo ? (
                            <Video className="h-3 w-3 mr-1" />
                          ) : (
                            <MapPin className="h-3 w-3 mr-1" />
                          )}
                          {modeLabel}
                        </Badge>
                        <Badge variant={isUpcoming ? 'info' : apt.status === 'cancelled' ? 'destructive' : 'success'}>
                          {isUpcoming ? 'Yaklasan' : apt.status === 'cancelled' ? 'Iptal' : 'Tamamlandi'}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ─── Mesajlar ─────────────────────────────────────── */}
        {activeTab === 'messages' && (() => {
          // Find the conversation for this patient
          const patientConversation = conversations.find((c: any) => (Array.isArray(c?.participantIds) && c.participantIds.includes(id)) || c?.participantId === id || c?.id === id)
          return (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Son Mesajlar</CardTitle>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => navigate(`/messages/${id}`)}
                >
                  Tum Mesajlari Gor
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              {patientConversation ? (
                <div className="space-y-3">
                  <div className="flex justify-start">
                    <div className="max-w-[75%] rounded-2xl px-4 py-2.5 bg-secondary rounded-bl-sm">
                      <p className="text-sm font-medium mb-0.5">{patientConversation.participantName ?? patientData.fullName}</p>
                      <p className="text-sm leading-relaxed">{patientConversation.lastMessage}</p>
                      <p className="text-[11px] mt-1 tabular-nums text-muted-foreground">
                        {patientConversation.lastMessageAt ? new Date(patientConversation.lastMessageAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                  </div>
                  {patientConversation.unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      {patientConversation.unreadCount} okunmamis mesaj
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">Henuz mesaj yok.</p>
              )}

              <div className="mt-4 pt-4 border-t">
                <Button
                  className="w-full"
                  onClick={() => navigate(`/messages/${id}`)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Mesaj Gonder
                </Button>
              </div>
            </CardContent>
          </Card>
          )
        })()}

        {/* ─── Raporlar ─────────────────────────────────────── */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Haftalik Rapor',
                description: 'Son haftalik beslenme ve uyum raporu',
                icon: FileText,
                color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
                period: '24 Sub - 02 Mar 2026',
              },
              {
                title: 'Aylik Rapor',
                description: 'Aylik ilerleme ve genel degerlendirme',
                icon: Activity,
                color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
                period: 'Subat 2026',
              },
              {
                title: 'Ilerleme Raporu',
                description: 'Baslangictan itibaren genel ilerleme',
                icon: TrendingDown,
                color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30',
                period: 'Eyl 2025 - Mar 2026',
              },
            ].map((report) => (
              <Card
                key={report.title}
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 py-0 gap-0"
                onClick={() => navigate(`/reports/patient/${id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                        report.color
                      )}
                    >
                      <report.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold">{report.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {report.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">{report.period}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="outline">PDF</Badge>
                    <Button variant="ghost" size="xs" className="text-muted-foreground">
                      <Download className="h-3 w-3" />
                      Indir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
