import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Search,
  ShieldAlert,
  Users,
  Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageContainer } from '@/components/shared/page-container'
import { EmptyState } from '@/components/shared/empty-state'
import { StatCard } from '@/components/shared/stat-card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Allergen {
  id: number
  name: string
  name_en?: string
  category: string
  icon?: string
  description?: string
  affected_patients?: number
}

const severityLabel = (category: string) => {
  if (category === 'food_allergen') return { label: 'Gıda Alerjeni', variant: 'destructive' as const }
  if (category === 'food_intolerance') return { label: 'İntolerans', variant: 'warning' as const }
  return { label: 'Diğer', variant: 'secondary' as const }
}

export default function AdminAllergensPage() {
  const [allergens, setAllergens] = useState<Allergen[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const [newAllergen, setNewAllergen] = useState({
    name: '',
    name_en: '',
    category: 'food_allergen',
    description: '',
  })

  const fetchAllergens = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/allergens')
      // Interceptor unwraps envelope: data = { allergens: [...] } (keys already camelCased)
      const d = data as any
      const raw = d.allergens ?? d.data?.allergens ?? (Array.isArray(d) ? d : [])
      const list: Allergen[] = (Array.isArray(raw) ? raw : [])
        .map((a: any) => ({
          id: a.id,
          name: a.name,
          name_en: a.nameEn ?? a.name_en ?? '',
          category: a.category,
          icon: a.icon,
          description: a.description,
          affected_patients: a.affectedPatients ?? a.affected_patients ?? 0,
        }))
      setAllergens(list)
    } catch {
      toast.error('Alerjenler yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllergens()
  }, [fetchAllergens])

  const handleCreate = async () => {
    try {
      await api.post('/allergens', newAllergen)
      toast.success('Alerjen eklendi')
      setDialogOpen(false)
      setNewAllergen({ name: '', name_en: '', category: 'food_allergen', description: '' })
      fetchAllergens()
    } catch {
      toast.error('Alerjen eklenemedi')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/allergens/${id}`)
      toast.success('Alerjen silindi')
      setAllergens(prev => prev.filter(a => a.id !== id))
    } catch {
      toast.error('Alerjen silinemedi')
    }
  }

  const filtered = allergens.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  const allergenCount = allergens.filter(a => a.category === 'food_allergen').length
  const intoleranceCount = allergens.filter(a => a.category === 'food_intolerance').length
  const totalAffected = allergens.reduce((sum, a) => sum + (a.affected_patients || 0), 0)

  return (
    <PageContainer
      title="Alerjen Yönetimi"
      description="Sistemdeki alerjenleri yönetin ve düzenleyin."
      actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              Yeni Alerjen Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Alerjen Ekle</DialogTitle>
              <DialogDescription>Sisteme yeni bir alerjen tanımlayın.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Alerjen Adı</Label>
                  <Input
                    placeholder="Gluten"
                    value={newAllergen.name}
                    onChange={e => setNewAllergen(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>İngilizce Adı</Label>
                  <Input
                    placeholder="Gluten"
                    value={newAllergen.name_en}
                    onChange={e => setNewAllergen(p => ({ ...p, name_en: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={newAllergen.category} onValueChange={v => setNewAllergen(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food_allergen">Gıda Alerjeni</SelectItem>
                    <SelectItem value="food_intolerance">Gıda İntoleransı</SelectItem>
                    <SelectItem value="other">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Textarea
                  placeholder="Alerjen hakkında açıklama..."
                  rows={2}
                  value={newAllergen.description}
                  onChange={e => setNewAllergen(p => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
              <Button onClick={handleCreate} disabled={!newAllergen.name}>Ekle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-in-stagger">
        <StatCard
          title="Gıda Alerjeni"
          value={allergenCount}
          icon={ShieldAlert}
          color="red"
        />
        <StatCard
          title="İntolerans"
          value={intoleranceCount}
          icon={AlertTriangle}
          color="yellow"
        />
        <StatCard
          title="Etkilenen Hasta"
          value={totalAffected}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6 animate-fade-up">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Alerjen ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card className="py-0 gap-0 overflow-hidden animate-fade-up">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Alerjen</TableHead>
              <TableHead className="hidden md:table-cell">İngilizce</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-center">Etkilenen Hasta</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex items-center justify-center py-8 gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Alerjenler yükleniyor...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={AlertTriangle} title="Alerjen bulunamadı" description="Kayıtlı alerjen bulunmuyor." />
                </TableCell>
              </TableRow>
            ) : filtered.map((allergen) => {
              const cat = severityLabel(allergen.category)
              return (
                <TableRow key={allergen.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
                        allergen.category === 'food_allergen'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                      )}>
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-sm font-medium">{allergen.name}</span>
                        {allergen.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{allergen.description}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{allergen.name_en || (allergen as any).nameEn || '—'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cat.variant}>
                      {cat.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-semibold tabular-nums">{allergen.affected_patients || 0}</span>
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
                        onClick={() => handleDelete(allergen.id)}
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
