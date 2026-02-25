import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Progress } from '@/components/ui/progress'

interface MockPatient {
  id: string
  fullName: string
  age: number
  goal: string
  adherenceScore: number
  lastActivityAt: string
  status: 'active' | 'inactive' | 'onboarding' | 'paused'
}

const mockPatients: MockPatient[] = [
  { id: '1', fullName: 'Ayşe Yılmaz', age: 32, goal: 'Kilo Verme', adherenceScore: 87, lastActivityAt: '2 saat önce', status: 'active' },
  { id: '2', fullName: 'Mehmet Kaya', age: 45, goal: 'Diyabet Yönetimi', adherenceScore: 72, lastActivityAt: '5 saat önce', status: 'active' },
  { id: '3', fullName: 'Fatma Demir', age: 28, goal: 'Kas Kazanımı', adherenceScore: 95, lastActivityAt: '1 saat önce', status: 'active' },
  { id: '4', fullName: 'Ali Öztürk', age: 55, goal: 'Kalp Sağlığı', adherenceScore: 63, lastActivityAt: '1 gün önce', status: 'paused' },
  { id: '5', fullName: 'Zeynep Çelik', age: 38, goal: 'Kilo Verme', adherenceScore: 81, lastActivityAt: '3 saat önce', status: 'active' },
  { id: '6', fullName: 'Hasan Yıldız', age: 41, goal: 'Genel Sağlık', adherenceScore: 45, lastActivityAt: '3 gün önce', status: 'inactive' },
  { id: '7', fullName: 'Elif Arslan', age: 26, goal: 'Spor Performansı', adherenceScore: 91, lastActivityAt: '30 dk önce', status: 'active' },
  { id: '8', fullName: 'Burak Şahin', age: 33, goal: 'Kilo Alma', adherenceScore: 78, lastActivityAt: '6 saat önce', status: 'active' },
  { id: '9', fullName: 'Selin Koç', age: 29, goal: 'Vejetaryen Beslenme', adherenceScore: 88, lastActivityAt: '4 saat önce', status: 'active' },
  { id: '10', fullName: 'Emre Aydın', age: 50, goal: 'Kilo Verme', adherenceScore: 0, lastActivityAt: '-', status: 'onboarding' },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Aktif', variant: 'default' },
  inactive: { label: 'Pasif', variant: 'destructive' },
  onboarding: { label: 'Kayıt', variant: 'outline' },
  paused: { label: 'Duraklat', variant: 'secondary' },
}

export default function PatientListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 5

  const filtered = mockPatients.filter((p) => {
    const matchesSearch = p.fullName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hastalar</h1>
          <p className="text-muted-foreground">Tüm hastalarınızı yönetin ve takip edin.</p>
        </div>
        <Button onClick={() => navigate('/patients/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Hasta Ekle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hasta ara..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                  <SelectItem value="onboarding">Kayıt</SelectItem>
                  <SelectItem value="paused">Duraklatılmış</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hasta</TableHead>
                <TableHead className="text-center">Yaş</TableHead>
                <TableHead>Hedef</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Uyum
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Son Aktivite</TableHead>
                <TableHead className="text-center">Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {patient.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{patient.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{patient.age}</TableCell>
                  <TableCell>{patient.goal}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Progress value={patient.adherenceScore} className="h-2 flex-1" />
                      <span className="text-sm text-muted-foreground w-10 text-right">
                        %{patient.adherenceScore}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{patient.lastActivityAt}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusMap[patient.status].variant}>
                      {statusMap[patient.status].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Hasta bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Toplam {filtered.length} hastadan {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} arası gösteriliyor
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
