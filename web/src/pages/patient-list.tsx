import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageContainer } from '@/components/shared/page-container'
import { cn } from '@/lib/utils'

interface Patient {
  id: string
  firstName: string
  lastName: string
  email: string
  age: number
  gender: 'male' | 'female'
  status: 'active' | 'inactive' | 'onboarding' | 'paused'
  adherence: number
  lastVisit: string
  nextAppointment: string | null
  weight: number
  targetWeight: number
  bmi: number
}

const mockPatients: Patient[] = [
  { id: '1', firstName: 'Ayşe', lastName: 'Yılmaz', email: 'ayse@email.com', age: 32, gender: 'female', status: 'active', adherence: 85, lastVisit: '2025-01-20', nextAppointment: '2025-01-25', weight: 68, targetWeight: 62, bmi: 24.2 },
  { id: '2', firstName: 'Mehmet', lastName: 'Kaya', email: 'mehmet@email.com', age: 45, gender: 'male', status: 'active', adherence: 72, lastVisit: '2025-01-18', nextAppointment: '2025-01-26', weight: 92, targetWeight: 85, bmi: 28.1 },
  { id: '3', firstName: 'Fatma', lastName: 'Demir', email: 'fatma@email.com', age: 28, gender: 'female', status: 'active', adherence: 45, lastVisit: '2025-01-15', nextAppointment: null, weight: 75, targetWeight: 65, bmi: 26.8 },
  { id: '4', firstName: 'Ali', lastName: 'Öztürk', email: 'ali@email.com', age: 55, gender: 'male', status: 'paused', adherence: 60, lastVisit: '2025-01-10', nextAppointment: null, weight: 88, targetWeight: 80, bmi: 27.5 },
  { id: '5', firstName: 'Zeynep', lastName: 'Çelik', email: 'zeynep@email.com', age: 38, gender: 'female', status: 'active', adherence: 92, lastVisit: '2025-01-22', nextAppointment: '2025-01-27', weight: 58, targetWeight: 56, bmi: 21.3 },
  { id: '6', firstName: 'Hasan', lastName: 'Yıldız', email: 'hasan@email.com', age: 41, gender: 'male', status: 'inactive', adherence: 30, lastVisit: '2024-12-20', nextAppointment: null, weight: 95, targetWeight: 82, bmi: 29.4 },
  { id: '7', firstName: 'Elif', lastName: 'Arslan', email: 'elif@email.com', age: 25, gender: 'female', status: 'onboarding', adherence: 0, lastVisit: '2025-01-23', nextAppointment: '2025-01-28', weight: 70, targetWeight: 63, bmi: 25.0 },
  { id: '8', firstName: 'Can', lastName: 'Doğan', email: 'can@email.com', age: 33, gender: 'male', status: 'active', adherence: 78, lastVisit: '2025-01-19', nextAppointment: '2025-01-29', weight: 82, targetWeight: 78, bmi: 25.6 },
  { id: '9', firstName: 'Selin', lastName: 'Koç', email: 'selin@email.com', age: 29, gender: 'female', status: 'active', adherence: 88, lastVisit: '2025-01-21', nextAppointment: '2025-01-30', weight: 55, targetWeight: 54, bmi: 20.1 },
  { id: '10', firstName: 'Burak', lastName: 'Şahin', email: 'burak@email.com', age: 50, gender: 'male', status: 'paused', adherence: 55, lastVisit: '2025-01-05', nextAppointment: null, weight: 98, targetWeight: 88, bmi: 30.2 },
]

const statusConfig = {
  active: { label: 'Aktif', variant: 'success' as const },
  inactive: { label: 'Pasif', variant: 'destructive' as const },
  onboarding: { label: 'Yeni', variant: 'info' as const },
  paused: { label: 'Duraklat.', variant: 'warning' as const },
}

const ITEMS_PER_PAGE = 6

function getAdherenceColor(value: number): string {
  if (value >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (value >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
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

export default function PatientListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const filtered = useMemo(() => {
    let result = mockPatients
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }
    return result
  }, [search, statusFilter])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <PageContainer
      title="Hastalar"
      description={`Toplam ${filtered.length} hasta`}
      actions={
        <Button onClick={() => navigate('/patients/new')} size="sm">
          <Plus className="h-3.5 w-3.5" />
          Yeni Hasta
        </Button>
      }
    >
      {/* Filters */}
      <Card className="py-0 gap-0 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Hasta ara..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Durum" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
                <SelectItem value="onboarding">Yeni</SelectItem>
                <SelectItem value="paused">Duraklatılmış</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 border rounded-lg p-0.5">
              <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon-xs" onClick={() => setViewMode('table')}><List className="h-3.5 w-3.5" /></Button>
              <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon-xs" onClick={() => setViewMode('grid')}><LayoutGrid className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'table' ? (
        <Card className="py-0 gap-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[250px]">Hasta</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Uyum</TableHead>
                <TableHead className="hidden md:table-cell">BMI</TableHead>
                <TableHead className="hidden lg:table-cell">Son Ziyaret</TableHead>
                <TableHead className="hidden lg:table-cell">Sonraki Randevu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((patient) => {
                const fullName = `${patient.firstName} ${patient.lastName}`
                const initials = `${patient.firstName[0]}${patient.lastName[0]}`
                const status = statusConfig[patient.status]
                return (
                  <TableRow key={patient.id} className="cursor-pointer" onClick={() => navigate(`/patients/${patient.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarFallback className={cn('text-xs font-semibold', getInitialColor(fullName))}>{initials}</AvatarFallback></Avatar>
                        <div>
                          <p className="text-sm font-medium leading-tight">{fullName}</p>
                          <p className="text-xs text-muted-foreground">{patient.age} yaş</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant={status.variant}>{status.label}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 w-24">
                        <Progress value={patient.adherence} className="h-1.5 flex-1" />
                        <span className={cn('text-xs font-semibold tabular-nums', getAdherenceColor(patient.adherence))}>%{patient.adherence}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell"><span className="text-sm tabular-nums">{patient.bmi.toFixed(1)}</span></TableCell>
                    <TableCell className="hidden lg:table-cell"><span className="text-sm text-muted-foreground">{patient.lastVisit}</span></TableCell>
                    <TableCell className="hidden lg:table-cell"><span className="text-sm text-muted-foreground">{patient.nextAppointment || '—'}</span></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in-stagger">
          {paginated.map((patient) => {
            const fullName = `${patient.firstName} ${patient.lastName}`
            const initials = `${patient.firstName[0]}${patient.lastName[0]}`
            const status = statusConfig[patient.status]
            return (
              <Card key={patient.id} className="cursor-pointer transition-all hover:shadow-md py-0 gap-0" onClick={() => navigate(`/patients/${patient.id}`)}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-11 w-11"><AvatarFallback className={cn('text-sm font-semibold', getInitialColor(fullName))}>{initials}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-tight">{fullName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{patient.age} yaş, {patient.weight} kg</p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div><p className="text-xs text-muted-foreground">BMI</p><p className="text-sm font-semibold tabular-nums">{patient.bmi.toFixed(1)}</p></div>
                    <div><p className="text-xs text-muted-foreground">Uyum</p><p className={cn('text-sm font-semibold tabular-nums', getAdherenceColor(patient.adherence))}>%{patient.adherence}</p></div>
                    <div><p className="text-xs text-muted-foreground">Hedef</p><p className="text-sm font-semibold tabular-nums">{patient.targetWeight} kg</p></div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} / {filtered.length}</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i} variant={currentPage === i + 1 ? 'default' : 'outline'} size="icon-sm" onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>
            ))}
            <Button variant="outline" size="icon-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
