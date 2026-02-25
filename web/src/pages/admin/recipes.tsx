import { useState } from 'react'
import {
  Search,
  Check,
  X,
  Eye,
  Filter,
  ImageIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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

interface RecipeSubmission {
  id: string
  title: string
  category: string
  submittedBy: string
  submittedAt: string
  calories: number
  status: 'pending' | 'approved' | 'rejected'
}

const mockSubmissions: RecipeSubmission[] = [
  { id: '1', title: 'Avokadolu Tost', category: 'Atıştırmalık', submittedBy: 'Dr. Mehmet Kara', submittedAt: '2026-02-25', calories: 290, status: 'pending' },
  { id: '2', title: 'Karabuğday Pilavı', category: 'Ana Yemek', submittedBy: 'Dr. Zehra Gül', submittedAt: '2026-02-24', calories: 320, status: 'pending' },
  { id: '3', title: 'Smoothie Bowl', category: 'Atıştırmalık', submittedBy: 'Dr. Ali Vural', submittedAt: '2026-02-24', calories: 250, status: 'pending' },
  { id: '4', title: 'Mercimek Köftesi', category: 'Ana Yemek', submittedBy: 'Dr. Ayşe Yılmaz', submittedAt: '2026-02-23', calories: 180, status: 'approved' },
  { id: '5', title: 'Chia Puding', category: 'Tatlı', submittedBy: 'Dr. Mehmet Kara', submittedAt: '2026-02-22', calories: 200, status: 'approved' },
  { id: '6', title: 'Çikolatalı Kek (Şekerli)', category: 'Tatlı', submittedBy: 'Dr. Zehra Gül', submittedAt: '2026-02-21', calories: 450, status: 'rejected' },
]

const statusMap = {
  pending: { label: 'Bekliyor', variant: 'outline' as const },
  approved: { label: 'Onaylandı', variant: 'default' as const },
  rejected: { label: 'Reddedildi', variant: 'destructive' as const },
}

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState(mockSubmissions)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = recipes.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApprove = (id: string) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r))
  }

  const handleReject = (id: string) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r))
  }

  const pendingCount = recipes.filter(r => r.status === 'pending').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tarif Moderasyonu</h1>
        <p className="text-muted-foreground">Diyetisyenler tarafından gönderilen tarifleri inceleyin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Bekleyen</p>
            <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Onaylanan</p>
            <p className="text-2xl font-bold text-green-500">{recipes.filter(r => r.status === 'approved').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Reddedilen</p>
            <p className="text-2xl font-bold text-red-500">{recipes.filter(r => r.status === 'rejected').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tarif ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="pending">Bekleyen</SelectItem>
              <SelectItem value="approved">Onaylanan</SelectItem>
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
                <TableHead>Tarif</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Gönderen</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-center">Kalori</TableHead>
                <TableHead className="text-center">Durum</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">{recipe.title}</TableCell>
                  <TableCell><Badge variant="outline">{recipe.category}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px]">
                          {recipe.submittedBy.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{recipe.submittedBy}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{recipe.submittedAt}</TableCell>
                  <TableCell className="text-center">{recipe.calories} kcal</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusMap[recipe.status].variant}>
                      {statusMap[recipe.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-3 w-3" />
                      </Button>
                      {recipe.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => handleApprove(recipe.id)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleReject(recipe.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
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
