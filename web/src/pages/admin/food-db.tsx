import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Filter,
  CheckCircle2,
  XCircle,
  Apple,
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageContainer } from '@/components/shared/page-container'
import { EmptyState } from '@/components/shared/empty-state'
import { searchFoods } from '@/services/food.service'
import type { FoodItem } from '@/types/food'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

function slugify(s: string): string {
  const base = (s || 'food').toLowerCase().normalize('NFD')
  // strip combining marks (U+0300..U+036F)
  let out = ''
  for (let i = 0; i < base.length; i++) {
    const code = base.charCodeAt(i)
    if (code >= 0x0300 && code <= 0x036f) continue
    out += base[i]
  }
  return out.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'food'
}

type FoodRow = FoodItem & {
  caloriesPer100g?: number;
  calories_per_100g?: number;
  proteinPer100g?: number;
  protein_per_100g?: number;
  carbsPer100g?: number;
  carbs_per_100g?: number;
  fatPer100g?: number;
  fat_per_100g?: number;
  is_verified?: boolean;
};

const CATEGORIES = [
  'Meyve', 'Sebze', 'Et & Balık', 'Süt Ürünleri', 'Tahıllar',
  'Baklagiller', 'Yağlar', 'İçecekler', 'Atıştırmalıklar', 'Diğer',
]

export default function AdminFoodDBPage() {
  const [foods, setFoods] = useState<FoodRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 300)

  // New food form state
  const [newFood, setNewFood] = useState({
    name: '',
    category: '',
    calories_per_100g: '',
    protein_per_100g: '',
    carbs_per_100g: '',
    fat_per_100g: '',
  })

  const fetchFoods = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await searchFoods(debouncedSearch || '')
      setFoods(Array.isArray(result) ? (result as FoodRow[]) : [])
    } catch {
      toast.error('Besin veritabanı yüklenemedi')
      setFoods([])
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchFoods()
  }, [fetchFoods])

  const filtered = foods.filter((f) => {
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter
    return matchesCategory
  })

  const handleCreateFood = async () => {
    try {
      await api.post('/foods', {
        name: newFood.name,
        category: newFood.category || 'Diğer',
        calories_per_100g: Number(newFood.calories_per_100g) || 0,
        protein_per_100g: Number(newFood.protein_per_100g) || 0,
        carbs_per_100g: Number(newFood.carbs_per_100g) || 0,
        fat_per_100g: Number(newFood.fat_per_100g) || 0,
      })
      toast.success('Besin eklendi')
      setDialogOpen(false)
      setNewFood({ name: '', category: '', calories_per_100g: '', protein_per_100g: '', carbs_per_100g: '', fat_per_100g: '' })
      fetchFoods()
    } catch {
      toast.error('Besin eklenemedi')
    }
  }

  const handleDeleteFood = async (id: string | number) => {
    try {
      await api.delete(`/foods/${id}`)
      toast.success('Besin silindi')
      setFoods(prev => prev.filter(f => String(f.id) !== String(id)))
    } catch {
      toast.error('Besin silinemedi')
    }
  }

  const categories = [...new Set(foods.map(f => f.category).filter(Boolean))]

  return (
    <PageContainer
      title="Besin Veritabanı"
      description="Besin veritabanını yönetin ve güncelleyin."
      actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              Yeni Besin Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Yeni Besin Ekle</DialogTitle>
              <DialogDescription>Veritabanına yeni bir besin maddesi ekleyin.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Besin Adı</Label>
                <Input
                  placeholder="Tavuk Göğsü"
                  value={newFood.name}
                  onChange={e => setNewFood(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={newFood.category} onValueChange={v => setNewFood(p => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kalori (100g)</Label>
                  <Input
                    type="number"
                    placeholder="165"
                    value={newFood.calories_per_100g}
                    onChange={e => setNewFood(p => ({ ...p, calories_per_100g: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Protein (g)</Label>
                  <Input
                    type="number"
                    placeholder="31"
                    value={newFood.protein_per_100g}
                    onChange={e => setNewFood(p => ({ ...p, protein_per_100g: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Karbonhidrat (g)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newFood.carbs_per_100g}
                    onChange={e => setNewFood(p => ({ ...p, carbs_per_100g: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Yağ (g)</Label>
                  <Input
                    type="number"
                    placeholder="3.6"
                    value={newFood.fat_per_100g}
                    onChange={e => setNewFood(p => ({ ...p, fat_per_100g: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
              <Button onClick={handleCreateFood} disabled={!newFood.name}>Ekle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Filters */}
      <Card className="py-0 gap-0 mb-6 animate-fade-up">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Besin ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <Apple className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground tabular-nums">{filtered.length} besin</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="py-0 gap-0 overflow-hidden animate-fade-up">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[64px]"></TableHead>
              <TableHead>Besin Adı</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-center">Kalori</TableHead>
              <TableHead className="text-center">Protein</TableHead>
              <TableHead className="text-center hidden md:table-cell">Karb.</TableHead>
              <TableHead className="text-center hidden md:table-cell">Yağ</TableHead>
              <TableHead className="text-center">Durum</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <div className="flex items-center justify-center py-8 gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Besinler yükleniyor...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <EmptyState icon={Apple} title="Besin bulunamadı" description="Arama kriterlerinize uygun besin yok." />
                </TableCell>
              </TableRow>
            ) : filtered.map((food) => {
              const f = food as any
              // After snake→camel transform: calories_per_100g → caloriesPer_100g (not caloriesPer100g)
              const cal = Number(f.caloriesPer_100g ?? f.caloriesPer100g ?? f.calories_per_100g) || null
              const pro = Number(f.proteinPer_100g ?? f.proteinPer100g ?? f.protein_per_100g) || null
              const carb = Number(f.carbsPer_100g ?? f.carbsPer100g ?? f.carbs_per_100g) || null
              const fat = Number(f.fatPer_100g ?? f.fatPer100g ?? f.fat_per_100g) || null
              return (
              <TableRow key={food.id}>
                <TableCell>
                  <div className="h-10 w-10 rounded-md bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
                    {(food.name || '?').charAt(0).toUpperCase()}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{food.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{food.category || '—'}</Badge>
                </TableCell>
                <TableCell className="text-center tabular-nums text-sm">{cal ?? '—'}</TableCell>
                <TableCell className="text-center tabular-nums text-sm">{pro ? `${pro}g` : '—'}</TableCell>
                <TableCell className="text-center tabular-nums text-sm hidden md:table-cell">{carb ? `${carb}g` : '—'}</TableCell>
                <TableCell className="text-center tabular-nums text-sm hidden md:table-cell">{fat ? `${fat}g` : '—'}</TableCell>
                <TableCell className="text-center">
                  {food.isVerified || food.is_verified ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Onaylı
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Bekliyor
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span tabIndex={0}>
                            <Button variant="ghost" size="icon" disabled className="h-8 w-8 pointer-events-none">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>Yakında</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteFood(food.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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
