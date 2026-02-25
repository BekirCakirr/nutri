import { useState } from 'react'
import {
  Search,
  Filter,
  Check,
  X,
  ImageIcon,
  ChevronDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface MealReview {
  id: string
  patientName: string
  patientId: string
  date: string
  mealType: string
  items: string[]
  totalCalories: number
  protein: number
  carbs: number
  fat: number
  imageUrl: string | null
  status: 'pending' | 'approved' | 'rejected'
}

const mockReviews: MealReview[] = [
  {
    id: '1', patientName: 'Ayşe Yılmaz', patientId: '1', date: '2026-02-25', mealType: 'Kahvaltı',
    items: ['Yulaf ezmesi (200g)', 'Muz (1 adet)', 'Bal (1 yemek kaşığı)', 'Ceviz (30g)'],
    totalCalories: 420, protein: 12, carbs: 65, fat: 14, imageUrl: null, status: 'pending',
  },
  {
    id: '2', patientName: 'Mehmet Kaya', patientId: '2', date: '2026-02-25', mealType: 'Öğle',
    items: ['Tavuk göğsü (150g)', 'Bulgur pilavı (200g)', 'Mevsim salata', 'Ayran (1 bardak)'],
    totalCalories: 580, protein: 42, carbs: 68, fat: 12, imageUrl: null, status: 'pending',
  },
  {
    id: '3', patientName: 'Fatma Demir', patientId: '3', date: '2026-02-25', mealType: 'Akşam',
    items: ['Izgara somon (200g)', 'Kuşkonmaz (150g)', 'Kinoa (100g)'],
    totalCalories: 520, protein: 45, carbs: 30, fat: 22, imageUrl: null, status: 'pending',
  },
  {
    id: '4', patientName: 'Zeynep Çelik', patientId: '5', date: '2026-02-25', mealType: 'Ara Öğün',
    items: ['Yoğurt (200g)', 'Çilek (100g)', 'Chia tohumu (1 yemek kaşığı)'],
    totalCalories: 180, protein: 10, carbs: 22, fat: 6, imageUrl: null, status: 'pending',
  },
  {
    id: '5', patientName: 'Elif Arslan', patientId: '7', date: '2026-02-24', mealType: 'Kahvaltı',
    items: ['Omlet (3 yumurta)', 'Tam buğday ekmek (2 dilim)', 'Peynir (40g)', 'Domates-salatalık'],
    totalCalories: 480, protein: 28, carbs: 35, fat: 24, imageUrl: null, status: 'pending',
  },
]

export default function MealReviewPage() {
  const [reviews, setReviews] = useState(mockReviews)
  const [search, setSearch] = useState('')
  const [mealTypeFilter, setMealTypeFilter] = useState('all')
  const [notes, setNotes] = useState<Record<string, string>>({})

  const filtered = reviews.filter((r) => {
    const matchesSearch = r.patientName.toLowerCase().includes(search.toLowerCase())
    const matchesMealType = mealTypeFilter === 'all' || r.mealType === mealTypeFilter
    return matchesSearch && matchesMealType && r.status === 'pending'
  })

  const handleApprove = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r))
  }

  const handleReject = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Öğün Değerlendirme</h1>
        <p className="text-muted-foreground">Hastaların kaydettiği öğünleri inceleyin ve onaylayın.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Hasta ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Öğün Tipi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="Kahvaltı">Kahvaltı</SelectItem>
              <SelectItem value="Öğle">Öğle</SelectItem>
              <SelectItem value="Akşam">Akşam</SelectItem>
              <SelectItem value="Ara Öğün">Ara Öğün</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {filtered.length} bekleyen öğün
        </Badge>
      </div>

      {/* Meal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((review) => (
          <Card key={review.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {review.patientName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{review.patientName}</CardTitle>
                    <p className="text-xs text-muted-foreground">{review.date} &middot; {review.mealType}</p>
                  </div>
                </div>
                <Badge variant="outline">{review.mealType}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Photo placeholder */}
              <div className="h-32 rounded-lg bg-muted/50 border-2 border-dashed flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-6 w-6 mx-auto mb-1" />
                  <p className="text-xs">Öğün fotoğrafı</p>
                </div>
              </div>

              {/* Food items */}
              <div>
                <p className="text-sm font-medium mb-2">Yiyecekler</p>
                <ul className="space-y-1">
                  {review.items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Nutrition breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-xs text-muted-foreground">Kalori</p>
                  <p className="font-semibold text-sm">{review.totalCalories}</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="font-semibold text-sm">{review.protein}g</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-xs text-muted-foreground">Karb.</p>
                  <p className="font-semibold text-sm">{review.carbs}g</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-xs text-muted-foreground">Yağ</p>
                  <p className="font-semibold text-sm">{review.fat}g</p>
                </div>
              </div>

              {/* Notes */}
              <Textarea
                placeholder="Not ekle (isteğe bağlı)..."
                value={notes[review.id] || ''}
                onChange={(e) => setNotes(prev => ({ ...prev, [review.id]: e.target.value }))}
                className="resize-none"
                rows={2}
              />

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleApprove(review.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Onayla
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleReject(review.id)}>
                  <X className="mr-2 h-4 w-4" />
                  Reddet
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Check className="h-12 w-12 mx-auto text-green-500 mb-3" />
            <h3 className="text-lg font-semibold">Tüm öğünler değerlendirildi!</h3>
            <p className="text-muted-foreground">Bekleyen öğün bulunmuyor.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
