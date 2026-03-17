import { useState, useEffect } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Search,
  ShieldAlert,
  Users,
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
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { StatCard } from '@/components/shared/stat-card'
import { cn } from '@/lib/utils'

interface Allergen {
  id: string
  name: string
  code: string
  severity: 'low' | 'medium' | 'high'
  description: string
  commonFoods: string
  affectedPatients: number
}

const mockAllergens: Allergen[] = [
  { id: '1', name: 'Gluten', code: 'GLT', severity: 'high', description: 'Buğday, arpa, çavdar ve yulafta bulunan protein karışımı.', commonFoods: 'Ekmek, makarna, pasta, bisküvi', affectedPatients: 12 },
  { id: '2', name: 'Laktoz', code: 'LCT', severity: 'medium', description: 'Süt ve süt ürünlerinde bulunan şeker.', commonFoods: 'Süt, peynir, yoğurt, tereyağı', affectedPatients: 18 },
  { id: '3', name: 'Fıstık', code: 'PNT', severity: 'high', description: 'Yer fıstığı ve fıstık ürünlerinde bulunan alerjen.', commonFoods: 'Fıstık ezmesi, çerez, bazı atıştırmalıklar', affectedPatients: 5 },
  { id: '4', name: 'Kabuklu Deniz Ürünleri', code: 'SHL', severity: 'high', description: 'Karides, yengeç, istakoz gibi kabuklu deniz ürünleri.', commonFoods: 'Karides, midye, istiridye', affectedPatients: 3 },
  { id: '5', name: 'Yumurta', code: 'EGG', severity: 'medium', description: 'Yumurta beyazı ve sarısında bulunan proteinler.', commonFoods: 'Yumurta, mayonez, bazı hamur işleri', affectedPatients: 8 },
  { id: '6', name: 'Soya', code: 'SOY', severity: 'low', description: 'Soya fasulyesi ve türevlerinde bulunan protein.', commonFoods: 'Soya sosu, tofu, soya sütü', affectedPatients: 4 },
  { id: '7', name: 'Ağaç Fındıkları', code: 'TNT', severity: 'high', description: 'Ceviz, badem, fındık gibi ağaç kabuklu yemişler.', commonFoods: 'Ceviz, badem, fındık, kaju', affectedPatients: 7 },
  { id: '8', name: 'Buğday', code: 'WHT', severity: 'medium', description: 'Buğday ve buğday türevlerinde bulunan protein.', commonFoods: 'Ekmek, un, makarna', affectedPatients: 6 },
]

const severityMap = {
  low: { label: 'Düşük', variant: 'success' as const },
  medium: { label: 'Orta', variant: 'warning' as const },
  high: { label: 'Yüksek', variant: 'destructive' as const },
}

export default function AdminAllergensPage() {
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 400); return () => clearTimeout(t) }, [])

  const filtered = mockAllergens.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  const highCount = mockAllergens.filter(a => a.severity === 'high').length
  const totalAffected = mockAllergens.reduce((sum, a) => sum + a.affectedPatients, 0)

  if (isLoading) return <ListPageSkeleton />

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
                  <Input placeholder="Gluten" />
                </div>
                <div className="space-y-2">
                  <Label>Kod</Label>
                  <Input placeholder="GLT" maxLength={3} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Şiddet Seviyesi</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Düşük</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="high">Yüksek</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Textarea placeholder="Alerjen hakkında açıklama..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Yaygın Besinler</Label>
                <Input placeholder="Ekmek, makarna, pasta" />
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
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-in-stagger">
        <StatCard
          title="Toplam Alerjen"
          value={mockAllergens.length}
          icon={ShieldAlert}
          color="blue"
        />
        <StatCard
          title="Yüksek Şiddet"
          value={highCount}
          icon={AlertTriangle}
          color="red"
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
              <TableHead>Kod</TableHead>
              <TableHead>Alerjen</TableHead>
              <TableHead>Şiddet</TableHead>
              <TableHead className="hidden md:table-cell">Yaygın Besinler</TableHead>
              <TableHead className="text-center">Etkilenen Hasta</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState icon={AlertTriangle} title="Alerjen bulunamadı" description="Kayıtlı alerjen bulunmuyor." />
                </TableCell>
              </TableRow>
            ) : filtered.map((allergen) => (
              <TableRow key={allergen.id}>
                <TableCell>
                  <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-semibold">
                    {allergen.code}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
                      allergen.severity === 'high'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : allergen.severity === 'medium'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    )}>
                      <AlertTriangle className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">{allergen.name}</span>
                      <p className="text-xs text-muted-foreground line-clamp-1 md:hidden">{allergen.commonFoods}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={severityMap[allergen.severity].variant}>
                    {severityMap[allergen.severity].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate hidden md:table-cell">
                  {allergen.commonFoods}
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-semibold tabular-nums">{allergen.affectedPatients}</span>
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
