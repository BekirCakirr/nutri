import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Check,
  X,
  Eye,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  UtensilsCrossed,
  ChefHat,
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
import { PageContainer } from '@/components/shared/page-container'
import { getRecipes } from '@/services/recipe.service'
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { StatCard } from '@/components/shared/stat-card'

interface RecipeSubmission {
  id: string
  title: string
  category: string
  submittedBy: string
  submittedAt: string
  calories: number
  status: 'pending' | 'approved' | 'rejected'
}

const statusMap = {
  pending: { label: 'Bekliyor', variant: 'warning' as const },
  approved: { label: 'Onaylandı', variant: 'success' as const },
  rejected: { label: 'Reddedildi', variant: 'destructive' as const },
}

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeSubmission[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const loadRecipes = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getRecipes({ page: 1, limit: 50 })
      setRecipes(result.items.map((r: any) => ({
        id: r.id,
        title: r.name ?? r.title ?? '',
        category: r.category ?? '',
        submittedBy: r.authorName ?? '',
        submittedAt: r.createdAt ? r.createdAt.split('T')[0] : '',
        calories: r.caloriesPerServing ?? r.nutritionPerServing?.calories ?? 0,
        status: (r.isPublic ? 'approved' : 'pending') as RecipeSubmission['status'],
      })))
    } catch {
      // silently fail
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadRecipes() }, [loadRecipes])

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
  const approvedCount = recipes.filter(r => r.status === 'approved').length
  const rejectedCount = recipes.filter(r => r.status === 'rejected').length

  if (isLoading) return <ListPageSkeleton />

  return (
    <PageContainer
      title="Tarif Moderasyonu"
      description="Diyetisyenler tarafından gönderilen tarifleri inceleyin."
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-in-stagger">
        <StatCard
          title="Bekleyen"
          value={pendingCount}
          icon={Clock}
          color="yellow"
          featured
        />
        <StatCard
          title="Onaylanan"
          value={approvedCount}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Reddedilen"
          value={rejectedCount}
          icon={XCircle}
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
                placeholder="Tarif ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="pending">Bekleyen</SelectItem>
                  <SelectItem value="approved">Onaylanan</SelectItem>
                  <SelectItem value="rejected">Reddedilen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground tabular-nums">{filtered.length} tarif</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="py-0 gap-0 overflow-hidden animate-fade-up">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Tarif</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="hidden md:table-cell">Gönderen</TableHead>
              <TableHead className="hidden lg:table-cell">Tarih</TableHead>
              <TableHead className="text-center">Kalori</TableHead>
              <TableHead className="text-center">Durum</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState icon={ChefHat} title="Tarif bulunamadı" description="Onay bekleyen tarif bulunmuyor." />
                </TableCell>
              </TableRow>
            ) : filtered.map((recipe) => (
              <TableRow key={recipe.id}>
                <TableCell>
                  <span className="text-sm font-medium">{recipe.title}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{recipe.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                        {recipe.submittedBy.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{recipe.submittedBy}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground">{recipe.submittedAt}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm tabular-nums">{recipe.calories} kcal</span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={statusMap[recipe.status].variant}>
                    {statusMap[recipe.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    {recipe.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          onClick={() => handleApprove(recipe.id)}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleReject(recipe.id)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageContainer>
  )
}
