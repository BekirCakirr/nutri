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
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { EmptyState } from '@/components/shared/empty-state'
import { StatCard } from '@/components/shared/stat-card'
import { getRecipes, updateRecipe } from '@/services/recipe.service'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

function recipeSlug(s: string): string {
  const base = (s || 'recipe').toLowerCase().normalize('NFD')
  let out = ''
  for (let i = 0; i < base.length; i++) {
    const c = base.charCodeAt(i)
    if (c >= 0x0300 && c <= 0x036f) continue
    out += base[i]
  }
  return out.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'recipe'
}

interface RecipeRow {
  id: string
  name: string
  description?: string
  difficulty: string
  calories_per_serving?: number
  caloriesPerServing?: number
  is_approved?: boolean
  isApproved?: boolean
  created_by?: string
  createdBy?: string
  created_at?: string
  createdAt?: string
  tags?: string[]
}

const statusMap = {
  pending: { label: 'Bekliyor', variant: 'warning' as const },
  approved: { label: 'Onaylandı', variant: 'success' as const },
  rejected: { label: 'Reddedildi', variant: 'destructive' as const },
}

function getStatus(r: RecipeRow): 'pending' | 'approved' | 'rejected' {
  const approved = r.is_approved ?? r.isApproved
  if (approved === true) return 'approved'
  if (approved === false) return 'pending'
  return 'pending'
}

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getRecipes()
      const items = Array.isArray(response?.items) ? response.items : []
      setRecipes(items as unknown as RecipeRow[])
    } catch {
      toast.error('Tarifler yüklenemedi')
      setRecipes([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const handleApprove = async (id: string) => {
    try {
      await updateRecipe(id, { is_approved: true } as unknown as Parameters<typeof updateRecipe>[1])
      setRecipes(prev =>
        prev.map(r => r.id === id ? { ...r, is_approved: true, isApproved: true } : r)
      )
      toast.success('Tarif onaylandı')
    } catch {
      toast.error('Tarif onaylanamadı')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await updateRecipe(id, { is_approved: false } as unknown as Parameters<typeof updateRecipe>[1])
      setRecipes(prev =>
        prev.map(r => r.id === id ? { ...r, is_approved: false, isApproved: false } : r)
      )
      toast.success('Tarif reddedildi')
    } catch {
      toast.error('Tarif reddedilemedi')
    }
  }

  const filtered = recipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase())
    const status = getStatus(r)
    const matchesStatus = statusFilter === 'all' || status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = recipes.filter(r => getStatus(r) === 'pending').length
  const approvedCount = recipes.filter(r => getStatus(r) === 'approved').length
  const rejectedCount = recipes.filter(r => getStatus(r) === 'rejected').length

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

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
              <TableHead>Zorluk</TableHead>
              <TableHead className="hidden lg:table-cell">Tarih</TableHead>
              <TableHead className="text-center">Kalori</TableHead>
              <TableHead className="text-center">Durum</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex items-center justify-center py-8 gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tarifler yükleniyor...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState icon={ChefHat} title="Tarif bulunamadı" description="Onay bekleyen tarif bulunmuyor." />
                </TableCell>
              </TableRow>
            ) : filtered.map((recipe) => {
              const status = getStatus(recipe)
              const calories = recipe.calories_per_serving ?? recipe.caloriesPerServing ?? 0
              return (
                <TableRow key={recipe.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-semibold text-base shrink-0">
                        {(recipe.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-medium block truncate">{recipe.name}</span>
                        {recipe.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{recipe.description}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {recipe.difficulty === 'easy' ? 'Kolay' : recipe.difficulty === 'medium' ? 'Orta' : 'Zor'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(recipe.created_at ?? recipe.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm tabular-nums">{calories} kcal</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusMap[status].variant}>
                      {statusMap[status].label}
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
                      {status === 'pending' && (
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
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </PageContainer>
  )
}
