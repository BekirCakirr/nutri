import { useState } from 'react'
import {
  Search,
  Filter,
  MoreVertical,
  Shield,
  Ban,
  Eye,
  Mail,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

interface UserRow {
  id: string
  name: string
  email: string
  role: 'admin' | 'dietitian' | 'patient'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  registeredAt: string
}

const mockUsers: UserRow[] = [
  { id: '1', name: 'Admin Kullanıcı', email: 'admin@nutriai.com', role: 'admin', status: 'active', lastLogin: '2026-02-25 14:30', registeredAt: '2025-01-01' },
  { id: '2', name: 'Dr. Ayşe Yılmaz', email: 'dr.ayse@nutriai.com', role: 'dietitian', status: 'active', lastLogin: '2026-02-25 10:00', registeredAt: '2025-06-15' },
  { id: '3', name: 'Mehmet Kaya', email: 'mehmet.k@email.com', role: 'patient', status: 'active', lastLogin: '2026-02-25 13:15', registeredAt: '2025-09-20' },
  { id: '4', name: 'Fatma Demir', email: 'fatma.d@email.com', role: 'patient', status: 'active', lastLogin: '2026-02-25 11:45', registeredAt: '2025-10-05' },
  { id: '5', name: 'Dr. Ali Vural', email: 'ali.vural@nutriai.com', role: 'dietitian', status: 'active', lastLogin: '2026-02-24 16:00', registeredAt: '2025-08-10' },
  { id: '6', name: 'Zeynep Çelik', email: 'zeynep.c@email.com', role: 'patient', status: 'active', lastLogin: '2026-02-24 14:00', registeredAt: '2025-11-01' },
  { id: '7', name: 'Hasan Yıldız', email: 'hasan.y@email.com', role: 'patient', status: 'inactive', lastLogin: '2026-02-20 09:00', registeredAt: '2025-12-01' },
  { id: '8', name: 'Dr. Hakan Demir', email: 'hakan.d@nutriai.com', role: 'dietitian', status: 'suspended', lastLogin: '2026-01-15 10:00', registeredAt: '2025-12-05' },
  { id: '9', name: 'Elif Arslan', email: 'elif.a@email.com', role: 'patient', status: 'active', lastLogin: '2026-02-25 13:45', registeredAt: '2025-09-15' },
  { id: '10', name: 'Burak Şahin', email: 'burak.s@email.com', role: 'patient', status: 'active', lastLogin: '2026-02-25 10:00', registeredAt: '2026-01-10' },
]

const roleMap = {
  admin: { label: 'Admin', variant: 'destructive' as const },
  dietitian: { label: 'Diyetisyen', variant: 'default' as const },
  patient: { label: 'Hasta', variant: 'secondary' as const },
}

const statusMap = {
  active: { label: 'Aktif', variant: 'default' as const },
  inactive: { label: 'Pasif', variant: 'outline' as const },
  suspended: { label: 'Askıda', variant: 'destructive' as const },
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground">Tüm sistem kullanıcılarını yönetin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Toplam Kullanıcı</p>
            <p className="text-2xl font-bold">{mockUsers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Admin</p>
            <p className="text-2xl font-bold">{mockUsers.filter(u => u.role === 'admin').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Diyetisyen</p>
            <p className="text-2xl font-bold">{mockUsers.filter(u => u.role === 'dietitian').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Hasta</p>
            <p className="text-2xl font-bold">{mockUsers.filter(u => u.role === 'patient').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Kullanıcı ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Son Giriş</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
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
                  <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.registeredAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Profili Görüntüle</DropdownMenuItem>
                        <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> E-posta Gönder</DropdownMenuItem>
                        <DropdownMenuItem><Shield className="mr-2 h-4 w-4" /> Rol Değiştir</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive"><Ban className="mr-2 h-4 w-4" /> Askıya Al</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
