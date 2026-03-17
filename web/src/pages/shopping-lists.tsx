import { useState, useEffect } from 'react'
import { Plus, ShoppingCart, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { PageContainer } from '@/components/shared/page-container'
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { cn } from '@/lib/utils'

interface ShoppingItem { id: string; name: string; amount: string; category: string; checked: boolean }
interface ShoppingList { id: string; name: string; patientName: string; createdAt: string; status: 'active' | 'completed'; items: ShoppingItem[] }

const mockLists: ShoppingList[] = [
  { id: '1', name: 'Haftalık Alışveriş - Ayşe Yılmaz', patientName: 'Ayşe Yılmaz', createdAt: '2026-02-24', status: 'active', items: [
    { id: '1', name: 'Tavuk göğsü', amount: '1 kg', category: 'Et', checked: false },
    { id: '2', name: 'Somon fileto', amount: '500g', category: 'Et', checked: false },
    { id: '3', name: 'Yumurta', amount: '1 koli', category: 'Et', checked: true },
    { id: '4', name: 'Brokoli', amount: '500g', category: 'Sebze', checked: false },
    { id: '5', name: 'Ispanak', amount: '300g', category: 'Sebze', checked: false },
    { id: '6', name: 'Domates', amount: '1 kg', category: 'Sebze', checked: true },
    { id: '7', name: 'Muz', amount: '1 demet', category: 'Meyve', checked: false },
    { id: '8', name: 'Elma', amount: '1 kg', category: 'Meyve', checked: false },
    { id: '9', name: 'Yoğurt', amount: '1 kg', category: 'Süt Ürünleri', checked: false },
    { id: '10', name: 'Beyaz peynir', amount: '250g', category: 'Süt Ürünleri', checked: true },
    { id: '11', name: 'Yulaf ezmesi', amount: '500g', category: 'Diğer', checked: false },
    { id: '12', name: 'Kinoa', amount: '300g', category: 'Diğer', checked: false },
    { id: '13', name: 'Badem', amount: '200g', category: 'Diğer', checked: false },
  ]},
  { id: '2', name: 'Diyet Planı - Mehmet Kaya', patientName: 'Mehmet Kaya', createdAt: '2026-02-22', status: 'active', items: [
    { id: '14', name: 'Hindi göğsü', amount: '500g', category: 'Et', checked: false },
    { id: '15', name: 'Mercimek', amount: '500g', category: 'Diğer', checked: false },
    { id: '16', name: 'Bulgur', amount: '1 kg', category: 'Diğer', checked: true },
    { id: '17', name: 'Havuç', amount: '500g', category: 'Sebze', checked: false },
    { id: '18', name: 'Kabak', amount: '500g', category: 'Sebze', checked: false },
  ]},
  { id: '3', name: 'Geçen hafta listesi', patientName: 'Fatma Demir', createdAt: '2026-02-15', status: 'completed', items: [
    { id: '19', name: 'Tavuk', amount: '1 kg', category: 'Et', checked: true },
    { id: '20', name: 'Pirinç', amount: '1 kg', category: 'Diğer', checked: true },
  ]},
]

const categoryOrder = ['Sebze', 'Meyve', 'Et', 'Süt Ürünleri', 'Diğer']

export default function ShoppingListsPage() {
  const [lists, setLists] = useState(mockLists)
  const [selectedList, setSelectedList] = useState<string | null>('1')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 400); return () => clearTimeout(t) }, [])

  const currentList = lists.find((l) => l.id === selectedList)

  const toggleItem = (listId: string, itemId: string) => {
    setLists((prev) => prev.map((list) => {
      if (list.id !== listId) return list
      return { ...list, items: list.items.map((item) => item.id === itemId ? { ...item, checked: !item.checked } : item) }
    }))
  }

  const groupedItems = currentList
    ? categoryOrder.reduce<Record<string, ShoppingItem[]>>((acc, cat) => {
        const items = currentList.items.filter((i) => i.category === cat)
        if (items.length > 0) acc[cat] = items
        return acc
      }, {})
    : {}

  const completedCount = currentList?.items.filter((i) => i.checked).length || 0
  const totalCount = currentList?.items.length || 0
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  if (isLoading) return <ListPageSkeleton />

  return (
    <PageContainer
      title="Alışveriş Listeleri"
      description="Hasta diyet planlarına göre alışveriş listeleri"
      actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-3.5 w-3.5" />Yeni Liste</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Alışveriş Listesi</DialogTitle>
              <DialogDescription>Plandan veya manuel olarak yeni liste oluşturun.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Liste Adı</Label><Input placeholder="Haftalık Alışveriş" /></div>
              <div className="space-y-2"><Label>Hasta</Label>
                <Select><SelectTrigger><SelectValue placeholder="Hasta seçin" /></SelectTrigger>
                  <SelectContent><SelectItem value="1">Ayşe Yılmaz</SelectItem><SelectItem value="2">Mehmet Kaya</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Kaynak</Label>
                <Select><SelectTrigger><SelectValue placeholder="Kaynak seçin" /></SelectTrigger>
                  <SelectContent><SelectItem value="plan">Aktif Diyet Planından</SelectItem><SelectItem value="manual">Manuel Oluştur</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
              <Button onClick={() => setDialogOpen(false)}>Oluştur</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lists sidebar */}
        <div className="space-y-3 animate-in-stagger">
          {lists.map((list) => {
            const checked = list.items.filter((i) => i.checked).length
            const total = list.items.length
            return (
              <button
                key={list.id}
                type="button"
                className={cn(
                  'w-full text-left rounded-xl border p-4 transition-all duration-[var(--duration-fast)]',
                  selectedList === list.id ? 'ring-2 ring-primary border-primary/30 bg-primary/[0.03]' : 'bg-card hover:shadow-sm'
                )}
                onClick={() => setSelectedList(list.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm leading-tight">{list.name}</h3>
                  <Badge variant={list.status === 'active' ? 'success' : 'secondary'} className="text-[10px] ml-2 shrink-0">
                    {list.status === 'active' ? 'Aktif' : 'Tamamlandı'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{list.createdAt}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={(checked / total) * 100} className="h-1 flex-1" />
                  <span className="text-xs text-muted-foreground tabular-nums">{checked}/{total}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected list detail */}
        <div className="lg:col-span-2">
          {currentList ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{currentList.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>{completedCount} / {totalCount} ürün alındı</span>
                      <span className="text-[10px] tabular-nums">(%{Math.round(progressPercent)})</span>
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm"><Share2 className="h-3.5 w-3.5" />Paylaş</Button>
                </div>
                <Progress value={progressPercent} className="h-1.5 mt-3" />
              </CardHeader>
              <CardContent className="space-y-5">
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">{category}</h4>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={cn('flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-secondary/50 transition-colors', item.checked && 'opacity-50')}
                        >
                          <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(currentList.id, item.id)} />
                          <span className={cn('flex-1 text-sm', item.checked && 'line-through')}>{item.name}</span>
                          <span className="text-sm text-muted-foreground tabular-nums">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="mt-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="py-0 gap-0">
              <CardContent className="py-16 text-center">
                <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="font-medium">Bir liste seçin</p>
                <p className="text-sm text-muted-foreground mt-1">Veya yeni bir alışveriş listesi oluşturun.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
