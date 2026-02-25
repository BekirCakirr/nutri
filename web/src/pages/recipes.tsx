import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Sparkles,
  Clock,
  Flame,
  UtensilsCrossed,
  ImageIcon,
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

interface Recipe {
  id: string
  title: string
  category: string
  calories: number
  prepTime: number
  protein: number
  carbs: number
  fat: number
  difficulty: 'Kolay' | 'Orta' | 'Zor'
}

const mockRecipes: Recipe[] = [
  { id: '1', title: 'Izgara Tavuk Salata', category: 'Ana Yemek', calories: 380, prepTime: 25, protein: 35, carbs: 12, fat: 18, difficulty: 'Kolay' },
  { id: '2', title: 'Mercimek Çorbası', category: 'Çorba', calories: 220, prepTime: 35, protein: 14, carbs: 32, fat: 6, difficulty: 'Kolay' },
  { id: '3', title: 'Kinoa Tabouleh', category: 'Salata', calories: 280, prepTime: 20, protein: 8, carbs: 38, fat: 10, difficulty: 'Kolay' },
  { id: '4', title: 'Fırında Somon', category: 'Ana Yemek', calories: 450, prepTime: 30, protein: 42, carbs: 8, fat: 28, difficulty: 'Orta' },
  { id: '5', title: 'Yoğurtlu Meyve Kasesi', category: 'Atıştırmalık', calories: 180, prepTime: 10, protein: 12, carbs: 28, fat: 4, difficulty: 'Kolay' },
  { id: '6', title: 'Chia Puding', category: 'Tatlı', calories: 200, prepTime: 15, protein: 8, carbs: 24, fat: 8, difficulty: 'Kolay' },
  { id: '7', title: 'Sebzeli Omlet', category: 'Ana Yemek', calories: 320, prepTime: 15, protein: 22, carbs: 8, fat: 22, difficulty: 'Kolay' },
  { id: '8', title: 'Ezogelin Çorbası', category: 'Çorba', calories: 190, prepTime: 40, protein: 10, carbs: 30, fat: 4, difficulty: 'Orta' },
  { id: '9', title: 'Avokado Toast', category: 'Atıştırmalık', calories: 290, prepTime: 10, protein: 8, carbs: 28, fat: 18, difficulty: 'Kolay' },
  { id: '10', title: 'Tavuklu Wrap', category: 'Ana Yemek', calories: 420, prepTime: 20, protein: 30, carbs: 38, fat: 16, difficulty: 'Kolay' },
  { id: '11', title: 'Akdeniz Salatası', category: 'Salata', calories: 250, prepTime: 15, protein: 6, carbs: 18, fat: 16, difficulty: 'Kolay' },
  { id: '12', title: 'Protein Topları', category: 'Atıştırmalık', calories: 160, prepTime: 15, protein: 10, carbs: 18, fat: 6, difficulty: 'Kolay' },
]

const categories = ['Tümü', 'Ana Yemek', 'Çorba', 'Salata', 'Atıştırmalık', 'Tatlı']

export default function RecipesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tümü')

  const filtered = mockRecipes.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'Tümü' || r.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tarifler</h1>
          <p className="text-muted-foreground">Sağlıklı tarif koleksiyonunuzu keşfedin.</p>
        </div>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          AI ile Tarif Oluştur
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tarif ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((recipe) => (
          <Card
            key={recipe.id}
            className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
            onClick={() => navigate(`/recipes/${recipe.id}`)}
          >
            {/* Image Placeholder */}
            <div className="h-40 bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-8 w-8 mx-auto mb-1" />
                <p className="text-xs">Tarif Görseli</p>
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">{recipe.category}</Badge>
                  <Badge variant="secondary" className="text-xs">{recipe.difficulty}</Badge>
                </div>
                <h3 className="font-semibold mt-2">{recipe.title}</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5" />
                  <span>{recipe.calories} kcal</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{recipe.prepTime} dk</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-muted/50 rounded p-1">
                  <p className="text-muted-foreground">Protein</p>
                  <p className="font-medium">{recipe.protein}g</p>
                </div>
                <div className="bg-muted/50 rounded p-1">
                  <p className="text-muted-foreground">Karb.</p>
                  <p className="font-medium">{recipe.carbs}g</p>
                </div>
                <div className="bg-muted/50 rounded p-1">
                  <p className="text-muted-foreground">Yağ</p>
                  <p className="font-medium">{recipe.fat}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <UtensilsCrossed className="h-12 w-12 mx-auto mb-3" />
          <p className="text-lg font-medium">Tarif bulunamadı</p>
          <p className="text-sm">Farklı bir arama terimi veya kategori deneyin.</p>
        </div>
      )}
    </div>
  )
}
