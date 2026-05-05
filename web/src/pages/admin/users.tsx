import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Filter,
  MoreVertical,
  Shield,
  Ban,
  Eye,
  Mail,
  Users,
  UserCheck,
  UserCog,
  UserX,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageContainer } from '@/components/shared/page-container'
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { StatCard } from '@/components/shared/stat-card'
import { cn } from '@/lib/utils'
import {
  getUsers as fetchAdminUsers,
  type AdminUser,
  type AdminUserFilters,
} from '@/services/admin.service'
import api from '@/lib/axios'

interface UserRow {
  id: string
  name: string
  email: string
  role: 'admin' | 'dietitian' | 'patient'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  registeredAt: string
}



const roleMap = {
  admin: { label: 'Admin', variant: 'destructive' as const },
  dietitian: { label: 'Diyetisyen', variant: 'info' as const },
  patient: { label: 'Hasta', variant: 'secondary' as const },
}

const statusMap = {
  active: { label: 'Aktif', variant: 'success' as const },
  inactive: { label: 'Pasif', variant: 'warning' as const },
  suspended: { label: 'Askıda', variant: 'destructive' as const },
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

/** Map API AdminUser to the local UserRow shape */
function toUserRow(u: AdminUser): UserRow {
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email
  const status: UserRow['status'] = u.isActive ? 'active' : 'inactive'
  const role = (u.role === 'admin' || u.role === 'dietitian' || u.role === 'patient')
    ? u.role
    : 'patient' as const
  return {
    id: u.id,
    name,
    email: u.email,
    role,
    status,
    lastLogin: u.lastLoginAt
      ? new Date(u.lastLoginAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
      : '-',
    registeredAt: new Date(u.createdAt).toLocaleDateString('tr-TR'),
  }
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<UserRow[]>([])

  const loadUsers = useCallback(async () => {
    try {
      const filters: AdminUserFilters = { page: 1, limit: 100 }
      if (roleFilter !== 'all') filters.role = roleFilter
      if (statusFilter === 'active') filters.isActive = true
      else if (statusFilter === 'inactive' || statusFilter === 'suspended') filters.isActive = false
      if (search.trim()) filters.search = search.trim()

      const result = await fetchAdminUsers(filters)
      setUsers(result.items.map(toUserRow))
    } catch (err) {
      console.error('Failed to load users:', err)
    }
  }, [roleFilter, statusFilter, search])

  useEffect(() => {
    loadUsers().finally(() => setIsLoading(false))
  }, [loadUsers])

  const handleSuspendUser = async (userId: string, currentlyActive: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { isActive: !currentlyActive })
      await loadUsers()
    } catch {
      // Silently fail — could add toast here
    }
  }

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const adminCount = users.filter(u => u.role === 'admin').length
  const dietitianCount = users.filter(u => u.role === 'dietitian').length
  const patientCount = users.filter(u => u.role === 'patient').length

  if (isLoading) return <ListPageSkeleton />

  return (
    <PageContainer
      title="Kullanıcı Yönetimi"
      description="Tüm sistem kullanıcılarını yönetin."
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-in-stagger">
        <StatCard
          title="Toplam Kullanıcı"
          value={users.length}
          icon={Users}
          color="blue"
          featured
        />
        <StatCard
          title="Admin"
          value={adminCount}
          icon={UserCog}
          color="red"
        />
        <StatCard
          title="Diyetisyen"
          value={dietitianCount}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Hasta"
          value={patientCount}
          icon={UserX}
          color="purple"
        />
      </div>

      {/* Filters */}
      <Card className="py-0 gap-0 mb-6 animate-fade-up">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kullanıcı ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Roller</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="dietitian">Diyetisyen</SelectItem>
                  <SelectItem value="patient">Hasta</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                  <SelectItem value="suspended">Askıda</SelectItem>
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
              <TableHead>Kullanıcı</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="hidden md:table-cell">Son Giriş</TableHead>
              <TableHead className="hidden lg:table-cell">Kayıt Tarihi</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState icon={Users} title="Kullanıcı bulunamadı" description="Arama kriterlerinize uygun kullanıcı yok." />
                </TableCell>
              </TableRow>
            ) : filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://i.pravatar.cc/80?u=${encodeURIComponent(user.email)}`} alt={user.name} />
                      <AvatarFallback className={cn('text-xs font-semibold', getInitialColor(user.name))}>
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-tight">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={roleMap[user.role].variant}>{roleMap[user.role].label}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusMap[user.status].variant}>{statusMap[user.status].label}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground">{user.registeredAt}</span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled>
                        <Eye className="mr-2 h-4 w-4" />
                        Profili Görüntüle
                        <span className="ml-auto text-[10px] text-muted-foreground">Yakında</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <Mail className="mr-2 h-4 w-4" />
                        E-posta Gönder
                        <span className="ml-auto text-[10px] text-muted-foreground">Yakında</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <Shield className="mr-2 h-4 w-4" />
                        Rol Değiştir
                        <span className="ml-auto text-[10px] text-muted-foreground">Yakında</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleSuspendUser(user.id, user.status === 'active')}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        {user.status === 'active' ? 'Askıya Al' : 'Aktif Et'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageContainer>
  )
}
