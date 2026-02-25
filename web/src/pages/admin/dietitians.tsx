import { useState } from 'react'
import {
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  Ban,
  Eye,
  Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const mockDietitians: DietitianRow[] = [
  { id: '1', name: 'Dr. Ayşe Yılmaz', email: 'dr.ayse@nutriai.com', specialization: 'Kilo Yönetimi', licenseNumber: 'DYT-001234', patients: 47, rating: 4.8, verificationStatus: 'verified', status: 'active', registeredAt: '2025-06-15' },
  { id: '2', name: 'Dr. Mehmet Kara', email: 'mehmet.kara@nutriai.com', specialization: 'Spor Beslenmesi', licenseNumber: 'DYT-005678', patients: 32, rating: 4.5, verificationStatus: 'pending', status: 'active', registeredAt: '2026-02-20' },
  { id: '3', name: 'Dr. Zehra Gül', email: 'zehra.gul@nutriai.com', specialization: 'Klinik Beslenme', licenseNumber: 'DYT-009012', patients: 0, rating: 0, verificationStatus: 'pending', status: 'active', registeredAt: '2026-02-24' },
  { id: '4', name: 'Dr. Ali Vural', email: 'ali.vural@nutriai.com', specialization: 'Diyabet Yönetimi', licenseNumber: 'DYT-003456', patients: 28, rating: 4.6, verificationStatus: 'verified', status: 'active', registeredAt: '2025-08-10' },
  { id: '5', name: 'Dr. Canan Yıldız', email: 'canan.y@nutriai.com', specialization: 'Pediatrik Beslenme', licenseNumber: 'DYT-007890', patients: 15, rating: 4.2, verificationStatus: 'verified', status: 'active', registeredAt: '2025-10-01' },
  { id: '6', name: 'Dr. Hakan Demir', email: 'hakan.d@nutriai.com', specialization: 'Genel Beslenme', licenseNumber: 'DYT-INVALID', patients: 5, rating: 2.1, verificationStatus: 'rejected', status: 'suspended', registeredAt: '2025-12-05' },
]

const verificationMap = {
  verified: { label: 'Onaylı', variant: 'default' as const, icon: CheckCircle2 },
  pending: { label: 'Bekliyor', variant: 'outline' as const, icon: Shield },
  rejected: { label: 'Reddedildi', variant: 'destructive' as const, icon: XCircle },
}

export default function AdminDietitians() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockDietitians.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || d.verificationStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Diyetisyen Yönetimi</h1>
        <p className="text-muted-foreground">Diyetisyenleri doğrulayın ve yönetin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Toplam</p>
            <p className="text-2xl font-bold">{mockDietitians.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Onaylı</p>
            <p className="text-2xl font-bold text-green-500">{mockDietitians.filter(d => d.verificationStatus === 'verified').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Bekleyen</p>
            <p className="text-2xl font-bold text-orange-500">{mockDietitians.filter(d => d.verificationStatus === 'pending').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Askıya Alınan</p>
            <p className="text-2xl font-bold text-red-500">{mockDietitians.filter(d => d.status === 'suspended').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Diyetisyen ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Doğrulama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="verified">Onaylı</SelectItem>
              <SelectItem value="pending">Bekleyen</SelectItem>
              <SelectItem value="rejected">Reddedilen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Diyetisyen</TableHead>
                <TableHead>Uzmanlık</TableHead>
                <TableHead>Lisans No</TableHead>
                <TableHead className="text-center">Hasta</TableHead>
                <TableHead className="text-center">Puan</TableHead>
                <TableHead className="text-center">Doğrulama</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((dietitian) => {
                const verification = verificationMap[dietitian.verificationStatus]
                return (
                  <TableRow key={dietitian.id} className={dietitian.status === 'suspended' ? 'opacity-60' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {dietitian.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{dietitian.name}</p>
                          <p className="text-xs text-muted-foreground">{dietitian.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{dietitian.specialization}</TableCell>
                    <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{dietitian.licenseNumber}</code></TableCell>
                    <TableCell className="text-center">{dietitian.patients}</TableCell>
                    <TableCell className="text-center">{dietitian.rating > 0 ? dietitian.rating.toFixed(1) : '-'}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={verification.variant}>
                        {verification.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-3 w-3" />
                        </Button>
                        {dietitian.verificationStatus === 'pending' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                          </Button>
                        )}
                        {dietitian.status === 'active' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Ban className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
