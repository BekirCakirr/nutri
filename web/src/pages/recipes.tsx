import { useState, useMemo, useEffect } from 'react'
import { useRecipes } from '@/hooks/use-recipes'
import { useNavigate } from 'react-router-dom'
import { Search, Sparkles, Clock, Flame, ChefHat, ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/shared/page-container'
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'



const mockRecipes: RecipeCardData[] = [
  { id: 'mock-1', title: 'Mercimek Çorbası', category: 'Çorba', calories: 180, prepTime: 30, image: '', difficulty: 'Kolay', protein: 12, carbs: 28, fat: 3, servings: 4 },
  { id: 'mock-2', title: 'Izgara Tavuk Salata', category: 'Salata', calories: 320, prepTime: 20, image: '', difficulty: 'Kolay', protein: 35, carbs: 12, fat: 14, servings: 2 },
  { id: 'mock-3', title: 'Karnıyarık', category: 'Ana Yemek', calories: 410, prepTime: 60, image: '', difficulty: 'Orta', protein: 22, carbs: 30, fat: 24, servings: 4 },
  { id: 'mock-4', title: 'Ezogelin Çorbası', category: 'Çorba', calories: 165, prepTime: 35, image: '', difficulty: 'Kolay', protein: 8, carbs: 26, fat: 4, servings: 6 },
  { id: 'mock-5', title: 'Fırında Somon', category: 'Ana Yemek', calories: 380, prepTime: 40, image: '', difficulty: 'Orta', protein: 38, carbs: 5, fat: 22, servings: 2 },
  { id: 'mock-6', title: 'Çoban Salata', category: 'Salata', calories: 95, prepTime: 10, image: '', difficulty: 'Kolay', protein: 3, carbs: 10, fat: 5, servings: 4 },
  { id: 'mock-7', title: 'Humus', category: 'Atıştırmalık', calories: 210, prepTime: 15, image: '', difficulty: 'Kolay', protein: 9, carbs: 22, fat: 10, servings: 4 },
  { id: 'mock-8', title: 'Sütlaç', category: 'Tatlı', calories: 240, prepTime: 45, image: '', difficulty: 'Orta', protein: 7, carbs: 42, fat: 5, servings: 6 },
  { id: 'mock-9', title: 'İçli Köfte', category: 'Ana Yemek', calories: 350, prepTime: 90, image: '', difficulty: 'Zor', protein: 18, carbs: 35, fat: 16, servings: 6 },
  { id: 'mock-10', title: 'Kereviz Yemeği', category: 'Ana Yemek', calories: 190, prepTime: 50, image: '', difficulty: 'Orta', protein: 6, carbs: 22, fat: 8, servings: 4 },
  { id: 'mock-11', title: 'Cevizli Kabak Tatlısı', category: 'Tatlı', calories: 280, prepTime: 60, image: '', difficulty: 'Kolay', protein: 4, carbs: 48, fat: 9, servings: 8 },
  { id: 'mock-12', title: 'Yoğurtlu Semizotu', category: 'Salata', calories: 120, prepTime: 15, image: '', difficulty: 'Kolay', protein: 5, carbs: 8, fat: 7, servings: 4 },
  { id: 'mock-13', title: 'Kuru Fasulye', category: 'Ana Yemek', calories: 310, prepTime: 80, image: '', difficulty: 'Orta', protein: 18, carbs: 42, fat: 8, servings: 6 },
  { id: 'mock-14', title: 'Havuç Çorbası', category: 'Çorba', calories: 140, prepTime: 25, image: '', difficulty: 'Kolay', protein: 4, carbs: 20, fat: 5, servings: 4 },
]

const categories = ['Tümü', 'Ana Yemek', 'Çorba', 'Salata', 'Atıştırmalık', 'Tatlı']

const difficultyColor: Record<string, 'success' | 'warning' | 'destructive'> = {
  Kolay: 'success',
  Orta: 'warning',
  Zor: 'destructive',
}

type RecipeCardData = {
  id: string; title: string; category: string;
  calories: number; prepTime: number;
  image: string; difficulty: string;
  protein: number; carbs: number; fat: number;
  servings: number;
}

export default function RecipesPage() {
  const navigate = useNavigate()
  const { allRecipes, fetchRecipes, isLoading } = useRecipes()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tümü')

  useEffect(() => {
    fetchRecipes()
  }, [])

  // Map hook recipes to local type
  const apiRecipeList: RecipeCardData[] = allRecipes.map((r) => {
    const raw = r as unknown as Record<string, unknown>;
    return {
      id: r.id,
      title: r.name ?? (raw.title as string) ?? '',
      category: r.category ?? '',
      calories: r.calories ?? 0,
      prepTime: r.preparationTime ?? (raw.prepTime as number) ?? 0,
      image: r.imageUrl ?? (raw.image as string) ?? '',
      difficulty: r.difficulty ?? 'medium',
      protein: r.protein ?? 0,
      carbs: r.carbohydrates ?? (raw.carbs as number) ?? 0,
      fat: r.fat ?? 0,
      servings: r.servings ?? 1,
    };
  })

  const recipeList = apiRecipeList.length > 0 ? apiRecipeList : mockRecipes

  const filtered = useMemo(
    () =>
      recipeList.filter((r) => {
        const matchesSearch = (r.title ?? '').toLowerCase().includes(search.toLowerCase())
        const matchesCategory = category === 'Tümü' || r.category === category
        return matchesSearch && matchesCategory
      }),
    [search, category, recipeList]
  )

  if (isLoading) return <ListPageSkeleton />

  return (
    <PageContainer
      title="Tarifler"
      description="Sağlıklı tarif koleksiyonunuzu keşfedin"
      actions={
        <Button size="sm">
          <Sparkles className="h-3.5 w-3.5" />
          AI ile Tarif Oluştur
        </Button>
      }
    >
      {/* Filters */}
      <Card className="py-0 gap-0 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tarif ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <Button key={cat} variant={category === cat ? 'default' : 'outline'} size="xs" onClick={() => setCategory(cat)}>
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in-stagger">
        {filtered.map((recipe) => (
          <Card
            key={recipe.id}
            className="cursor-pointer hover:shadow-md transition-all py-0 gap-0 overflow-hidden"
            onClick={() => navigate(`/recipes/${recipe.id}`)}
          >
            <div className="h-36 bg-secondary/50 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px]">{recipe.category}</Badge>
                <Badge variant={difficultyColor[recipe.difficulty] ?? 'secondary'} className="text-[10px]">{recipe.difficulty}</Badge>
              </div>
              <h3 className="font-semibold text-sm leading-tight">{recipe.title}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{recipe.calories} kcal</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{recipe.prepTime} dk</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="rounded-md bg-secondary/50 px-1 py-1.5">
                  <p className="text-muted-foreground">Protein</p>
                  <p className="font-semibold tabular-nums">{recipe.protein}g</p>
                </div>
                <div className="rounded-md bg-secondary/50 px-1 py-1.5">
                  <p className="text-muted-foreground">Karb.</p>
                  <p className="font-semibold tabular-nums">{recipe.carbs}g</p>
                </div>
                <div className="rounded-md bg-secondary/50 px-1 py-1.5">
                  <p className="text-muted-foreground">Yağ</p>
                  <p className="font-semibold tabular-nums">{recipe.fat}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState icon={ChefHat} title="Tarif bulunamadı" description="Arama kriterlerinize uygun tarif yok." />
      )}
    </PageContainer>
  )
}
