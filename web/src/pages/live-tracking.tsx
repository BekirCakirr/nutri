import { useState } from 'react'
import {
  Wifi,
  WifiOff,
  Droplets,
  UtensilsCrossed,
  AlertTriangle,
  Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  { id: '1', name: 'Ayşe Yılmaz', todayCalories: 1450, calorieTarget: 1800, waterIntakeMl: 1800, waterTargetMl: 2500, lastMealTime: '12:30', lastMealType: 'Öğle', alertLevel: 'none', isOnline: true },
  { id: '2', name: 'Mehmet Kaya', todayCalories: 2100, calorieTarget: 1600, waterIntakeMl: 1200, waterTargetMl: 2000, lastMealTime: '13:15', lastMealType: 'Öğle', alertLevel: 'high', alertReason: 'Kalori hedefi aşıldı', isOnline: true },
  { id: '3', name: 'Fatma Demir', todayCalories: 1200, calorieTarget: 2200, waterIntakeMl: 2000, waterTargetMl: 2500, lastMealTime: '11:00', lastMealType: 'Ara Öğün', alertLevel: 'none', isOnline: true },
  { id: '4', name: 'Ali Öztürk', todayCalories: 800, calorieTarget: 1800, waterIntakeMl: 500, waterTargetMl: 2000, lastMealTime: '08:30', lastMealType: 'Kahvaltı', alertLevel: 'medium', alertReason: 'Su tüketimi düşük', isOnline: false },
  { id: '5', name: 'Zeynep Çelik', todayCalories: 1600, calorieTarget: 1700, waterIntakeMl: 2200, waterTargetMl: 2500, lastMealTime: '14:00', lastMealType: 'Öğle', alertLevel: 'none', isOnline: true },
  { id: '6', name: 'Hasan Yıldız', todayCalories: 0, calorieTarget: 2000, waterIntakeMl: 0, waterTargetMl: 2500, lastMealTime: '-', lastMealType: '-', alertLevel: 'high', alertReason: 'Bugün hiç kayıt yok', isOnline: false },
  { id: '7', name: 'Elif Arslan', todayCalories: 1900, calorieTarget: 2000, waterIntakeMl: 1800, waterTargetMl: 2000, lastMealTime: '13:45', lastMealType: 'Öğle', alertLevel: 'none', isOnline: true },
  { id: '8', name: 'Burak Şahin', todayCalories: 1100, calorieTarget: 2400, waterIntakeMl: 800, waterTargetMl: 3000, lastMealTime: '10:00', lastMealType: 'Kahvaltı', alertLevel: 'low', alertReason: 'Öğle yemeği atlanmış olabilir', isOnline: true },
]

const alertColorMap = {
  none: '',
  low: 'border-yellow-300',
  medium: 'border-orange-400',
  high: 'border-red-500',
}

const alertBadgeMap = {
  none: null,
  low: { label: 'Düşük', variant: 'outline' as const },
  medium: { label: 'Orta', variant: 'secondary' as const },
  high: { label: 'Yüksek', variant: 'destructive' as const },
}

export default function LiveTrackingPage() {
  const [alertFilter, setAlertFilter] = useState('all')
  const isConnected = true

  const filtered = mockLivePatients.filter((p) => {
    if (alertFilter === 'all') return true
    return p.alertLevel === alertFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Canlı Takip</h1>
          <p className="text-muted-foreground">Hastalarınızın anlık beslenme durumunu izleyin.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Bağlı</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">Bağlantı kesildi</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={alertFilter} onValueChange={setAlertFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Uyarı Seviyesi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="high">Yüksek</SelectItem>
                <SelectItem value="medium">Orta</SelectItem>
                <SelectItem value="low">Düşük</SelectItem>
                <SelectItem value="none">Uyarı Yok</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Çevrimiçi Hasta</p>
            <p className="text-2xl font-bold">{mockLivePatients.filter(p => p.isOnline).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Yüksek Uyarı</p>
            <p className="text-2xl font-bold text-red-500">{mockLivePatients.filter(p => p.alertLevel === 'high').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Orta Uyarı</p>
            <p className="text-2xl font-bold text-orange-500">{mockLivePatients.filter(p => p.alertLevel === 'medium').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Sorunsuz</p>
            <p className="text-2xl font-bold text-green-500">{mockLivePatients.filter(p => p.alertLevel === 'none').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((patient) => {
          const caloriePercent = Math.min(Math.round((patient.todayCalories / patient.calorieTarget) * 100), 100)
          const waterPercent = Math.min(Math.round((patient.waterIntakeMl / patient.waterTargetMl) * 100), 100)
          const alertBadge = alertBadgeMap[patient.alertLevel]

          return (
            <Card key={patient.id} className={`${alertColorMap[patient.alertLevel]} ${patient.alertLevel !== 'none' ? 'border-2' : ''}`}>
              <CardContent className="p-4 space-y-3">
                {/* Patient Info */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${patient.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{patient.name}</p>
                    {alertBadge && (
                      <Badge variant={alertBadge.variant} className="text-[10px] h-5 mt-0.5">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {alertBadge.label}
                      </Badge>
                    )}
                  </div>
                </div>

                {patient.alertReason && (
                  <p className="text-xs text-destructive">{patient.alertReason}</p>
                )}

                {/* Calories */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Kalori</span>
                    <span>{patient.todayCalories} / {patient.calorieTarget} kcal</span>
                  </div>
                  <Progress
                    value={caloriePercent}
                    className={`h-2 ${patient.todayCalories > patient.calorieTarget ? '[&>div]:bg-red-500' : ''}`}
                  />
                </div>

                {/* Water */}
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-cyan-500" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Su</span>
                      <span>{(patient.waterIntakeMl / 1000).toFixed(1)} / {(patient.waterTargetMl / 1000).toFixed(1)} L</span>
                    </div>
                    <Progress value={waterPercent} className="h-1.5" />
                  </div>
                </div>

                {/* Last Meal */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <UtensilsCrossed className="h-3 w-3" />
                  <span>Son: {patient.lastMealType} - {patient.lastMealTime}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
