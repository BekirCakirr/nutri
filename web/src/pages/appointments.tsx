import { useState } from 'react'
import {
  CalendarDays,
  Plus,
  Clock,
  Video,
  MapPin,
  Phone,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface AppointmentItem {
  id: string
  patientName: string
  date: string
  time: string
  endTime: string
  type: string
  mode: 'video' | 'in_person' | 'phone'
  status: 'upcoming' | 'completed' | 'cancelled'
  notes?: string
}

const mockAppointments: AppointmentItem[] = [
  { id: '1', patientName: 'Ayşe Yılmaz', date: '2026-02-25', time: '10:00', endTime: '10:45', type: 'Takip', mode: 'video', status: 'upcoming' },
  { id: '2', patientName: 'Mehmet Kaya', date: '2026-02-25', time: '11:00', endTime: '11:30', type: 'Plan Değerlendirme', mode: 'in_person', status: 'upcoming' },
  { id: '3', patientName: 'Fatma Demir', date: '2026-02-25', time: '14:00', endTime: '14:45', type: 'İlk Görüşme', mode: 'video', status: 'upcoming' },
  { id: '4', patientName: 'Zeynep Çelik', date: '2026-02-26', time: '09:00', endTime: '09:45', type: 'Takip', mode: 'phone', status: 'upcoming' },
  { id: '5', patientName: 'Burak Şahin', date: '2026-02-26', time: '11:00', endTime: '11:45', type: 'İlk Görüşme', mode: 'video', status: 'upcoming' },
  { id: '6', patientName: 'Elif Arslan', date: '2026-02-20', time: '10:00', endTime: '10:45', type: 'Takip', mode: 'video', status: 'completed' },
  { id: '7', patientName: 'Ali Öztürk', date: '2026-02-19', time: '14:00', endTime: '14:30', type: 'Plan Değerlendirme', mode: 'in_person', status: 'completed' },
  { id: '8', patientName: 'Hasan Yıldız', date: '2026-02-18', time: '09:00', endTime: '09:45', type: 'Takip', mode: 'video', status: 'cancelled' },
]

const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const weekDates = ['23', '24', '25', '26', '27', '28', '1']
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

const modeIcons = {
  video: Video,
  in_person: MapPin,
  phone: Phone,
}

const modeLabels = {
  video: 'Video',
  in_person: 'Yüz yüze',
  phone: 'Telefon',
}

const statusBadge = {
  upcoming: { label: 'Yaklaşan', variant: 'default' as const },
  completed: { label: 'Tamamlandı', variant: 'secondary' as const },
  cancelled: { label: 'İptal', variant: 'destructive' as const },
}

export default function AppointmentsPage() {
  const [view, setView] = useState('week')
  const [dialogOpen, setDialogOpen] = useState(false)

  const upcomingAppointments = mockAppointments.filter(a => a.status === 'upcoming')
  const pastAppointments = mockAppointments.filter(a => a.status !== 'upcoming')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Randevular</h1>
          <p className="text-muted-foreground">Randevularınızı yönetin ve planlayın.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Randevu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Randevu Oluştur</DialogTitle>
              <DialogDescription>Hasta ile yeni bir randevu planlayın.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Hasta</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Hasta seçin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ayşe Yılmaz</SelectItem>
                    <SelectItem value="2">Mehmet Kaya</SelectItem>
                    <SelectItem value="3">Fatma Demir</SelectItem>
                    <SelectItem value="5">Zeynep Çelik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tarih</Label>
                  <Input type="date" defaultValue="2026-02-27" />
                </div>
                <div className="space-y-2">
                  <Label>Saat</Label>
                  <Input type="time" defaultValue="10:00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Randevu Tipi</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Tip seçin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow_up">Takip</SelectItem>
                    <SelectItem value="initial">İlk Görüşme</SelectItem>
                    <SelectItem value="plan_review">Plan Değerlendirme</SelectItem>
                    <SelectItem value="progress">İlerleme Kontrolü</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Görüşme Şekli</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Şekil seçin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Görüşme</SelectItem>
                    <SelectItem value="in_person">Yüz Yüze</SelectItem>
                    <SelectItem value="phone">Telefon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
              <Button onClick={() => setDialogOpen(false)}>Oluştur</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="week">Haftalık</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
        </TabsList>

        {/* Week View */}
        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle>Haftalık Takvim</CardTitle>
              <CardDescription>23 Şubat - 1 Mart 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  {/* Day Headers */}
                  <div className="grid grid-cols-8 gap-1 mb-2">
                    <div className="p-2 text-xs text-muted-foreground" />
                    {weekDays.map((day, i) => (
                      <div key={day} className={`p-2 text-center rounded ${weekDates[i] === '25' ? 'bg-primary/10' : ''}`}>
                        <p className="text-xs text-muted-foreground">{day}</p>
                        <p className={`text-sm font-medium ${weekDates[i] === '25' ? 'text-primary' : ''}`}>{weekDates[i]}</p>
                      </div>
                    ))}
                  </div>
                  {/* Time Slots */}
                  {hours.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 gap-1 min-h-[48px]">
                      <div className="p-1 text-xs text-muted-foreground text-right pr-2 pt-1">{hour}</div>
                      {weekDays.map((_, dayIdx) => {
                        const dateStr = `2026-02-${weekDates[dayIdx].padStart(2, '0')}`
                        const apt = mockAppointments.find(a => a.date === dateStr && a.time === hour && a.status === 'upcoming')
                        return (
                          <div key={dayIdx} className="border rounded-sm min-h-[48px] p-0.5">
                            {apt && (
                              <div className="bg-primary/10 border border-primary/20 rounded p-1 text-[10px]">
                                <p className="font-medium truncate">{apt.patientName}</p>
                                <p className="text-muted-foreground">{apt.time}-{apt.endTime}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yaklaşan Randevular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => {
                  const ModeIcon = modeIcons[apt.mode]
                  return (
                    <div key={apt.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xs">
                          {apt.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.type}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{apt.time} - {apt.endTime}</span>
                      </div>
                      <Badge variant="outline">
                        <ModeIcon className="h-3 w-3 mr-1" />
                        {modeLabels[apt.mode]}
                      </Badge>
                      <Badge variant={statusBadge[apt.status].variant}>
                        {statusBadge[apt.status].label}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Geçmiş Randevular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pastAppointments.map((apt) => {
                  const ModeIcon = modeIcons[apt.mode]
                  return (
                    <div key={apt.id} className="flex items-center gap-4 p-3 rounded-lg border opacity-70">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xs">
                          {apt.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.type}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{apt.time}</span>
                      </div>
                      <Badge variant="outline">
                        <ModeIcon className="h-3 w-3 mr-1" />
                        {modeLabels[apt.mode]}
                      </Badge>
                      <Badge variant={statusBadge[apt.status].variant}>
                        {statusBadge[apt.status].label}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
