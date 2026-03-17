import { useState, useMemo, useEffect } from 'react'
import {
  CalendarDays,
  Plus,
  Clock,
  Video,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  List,
  CalendarRange,
  User,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
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
import { Textarea } from '@/components/ui/textarea'
import { PageContainer } from '@/components/shared/page-container'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'

/* ─── Types ─────────────────────────────────────── */

interface AppointmentItem {
  id: string
  patientName: string
  date: string
  time: string
  endTime: string
  type: 'kontrol' | 'ilk görüşme' | 'takip' | 'acil'
  mode: 'video' | 'in_person' | 'phone'
  status: 'upcoming' | 'completed' | 'cancelled'
  notes?: string
}

/* ─── Mock data ─────────────────────────────────── */

const mockAppointments: AppointmentItem[] = [
  { id: '1', patientName: 'Ayşe Yılmaz', date: '2026-03-03', time: '10:00', endTime: '10:45', type: 'takip', mode: 'video', status: 'upcoming' },
  { id: '2', patientName: 'Mehmet Kaya', date: '2026-03-03', time: '11:00', endTime: '11:30', type: 'kontrol', mode: 'in_person', status: 'upcoming' },
  { id: '3', patientName: 'Fatma Demir', date: '2026-03-03', time: '14:00', endTime: '14:45', type: 'ilk görüşme', mode: 'video', status: 'upcoming' },
  { id: '4', patientName: 'Zeynep Çelik', date: '2026-03-04', time: '09:00', endTime: '09:45', type: 'takip', mode: 'phone', status: 'upcoming' },
  { id: '5', patientName: 'Burak Şahin', date: '2026-03-04', time: '11:00', endTime: '11:45', type: 'ilk görüşme', mode: 'video', status: 'upcoming' },
  { id: '6', patientName: 'Elif Arslan', date: '2026-02-27', time: '10:00', endTime: '10:45', type: 'takip', mode: 'video', status: 'completed' },
  { id: '7', patientName: 'Ali Öztürk', date: '2026-02-26', time: '14:00', endTime: '14:30', type: 'kontrol', mode: 'in_person', status: 'completed' },
  { id: '8', patientName: 'Hasan Yıldız', date: '2026-02-25', time: '09:00', endTime: '09:45', type: 'acil', mode: 'video', status: 'cancelled' },
]

/* ─── Calendar config ───────────────────────────── */

const weekDayLabels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const weekDates = ['02', '03', '04', '05', '06', '07', '08']
const weekMonthPrefix = '2026-03-'
const weekLabel = '2 Mart - 8 Mart 2026'
const todayDate = '03'
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

/* ─── Color-coded appointment types ─────────────── */

const typeColors: Record<AppointmentItem['type'], {
  bg: string
  border: string
  text: string
  dot: string
  badge: string
}> = {
  kontrol: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
  },
  'ilk görüşme': {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
  },
  takip: {
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
    text: 'text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800',
  },
  acil: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
  },
}

const typeLabel: Record<AppointmentItem['type'], string> = {
  kontrol: 'Kontrol',
  'ilk görüşme': 'İlk Görüşme',
  takip: 'Takip',
  acil: 'Acil',
}

/* ─── Mode helpers ──────────────────────────────── */

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

/* ─── Status helpers ────────────────────────────── */

const statusConfig = {
  upcoming: { label: 'Yaklaşan', variant: 'info' as const },
  completed: { label: 'Tamamlandı', variant: 'success' as const },
  cancelled: { label: 'İptal', variant: 'destructive' as const },
}

/* ─── Utility: initials ─────────────────────────── */

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

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

/* ─── Format date for display ───────────────────── */

function formatDate(dateStr: string): string {
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
  const [, m, d] = dateStr.split('-')
  return `${parseInt(d)} ${months[parseInt(m) - 1]}`
}

/* ─── Main component ────────────────────────────── */

export default function AppointmentsPage() {
  const [view, setView] = useState<'week' | 'list'>('week')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  const upcomingAppointments = useMemo(
    () => mockAppointments.filter((a) => a.status === 'upcoming'),
    []
  )
  const pastAppointments = useMemo(
    () => mockAppointments.filter((a) => a.status !== 'upcoming'),
    []
  )

  return (
    <PageContainer
      title="Randevular"
      description="Randevularınızı yönetin ve planlayın."
      actions={
        <div className="flex items-center gap-2">
          {/* View toggle button group */}
          <div className="flex items-center gap-0.5 rounded-lg border bg-muted p-0.5">
            <Button
              variant={view === 'week' ? 'secondary' : 'ghost'}
              size="icon-xs"
              onClick={() => setView('week')}
              aria-label="Haftalık görünüm"
            >
              <CalendarRange className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon-xs"
              onClick={() => setView('list')}
              aria-label="Liste görünüm"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Create appointment dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" />
                Yeni Randevu
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Yeni Randevu Oluştur</DialogTitle>
                <DialogDescription>
                  Hasta ile yeni bir randevu planlayın.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="apt-patient">
                    <User className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    Hasta
                  </Label>
                  <Select>
                    <SelectTrigger id="apt-patient">
                      <SelectValue placeholder="Hasta seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ayşe Yılmaz</SelectItem>
                      <SelectItem value="2">Mehmet Kaya</SelectItem>
                      <SelectItem value="3">Fatma Demir</SelectItem>
                      <SelectItem value="4">Zeynep Çelik</SelectItem>
                      <SelectItem value="5">Burak Şahin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apt-date">
                      <CalendarDays className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      Tarih
                    </Label>
                    <Input id="apt-date" type="date" defaultValue="2026-03-05" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apt-time">
                      <Clock className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      Saat
                    </Label>
                    <Input id="apt-time" type="time" defaultValue="10:00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Randevu Tipi</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tip seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kontrol">Kontrol</SelectItem>
                        <SelectItem value="ilk görüşme">İlk Görüşme</SelectItem>
                        <SelectItem value="takip">Takip</SelectItem>
                        <SelectItem value="acil">Acil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Görüşme Şekli</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Şekil seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">
                          <Video className="inline h-3.5 w-3.5 mr-1.5" />
                          Video Görüşme
                        </SelectItem>
                        <SelectItem value="in_person">
                          <MapPin className="inline h-3.5 w-3.5 mr-1.5" />
                          Yüz Yüze
                        </SelectItem>
                        <SelectItem value="phone">
                          <Phone className="inline h-3.5 w-3.5 mr-1.5" />
                          Telefon
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt-notes">
                    <FileText className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    Notlar (opsiyonel)
                  </Label>
                  <Textarea id="apt-notes" placeholder="Randevu hakkında not ekleyin..." rows={2} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  İptal
                </Button>
                <Button onClick={() => setDialogOpen(false)}>
                  <Plus className="h-3.5 w-3.5" />
                  Oluştur
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {/* ─── Type legend ────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {(Object.keys(typeColors) as AppointmentItem['type'][]).map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-full', typeColors[type].dot)} />
            <span className="text-xs text-muted-foreground">{typeLabel[type]}</span>
          </div>
        ))}
      </div>

      {/* ─── Skeleton loading ───────────────────── */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-40" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border px-4 py-3">
                <Skeleton className="h-10 w-1 rounded-full shrink-0" />
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-20 hidden sm:block" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20 rounded-full hidden md:block" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
      <Tabs value={view} onValueChange={(v) => setView(v as 'week' | 'list')}>
        {/* Hidden tabs list - controlled by the button group above */}
        <TabsList className="hidden">
          <TabsTrigger value="week">Haftalık</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
        </TabsList>

        {/* ─── Week view ──────────────────────── */}
        <TabsContent value="week">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Haftalık Takvim</CardTitle>
              </div>
              <CardAction>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-xs" aria-label="Önceki hafta">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground px-2 tabular-nums">
                    {weekLabel}
                  </span>
                  <Button variant="ghost" size="icon-xs" aria-label="Sonraki hafta">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <div className="min-w-[720px]">
                  {/* Day headers */}
                  <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-1 mb-1">
                    <div />
                    {weekDayLabels.map((day, i) => {
                      const isToday = weekDates[i] === todayDate
                      return (
                        <div
                          key={day}
                          className={cn(
                            'flex flex-col items-center rounded-lg py-2 transition-colors duration-[var(--duration-fast)]',
                            isToday && 'bg-primary/8'
                          )}
                        >
                          <span className={cn(
                            'text-[11px] font-medium uppercase tracking-wider',
                            isToday ? 'text-primary' : 'text-muted-foreground'
                          )}>
                            {day}
                          </span>
                          <span className={cn(
                            'mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-colors duration-[var(--duration-fast)]',
                            isToday
                              ? 'bg-primary text-primary-foreground'
                              : 'text-foreground'
                          )}>
                            {weekDates[i]}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Time grid */}
                  <div className="relative">
                    {hours.map((hour, hourIdx) => (
                      <div
                        key={hour}
                        className={cn(
                          'grid grid-cols-[60px_repeat(7,1fr)] gap-1 min-h-[52px]',
                          hourIdx === 0 && 'border-t'
                        )}
                      >
                        <div className="flex items-start justify-end pr-3 -mt-2.5">
                          <span className="text-[11px] text-muted-foreground tabular-nums font-medium">
                            {hour}
                          </span>
                        </div>
                        {weekDayLabels.map((_, dayIdx) => {
                          const dateStr = `${weekMonthPrefix}${weekDates[dayIdx]}`
                          const isToday = weekDates[dayIdx] === todayDate
                          const apt = mockAppointments.find(
                            (a) => a.date === dateStr && a.time === hour && a.status === 'upcoming'
                          )
                          const colors = apt ? typeColors[apt.type] : null
                          return (
                            <div
                              key={dayIdx}
                              className={cn(
                                'relative border-t min-h-[52px] rounded-md p-0.5 transition-colors duration-[var(--duration-fast)]',
                                isToday && 'bg-primary/[0.03]',
                                !apt && 'hover:bg-secondary/50 cursor-pointer'
                              )}
                            >
                              {apt && colors && (
                                <div
                                  className={cn(
                                    'h-full rounded-md border px-2 py-1.5 cursor-pointer transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] hover:shadow-sm hover:scale-[1.02]',
                                    colors.bg,
                                    colors.border
                                  )}
                                >
                                  <p className={cn('text-[11px] font-semibold truncate leading-tight', colors.text)}>
                                    {apt.patientName}
                                  </p>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Clock className={cn('h-2.5 w-2.5', colors.text)} />
                                    <span className={cn('text-[10px] tabular-nums', colors.text)}>
                                      {apt.time}–{apt.endTime}
                                    </span>
                                  </div>
                                  {apt.mode === 'video' && (
                                    <Video className={cn('h-2.5 w-2.5 mt-0.5', colors.text)} />
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── List view ──────────────────────── */}
        <TabsContent value="list" className="space-y-6">
          {/* Upcoming appointments */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <CardTitle className="text-base">Yaklaşan Randevular</CardTitle>
              </div>
              <CardAction>
                <Badge variant="info">{upcomingAppointments.length} randevu</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 animate-in-stagger">
                {upcomingAppointments.map((apt) => (
                  <AppointmentRow key={apt.id} appointment={apt} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Past appointments */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <CardTitle className="text-base">Geçmiş Randevular</CardTitle>
              </div>
              <CardAction>
                <Badge variant="secondary">{pastAppointments.length} randevu</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pastAppointments.map((apt) => (
                  <AppointmentRow key={apt.id} appointment={apt} isPast />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}

/* ─── Appointment row component ─────────────────── */

function AppointmentRow({
  appointment: apt,
  isPast = false,
}: {
  appointment: AppointmentItem
  isPast?: boolean
}) {
  const ModeIcon = modeIcons[apt.mode]
  const colors = typeColors[apt.type]
  const status = statusConfig[apt.status]

  return (
    <div
      className={cn(
        'group flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-quart)]',
        isPast
          ? 'opacity-60 hover:opacity-80'
          : 'hover:shadow-sm hover:border-primary/20 cursor-pointer'
      )}
    >
      {/* Type color indicator */}
      <div className={cn('h-10 w-1 shrink-0 rounded-full', colors.dot)} />

      {/* Avatar */}
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className={cn('text-xs font-semibold', getInitialColor(apt.patientName))}>
          {getInitials(apt.patientName)}
        </AvatarFallback>
      </Avatar>

      {/* Patient info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight truncate">{apt.patientName}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={cn('inline-flex items-center rounded-md border px-1.5 py-0 text-[10px] font-medium', colors.badge)}>
            {typeLabel[apt.type]}
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
        <CalendarDays className="h-3.5 w-3.5" />
        <span className="tabular-nums">{formatDate(apt.date)}</span>
      </div>

      {/* Time */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
        <Clock className="h-3.5 w-3.5" />
        <span className="tabular-nums">{apt.time}–{apt.endTime}</span>
      </div>

      {/* Mode badge */}
      <Badge variant="outline" className="hidden md:inline-flex shrink-0 gap-1">
        <ModeIcon className="h-3 w-3" />
        {modeLabels[apt.mode]}
      </Badge>

      {/* Status badge */}
      <Badge variant={status.variant} className="shrink-0">
        {status.label}
      </Badge>

      {/* Video call button for upcoming video appointments */}
      {!isPast && apt.mode === 'video' && apt.status === 'upcoming' && (
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30 dark:hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)]"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Video className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Katıl</span>
        </Button>
      )}
    </div>
  )
}
