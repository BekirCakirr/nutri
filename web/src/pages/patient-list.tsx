import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Users,
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
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'
import { usePatients } from '@/hooks/use-patients'

function computeAge(dateOfBirth: string | undefined): number {
  if (!dateOfBirth) return 0
  const diff = Date.now() - new Date(dateOfBirth).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

function computeBmi(h: number | undefined, w: number | undefined): number {
  if (!h || !w || h === 0) return 0
  const hm = h / 100
  return Math.round((w / (hm * hm)) * 10) / 10
}

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
  const { allPatients, isLoading } = usePatients()

  // Map store patients to local Patient type
  type RawListPatient = {
    id: string; firstName?: string; lastName?: string; email?: string;
    dateOfBirth?: string; gender?: string; status?: string;
    adherenceScore?: number; lastVisit?: string; nextAppointment?: string;
    height?: number; weight?: number; targetWeight?: number;
  };

  const mappedPatients: Patient[] = useMemo(() =>
    allPatients.map((rawP) => {
      const p = rawP as unknown as RawListPatient;
      return {
        id: p.id,
        firstName: p.firstName ?? '',
        lastName: p.lastName ?? '',
        email: p.email ?? '',
        age: computeAge(p.dateOfBirth),
        gender: p.gender === 'female' ? 'female' as const : 'male' as const,
        status: (p.status ?? 'active') as Patient['status'],
        adherence: p.adherenceScore ?? 0,
        lastVisit: p.lastVisit ?? '',
        nextAppointment: p.nextAppointment ?? null,
        weight: p.weight ?? 0,
        targetWeight: p.targetWeight ?? (p.weight ? p.weight - 5 : 0),
        bmi: computeBmi(p.height, p.weight),
      };
    })
  , [allPatients])

  const filtered = useMemo(() => {
    let result = mappedPatients
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) => `${p.firstName ?? ''} ${p.lastName ?? ''}`.toLowerCase().includes(q) || (p.email?.toLowerCase().includes(q) ?? false)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }
    return result
  }, [search, statusFilter, mappedPatients])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  if (isLoading) return <ListPageSkeleton />

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

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="Henüz hasta eklenmedi" description="Davet kodu oluşturarak ilk hastanızı ekleyin." />
      ) : (
        <>
          {viewMode === 'table' ? (
            <>
              {/* Mobile card view */}
              <div className="md:hidden space-y-3">
                {paginated.map((patient) => {
                  const fullName = `${patient.firstName} ${patient.lastName}`
                  const initials = `${patient.firstName?.[0] ?? ''}${patient.lastName?.[0] ?? ''}`
                  const status = statusConfig[patient.status]
                  return (
                    <Card key={patient.id} className="cursor-pointer transition-all hover:shadow-md py-0 gap-0" onClick={() => navigate(`/patients/${patient.id}`)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10"><AvatarFallback className={cn('text-xs font-semibold', getInitialColor(fullName))}>{initials}</AvatarFallback></Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{fullName}</p>
                              <Badge variant={status.variant}>{status.label}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{patient.age} yaş</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                          <div><p className="text-xs text-muted-foreground">BMI</p><p className="text-sm font-semibold tabular-nums">{patient.bmi.toFixed(1)}</p></div>
                          <div><p className="text-xs text-muted-foreground">Uyum</p><p className={cn('text-sm font-semibold tabular-nums', getAdherenceColor(patient.adherence))}>%{patient.adherence}</p></div>
                          <div><p className="text-xs text-muted-foreground">Hedef</p><p className="text-sm font-semibold tabular-nums">{patient.targetWeight} kg</p></div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              {/* Desktop table view */}
              <Card className="py-0 gap-0 overflow-hidden hidden md:block">
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
                    const initials = `${patient.firstName?.[0] ?? ''}${patient.lastName?.[0] ?? ''}`
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
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in-stagger">
              {paginated.map((patient) => {
                const fullName = `${patient.firstName} ${patient.lastName}`
                const initials = `${patient.firstName?.[0] ?? ''}${patient.lastName?.[0] ?? ''}`
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
        </>
      )}
    </PageContainer>
  )
}
