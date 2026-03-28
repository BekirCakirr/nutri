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
import { searchFoods } from '@/services/food.service'
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'

interface FoodDBItem {
  id: string
  name: string
  category: string
  caloriesPer100g: number
  protein: number
  carbs: number
  fat: number
  source: string
  isVerified: boolean
}

export default function AdminFoodDBPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [foods, setFoods] = useState<FoodDBItem[]>([])

  const loadFoods = useCallback(async (query: string) => {
    setIsLoading(true)
    try {
      const results = await searchFoods(query || 'a')
      setFoods(results.map((f: any) => ({
        id: f.id,
        name: f.name ?? '',
        category: f.category ?? '',
        caloriesPer100g: f.caloriesPer100g ?? f.nutrition?.calories ?? 0,
        protein: f.proteinPer100g ?? f.nutrition?.protein ?? 0,
        carbs: f.carbsPer100g ?? f.nutrition?.carbohydrates ?? 0,
        fat: f.fatPer100g ?? f.nutrition?.fat ?? 0,
        source: f.source ?? '',
        isVerified: f.isVerified ?? false,
      })))
    } catch {
      // silently fail — keep existing data
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadFoods(search) }, [])

  const filtered = foods.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(foods.map(f => f.category))]

  if (isLoading) return <ListPageSkeleton />

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
                <Input placeholder="Tavuk Göğsü" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kalori (100g)</Label>
                  <Input type="number" placeholder="165" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Protein (g)</Label>
                  <Input type="number" placeholder="31" />
                </div>
                <div className="space-y-2">
                  <Label>Karbonhidrat (g)</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Yağ (g)</Label>
                  <Input type="number" placeholder="3.6" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kaynak</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usda">USDA</SelectItem>
                    <SelectItem value="custom">Özel</SelectItem>
                    <SelectItem value="community">Topluluk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
              <Button onClick={() => setDialogOpen(false)}>Ekle</Button>
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
              <TableHead>Besin Adı</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-center">Kalori</TableHead>
              <TableHead className="text-center">Protein</TableHead>
              <TableHead className="text-center hidden md:table-cell">Karb.</TableHead>
              <TableHead className="text-center hidden md:table-cell">Yağ</TableHead>
              <TableHead className="hidden lg:table-cell">Kaynak</TableHead>
              <TableHead className="text-center">Durum</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <EmptyState icon={Apple} title="Besin bulunamadı" description="Arama kriterlerinize uygun besin yok." />
                </TableCell>
              </TableRow>
            ) : filtered.map((food) => (
              <TableRow key={food.id}>
                <TableCell>
                  <span className="text-sm font-medium">{food.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{food.category}</Badge>
                </TableCell>
                <TableCell className="text-center tabular-nums text-sm">{food.caloriesPer100g}</TableCell>
                <TableCell className="text-center tabular-nums text-sm">{food.protein}g</TableCell>
                <TableCell className="text-center tabular-nums text-sm hidden md:table-cell">{food.carbs}g</TableCell>
                <TableCell className="text-center tabular-nums text-sm hidden md:table-cell">{food.fat}g</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-xs text-muted-foreground">{food.source}</span>
                </TableCell>
                <TableCell className="text-center">
                  {food.isVerified ? (
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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
