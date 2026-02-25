import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Printer,
  TrendingDown,
  Activity,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const mockReport = {
  patient: {
    name: 'Ayşe Yılmaz',
    age: 32,
    goal: 'Kilo Verme',
    startWeight: 76,
    currentWeight: 72,
    targetWeight: 65,
    bmi: 26.4,
    plan: 'Kilo Verme Programı',
  },
  period: '18 Şubat - 25 Şubat 2026',
  adherence: {
    overall: 87,
    calories: 85,
    protein: 92,
    carbs: 80,
    fat: 88,
  },
  mealCompliance: [
    { day: 'Pazartesi', breakfast: true, lunch: true, dinner: true, snack: true },
    { day: 'Salı', breakfast: true, lunch: true, dinner: true, snack: false },
    { day: 'Çarşamba', breakfast: true, lunch: false, dinner: true, snack: true },
    { day: 'Perşembe', breakfast: true, lunch: true, dinner: true, snack: true },
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
    'Su tüketimini günlük 2.5 litreye çıkarmaya çalışın.',
    'Öğle yemeklerinde protein miktarını artırın.',
    'Hafta sonu kahvaltılarını atlamaktan kaçının.',
    'Akşam yemeklerinde karbonhidrat miktarını azaltın.',
    'Egzersiz sıklığını haftada 5 güne çıkarın.',
  ],
}

export default function PatientReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Hasta Raporu</h1>
            <p className="text-muted-foreground">{mockReport.period}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            PDF İndir
          </Button>
        </div>
      </div>

      {/* Patient Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">AY</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{mockReport.patient.name}</h2>
              <p className="text-muted-foreground">{mockReport.patient.age} yaş &middot; {mockReport.patient.goal}</p>
              <p className="text-sm text-muted-foreground">Plan: {mockReport.patient.plan}</p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Başlangıç</p>
                <p className="text-lg font-bold">{mockReport.patient.startWeight} kg</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mevcut</p>
                <p className="text-lg font-bold text-green-600">{mockReport.patient.currentWeight} kg</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hedef</p>
                <p className="text-lg font-bold">{mockReport.patient.targetWeight} kg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weight Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Kilo İlerlemesi</CardTitle>
          <CardDescription>Son 3 aylık kilo değişimi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted/30 rounded-lg border-2 border-dashed flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <TrendingDown className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Kilo Grafiği</p>
              <p className="text-xs">76 kg &rarr; 72 kg (-4 kg, %5.3 azalma)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adherence Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Beslenme Uyumu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">Genel</span>
            <Progress value={mockReport.adherence.overall} className="flex-1" />
            <span className="text-sm font-medium w-10 text-right">%{mockReport.adherence.overall}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">Kalori</span>
            <Progress value={mockReport.adherence.calories} className="flex-1" />
            <span className="text-sm font-medium w-10 text-right">%{mockReport.adherence.calories}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">Protein</span>
            <Progress value={mockReport.adherence.protein} className="flex-1" />
            <span className="text-sm font-medium w-10 text-right">%{mockReport.adherence.protein}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">Karbonhidrat</span>
            <Progress value={mockReport.adherence.carbs} className="flex-1" />
            <span className="text-sm font-medium w-10 text-right">%{mockReport.adherence.carbs}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">Yağ</span>
            <Progress value={mockReport.adherence.fat} className="flex-1" />
            <span className="text-sm font-medium w-10 text-right">%{mockReport.adherence.fat}</span>
          </div>
        </CardContent>
      </Card>

      {/* Meal Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Öğün Uyumu</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gün</TableHead>
                <TableHead className="text-center">Kahvaltı</TableHead>
                <TableHead className="text-center">Öğle</TableHead>
                <TableHead className="text-center">Akşam</TableHead>
                <TableHead className="text-center">Ara Öğün</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReport.mealCompliance.map((day) => (
                <TableRow key={day.day}>
                  <TableCell className="font-medium">{day.day}</TableCell>
                  <TableCell className="text-center">
                    {day.breakfast ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {day.lunch ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {day.dinner ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {day.snack ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Öneriler</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {mockReport.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-primary">{i + 1}</span>
                </div>
                <p className="text-sm">{rec}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
