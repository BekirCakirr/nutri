import { useState } from 'react'
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
import { cn } from '@/lib/utils'

// ── Mock data ─────────────────────────────────────────────────────

const mockPatient = {
  id: '1',
  fullName: 'Ayşe Yılmaz',
  age: 32,
  email: 'ayse.yilmaz@email.com',
  phone: '+90 532 111 2233',
  status: 'active' as const,
  gender: 'Kadın',
  heightCm: 165,
  weightKg: 72,
  bmi: 26.4,
  bodyFatPercentage: 28,
  goal: 'Kilo Verme',
  adherenceScore: 87,
  dailyCalorieTarget: 1800,
  allergies: ['Gluten', 'Laktoz'],
  dietaryPreference: 'Omnivore',
  startDate: '2025-09-15',
  nextAppointment: '2026-03-02 10:00',
}

const mockMeals = [
  { id: '1', date: '2026-02-25', type: 'Kahvaltı', items: 'Yulaf ezmesi, muz, bal', calories: 420, status: 'verified' },
  { id: '2', date: '2026-02-25', type: 'Öğle', items: 'Tavuk salata, tam buğday ekmek', calories: 550, status: 'unverified' },
  { id: '3', date: '2026-02-24', type: 'Akşam', items: 'Izgara somon, sebze sote', calories: 620, status: 'verified' },
  { id: '4', date: '2026-02-24', type: 'Ara Öğün', items: 'Badem, elma', calories: 210, status: 'verified' },
]

const mockAppointments = [
  { id: '1', date: '2026-03-02', time: '10:00', type: 'Takip', status: 'upcoming', mode: 'Video' },
  { id: '2', date: '2026-02-18', time: '14:00', type: 'Plan Değerlendirme', status: 'completed', mode: 'Yüz yüze' },
  { id: '3', date: '2026-02-04', time: '11:00', type: 'İlk Görüşme', status: 'completed', mode: 'Video' },
]

const mockMessages = [
  { id: '1', from: 'Ayşe Yılmaz', text: 'Merhaba, bugünkü öğle yemeğim uygun muydu?', time: '14:30', isPatient: true },
  { id: '2', from: 'Dr. Ayşe', text: 'Evet, gayet iyi bir tercih olmuş. Protein miktarı yeterli.', time: '14:45', isPatient: false },
  { id: '3', from: 'Ayşe Yılmaz', text: 'Teşekkürler, yarınki randevuda görüşürüz!', time: '14:50', isPatient: true },
]

// ── Chart data tailored for this patient ──────────────────────────

const patientCalorieData = [
  { date: 'Pzt', calories: 1750, target: 1800 },
  { date: 'Sal', calories: 1820, target: 1800 },
  { date: 'Çar', calories: 1680, target: 1800 },
  { date: 'Per', calories: 1900, target: 1800 },
  { date: 'Cum', calories: 1790, target: 1800 },
  { date: 'Cmt', calories: 1850, target: 1800 },
  { date: 'Paz', calories: 1720, target: 1800 },
]

const patientWeightData = [
  { date: 'Eki', weight: 76, target: 65 },
  { date: 'Kas', weight: 75.2, target: 65 },
  { date: 'Ara', weight: 74.5, target: 65 },
  { date: 'Oca', weight: 73.8, target: 65 },
  { date: 'Şub', weight: 72.5, target: 65 },
  { date: 'Mar', weight: 72, target: 65 },
]

const patientMacroData = [
  { name: 'Protein', value: 120, color: 'hsl(210, 100%, 50%)' },
  { name: 'Karbonhidrat', value: 200, color: 'hsl(45, 100%, 50%)' },
  { name: 'Yağ', value: 60, color: 'hsl(140, 70%, 45%)' },
]

const patientWaterData = [
  { date: 'Pzt', amount: 2.0 },
  { date: 'Sal', amount: 1.5 },
  { date: 'Çar', amount: 2.3 },
  { date: 'Per', amount: 1.8 },
  { date: 'Cum', amount: 1.6 },
  { date: 'Cmt', amount: 2.1 },
  { date: 'Paz', amount: 1.9 },
]

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
      return '🌅'
    case 'Öğle':
      return '☀️'
    case 'Akşam':
      return '🌙'
    default:
      return '🍎'
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
  const [activeTab, setActiveTab] = useState<TabValue>('overview')

  const initials = mockPatient.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
  const bmiInfo = getBmiLabel(mockPatient.bmi)
  const daysSinceStart = Math.floor(
    (Date.now() - new Date(mockPatient.startDate).getTime()) / (1000 * 60 * 60 * 24)
  )

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
                    className={cn('text-xl font-bold', getInitialColor(mockPatient.fullName))}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold tracking-tight">{mockPatient.fullName}</h1>
                    <Badge variant="success">Aktif</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {mockPatient.age} yas, {mockPatient.gender} &middot; {mockPatient.goal} &middot;{' '}
                    {daysSinceStart} gundur takipte
                  </p>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {mockPatient.email}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {mockPatient.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key metrics inline */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">BMI</p>
                  <p className="text-lg font-bold tabular-nums">{mockPatient.bmi}</p>
                  <Badge variant={bmiInfo.variant} className="mt-0.5">
                    {bmiInfo.label}
                  </Badge>
                </div>
                <Separator orientation="vertical" className="h-12 hidden sm:block" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Kilo</p>
                  <p className="text-lg font-bold tabular-nums">{mockPatient.weightKg} kg</p>
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
                      getAdherenceColor(mockPatient.adherenceScore)
                    )}
                  >
                    %{mockPatient.adherenceScore}
                  </p>
                  <Progress value={mockPatient.adherenceScore} className="h-1.5 w-14 mt-1" />
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
      <div className="animate-in-stagger">
        {/* ─── Genel Bakis ──────────────────────────────────── */}
        {activeTab === 'overview' && (
          <>
            {/* Quick stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: 'Kilo',
                  value: `${mockPatient.weightKg} kg`,
                  icon: Scale,
                  color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
                },
                {
                  label: 'Boy',
                  value: `${mockPatient.heightCm} cm`,
                  icon: User,
                  color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30',
                },
                {
                  label: 'Vücut Yağ Oranı',
                  value: `%${mockPatient.bodyFatPercentage}`,
                  icon: Heart,
                  color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30',
                },
                {
                  label: 'Günlük Hedef',
                  value: `${mockPatient.dailyCalorieTarget} kcal`,
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
                      { label: 'E-posta', value: mockPatient.email },
                      { label: 'Telefon', value: mockPatient.phone },
                      { label: 'Beslenme Tercihi', value: mockPatient.dietaryPreference },
                      {
                        label: 'Alerjiler',
                        value: mockPatient.allergies.length > 0 ? null : 'Yok',
                        badges: mockPatient.allergies,
                      },
                      { label: 'Baslangic Tarihi', value: mockPatient.startDate },
                      {
                        label: 'Sonraki Randevu',
                        value: mockPatient.nextAppointment,
                      },
                    ].map((row, idx) => (
                      <div key={row.label}>
                        <div className="flex items-center justify-between py-3">
                          <span className="text-sm text-muted-foreground">{row.label}</span>
                          {row.badges ? (
                            <div className="flex gap-1.5">
                              {row.badges.map((a) => (
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
                data={patientWeightData}
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
                data={patientCalorieData}
                title="Haftalik Kalori Alimi"
              />
              <MacroPieChart
                data={patientMacroData}
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
                <div className="space-y-2">
                  {mockMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-lg">
                        {getMealTypeIcon(meal.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{meal.type}</p>
                          <Badge
                            variant={meal.status === 'verified' ? 'success' : 'warning'}
                          >
                            {meal.status === 'verified' ? 'Onayli' : 'Bekliyor'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{meal.items}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold tabular-nums">
                          {meal.calories} kcal
                        </p>
                        <p className="text-xs text-muted-foreground">{meal.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                      getAdherenceColor(mockPatient.adherenceScore)
                    )}
                  >
                    %{mockPatient.adherenceScore}
                  </span>
                </div>
                <Progress value={mockPatient.adherenceScore} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Hasta son 7 gunde ortalama %{mockPatient.adherenceScore} oraninda plana uyum
                  gostermistir.
                </p>
              </div>

              <Separator />

              {/* Plan macro pie chart */}
              <MacroPieChart
                data={patientMacroData}
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
                  <p className="text-2xl font-bold tabular-nums">{mockPatient.weightKg} kg</p>
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
                data={patientWeightData}
                title="Kilo Ilerleme Grafigi"
              />
              <WaterIntakeChart
                data={patientWaterData}
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
              <div className="space-y-2">
                {mockAppointments.map((apt) => {
                  const isUpcoming = apt.status === 'upcoming'
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
                        <p className="text-sm font-medium">{apt.type}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {apt.date} &middot; {apt.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline">
                          {apt.mode === 'Video' ? (
                            <Video className="h-3 w-3 mr-1" />
                          ) : (
                            <MapPin className="h-3 w-3 mr-1" />
                          )}
                          {apt.mode}
                        </Badge>
                        <Badge variant={isUpcoming ? 'info' : 'success'}>
                          {isUpcoming ? 'Yaklasan' : 'Tamamlandi'}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ─── Mesajlar ─────────────────────────────────────── */}
        {activeTab === 'messages' && (
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
              <div className="space-y-3">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex',
                      msg.isPatient ? 'justify-start' : 'justify-end'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-2.5',
                        msg.isPatient
                          ? 'bg-secondary rounded-bl-sm'
                          : 'bg-primary text-primary-foreground rounded-br-sm'
                      )}
                    >
                      <p className="text-sm font-medium mb-0.5">
                        {msg.isPatient ? msg.from : 'Siz'}
                      </p>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p
                        className={cn(
                          'text-[11px] mt-1 tabular-nums',
                          msg.isPatient
                            ? 'text-muted-foreground'
                            : 'text-primary-foreground/70'
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

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
        )}

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
