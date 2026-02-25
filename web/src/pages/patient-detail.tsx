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
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

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

export default function PatientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/patients')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg">
              {mockPatient.fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{mockPatient.fullName}</h1>
              <Badge variant="default">Aktif</Badge>
            </div>
            <p className="text-muted-foreground">
              {mockPatient.age} yaş &middot; {mockPatient.gender} &middot; {mockPatient.goal}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/messages/${id}`)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Mesaj Gönder
          </Button>
          <Button onClick={() => navigate(`/plans/create/${id}`)}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Plan Oluştur
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview"><User className="h-4 w-4 mr-1" /> Genel</TabsTrigger>
          <TabsTrigger value="nutrition"><Apple className="h-4 w-4 mr-1" /> Beslenme</TabsTrigger>
          <TabsTrigger value="plan"><ClipboardList className="h-4 w-4 mr-1" /> Plan</TabsTrigger>
          <TabsTrigger value="tracking"><Activity className="h-4 w-4 mr-1" /> Takip</TabsTrigger>
          <TabsTrigger value="appointments"><CalendarDays className="h-4 w-4 mr-1" /> Randevular</TabsTrigger>
          <TabsTrigger value="messages"><MessageSquare className="h-4 w-4 mr-1" /> Mesajlar</TabsTrigger>
          <TabsTrigger value="reports"><FileText className="h-4 w-4 mr-1" /> Raporlar</TabsTrigger>
        </TabsList>

        {/* Genel Bakış */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Kilo</p>
                <p className="text-2xl font-bold">{mockPatient.weightKg} kg</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Boy</p>
                <p className="text-2xl font-bold">{mockPatient.heightCm} cm</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">BMI</p>
                <p className="text-2xl font-bold">{mockPatient.bmi}</p>
                <p className="text-xs text-orange-500">Fazla Kilolu</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Uyum Skoru</p>
                <p className="text-2xl font-bold">%{mockPatient.adherenceScore}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kişisel Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground">E-posta</span><span>{mockPatient.email}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-muted-foreground">Telefon</span><span>{mockPatient.phone}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-muted-foreground">Beslenme Tercihi</span><span>{mockPatient.dietaryPreference}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-muted-foreground">Alerjiler</span><span>{mockPatient.allergies.join(', ')}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-muted-foreground">Vücut Yağ Oranı</span><span>%{mockPatient.bodyFatPercentage}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-muted-foreground">Günlük Kalori Hedefi</span><span>{mockPatient.dailyCalorieTarget} kcal</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kilo Grafiği</CardTitle>
                <CardDescription>Son 3 aylık kilo değişimi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed">
                  <div className="text-center text-muted-foreground">
                    <TrendingDown className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Kilo Grafiği Alanı</p>
                    <p className="text-xs">76 kg &rarr; 72 kg (-4 kg)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Beslenme */}
        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Son Öğünler</CardTitle>
              <CardDescription>Hastanın son kaydettiği yemekler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockMeals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <Apple className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{meal.type}</p>
                        <p className="text-sm text-muted-foreground">{meal.items}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{meal.calories} kcal</p>
                      <p className="text-xs text-muted-foreground">{meal.date}</p>
                    </div>
                    <Badge variant={meal.status === 'verified' ? 'default' : 'outline'}>
                      {meal.status === 'verified' ? 'Onaylı' : 'Bekliyor'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan */}
        <TabsContent value="plan" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Aktif Diyet Planı</CardTitle>
                  <CardDescription>Kilo Verme Programı - Hafta 8/12</CardDescription>
                </div>
                <Badge>Aktif</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Kalori</p>
                  <p className="font-bold">1800 kcal</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="font-bold">120g</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Karbonhidrat</p>
                  <p className="font-bold">200g</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Yağ</p>
                  <p className="font-bold">60g</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Plan Uyumu</p>
                <div className="flex items-center gap-2">
                  <Progress value={87} className="flex-1" />
                  <span className="text-sm font-medium">%87</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/plans/create/${id}`)}>
                Planı Düzenle
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Takip */}
        <TabsContent value="tracking" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base">Kilo Takibi</CardTitle>
                </div>
                <p className="text-3xl font-bold">{mockPatient.weightKg} kg</p>
                <p className="text-sm text-green-600">-0.5 kg bu hafta</p>
                <p className="text-xs text-muted-foreground mt-1">Hedef: 65 kg</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Droplets className="h-5 w-5 text-cyan-500" />
                  <CardTitle className="text-base">Su Tüketimi</CardTitle>
                </div>
                <p className="text-3xl font-bold">1.8 L</p>
                <Progress value={72} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Hedef: 2.5 L (%72)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Dumbbell className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-base">Egzersiz</CardTitle>
                </div>
                <p className="text-3xl font-bold">4 / 5</p>
                <p className="text-sm text-muted-foreground">Bu hafta tamamlanan</p>
                <p className="text-xs text-muted-foreground mt-1">Toplam 220 dk</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Randevular */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Randevu Geçmişi</CardTitle>
                <Button size="sm" onClick={() => navigate('/appointments')}>Yeni Randevu</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{apt.type}</p>
                        <p className="text-sm text-muted-foreground">{apt.date} - {apt.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{apt.mode}</Badge>
                      <Badge variant={apt.status === 'upcoming' ? 'default' : 'secondary'}>
                        {apt.status === 'upcoming' ? 'Yaklaşan' : 'Tamamlandı'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mesajlar */}
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Son Mesajlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isPatient ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.isPatient ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isPatient ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate(`/messages/${id}`)}>
                Tüm Mesajları Gör
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raporlar */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/reports/patient/${id}`)}>
              <CardContent className="p-6">
                <FileText className="h-8 w-8 text-blue-500 mb-3" />
                <h3 className="font-semibold">Haftalık Rapor</h3>
                <p className="text-sm text-muted-foreground">Son haftalık beslenme ve uyum raporu</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/reports/patient/${id}`)}>
              <CardContent className="p-6">
                <FileText className="h-8 w-8 text-green-500 mb-3" />
                <h3 className="font-semibold">Aylık Rapor</h3>
                <p className="text-sm text-muted-foreground">Aylık ilerleme ve genel değerlendirme</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
