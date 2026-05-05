import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  CheckCircle2,
  XCircle,
  Ban,
  Eye,
  Filter,
  UserCheck,
  Clock,
  UserX,
  Star,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageContainer } from '@/components/shared/page-container'
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { StatCard } from '@/components/shared/stat-card'
import { cn } from '@/lib/utils'
import {
  getUsers as fetchAdminUsers,
  type AdminUser,
} from '@/services/admin.service'
import api from '@/lib/axios'

interface DietitianRow {
  id: string
  name: string
  email: string
  specialization: string
  licenseNumber: string
  patients: number
  rating: number
  verificationStatus: 'verified' | 'pending' | 'rejected'
  status: 'active' | 'suspended'
  registeredAt: string
}



const verificationMap = {
  verified: { label: 'Onaylı', variant: 'success' as const, icon: CheckCircle2 },
  pending: { label: 'Bekliyor', variant: 'warning' as const, icon: Clock },
  rejected: { label: 'Reddedildi', variant: 'destructive' as const, icon: XCircle },
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

/** Map AdminUser (role=dietitian) to local DietitianRow */
function toDietitianRow(u: AdminUser): DietitianRow {
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email
  // Backend doesn't return full dietitian profile fields in the users list,
  // so we provide sensible defaults and mark verification from isActive
  return {
    id: u.id,
    name,
    email: u.email,
    specialization: '-',
    licenseNumber: '-',
    patients: 0,
    rating: 0,
    verificationStatus: u.isActive ? 'verified' : 'pending',
    status: u.isActive ? 'active' : 'suspended',
    registeredAt: new Date(u.createdAt).toLocaleDateString('tr-TR'),
  }
}

export default function AdminDietitians() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [dietitians, setDietitians] = useState<DietitianRow[]>([])

  const loadDietitians = useCallback(async () => {
    try {
      const result = await fetchAdminUsers({ role: 'dietitian', page: 1, limit: 100, search: search.trim() || undefined })
      setDietitians(result.items.map(toDietitianRow))
    } catch (error) {
      console.error('Failed to load dietitians:', error)
    }
  }, [search])

  useEffect(() => {
    loadDietitians().finally(() => setIsLoading(false))
  }, [loadDietitians])

  const handleApprove = async (dietitianId: string) => {
    try {
      await api.post(`/admin/dietitians/${dietitianId}/approve`)
      await loadDietitians()
    } catch {
      // Silently fail
    }
  }

  const handleSuspend = async (dietitianId: string, currentlyActive: boolean) => {
    try {
      await api.patch(`/admin/users/${dietitianId}/status`, { isActive: !currentlyActive })
      await loadDietitians()
    } catch {
      // Silently fail
    }
  }

  const filtered = dietitians.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || d.verificationStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const verifiedCount = dietitians.filter(d => d.verificationStatus === 'verified').length
  const pendingCount = dietitians.filter(d => d.verificationStatus === 'pending').length
  const suspendedCount = dietitians.filter(d => d.status === 'suspended').length

  if (isLoading) return <ListPageSkeleton />

  return (
    <PageContainer
      title="Diyetisyen Yönetimi"
      description="Diyetisyenleri doğrulayın ve yönetin."
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-in-stagger">
        <StatCard
          title="Toplam Diyetisyen"
          value={dietitians.length}
          icon={UserCheck}
          color="blue"
          featured
        />
        <StatCard
          title="Onaylı"
          value={verifiedCount}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Bekleyen"
          value={pendingCount}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Askıya Alınan"
          value={suspendedCount}
          icon={UserX}
          color="red"
        />
      </div>

      {/* Filters */}
      <Card className="py-0 gap-0 mb-6 animate-fade-up">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Diyetisyen ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Doğrulama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="verified">Onaylı</SelectItem>
                  <SelectItem value="pending">Bekleyen</SelectItem>
                  <SelectItem value="rejected">Reddedilen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="py-0 gap-0 overflow-hidden animate-fade-up">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Diyetisyen</TableHead>
              <TableHead className="hidden md:table-cell">Uzmanlık</TableHead>
              <TableHead className="hidden lg:table-cell">Lisans No</TableHead>
              <TableHead className="text-center">Hasta</TableHead>
              <TableHead className="text-center hidden md:table-cell">Puan</TableHead>
              <TableHead className="text-center">Doğrulama</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState icon={UserCheck} title="Diyetisyen bulunamadı" description="Kayıtlı diyetisyen bulunmuyor." />
                </TableCell>
              </TableRow>
            ) : filtered.map((dietitian) => {
              const verification = verificationMap[dietitian.verificationStatus]
              return (
                <TableRow
                  key={dietitian.id}
                  className={cn(dietitian.status === 'suspended' && 'opacity-60')}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://i.pravatar.cc/80?u=${encodeURIComponent(dietitian.email)}`} alt={dietitian.name} />
                        <AvatarFallback className={cn('text-xs font-semibold', getInitialColor(dietitian.name))}>
                          {dietitian.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-tight">{dietitian.name}</p>
                        <p className="text-xs text-muted-foreground">{dietitian.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm hidden md:table-cell">{dietitian.specialization}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{dietitian.licenseNumber}</code>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-semibold tabular-nums">{dietitian.patients}</span>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    {dietitian.rating > 0 ? (
                      <div className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-semibold tabular-nums">{dietitian.rating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={verification.variant}>
                      <verification.icon className="h-3 w-3" />
                      {verification.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0}>
                              <Button variant="ghost" size="icon" disabled className="h-8 w-8 pointer-events-none">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Yakında</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {dietitian.verificationStatus === 'pending' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          onClick={() => handleApprove(dietitian.id)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {dietitian.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleSuspend(dietitian.id, true)}
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </PageContainer>
  )
}
