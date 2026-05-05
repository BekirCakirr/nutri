import { useState, useMemo, useEffect } from 'react'
import { useRecipes } from '@/hooks/use-recipes'
import { useNavigate } from 'react-router-dom'
import { Search, Sparkles, Clock, Flame, ChefHat } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/shared/page-container'
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'



// UUID format mock — eslesir backend seed ID'leri ile (11111111-1111-1111-1111-00000000000N)
// Boylece backend ayakta degilken bile detay sayfasina gidip "404 yerine olasi 500" almazsin.
const mockRecipes: RecipeCardData[] = [
  { id: '11111111-1111-1111-1111-000000000001', title: 'Izgara Tavuk Salatası', category: 'Salata', calories: 385, prepTime: 18, image: '', difficulty: 'Kolay', protein: 35, carbs: 12, fat: 18, servings: 2 },
  { id: '11111111-1111-1111-1111-000000000002', title: 'Yulaflı Muzlu Smoothie', category: 'İçecek', calories: 340, prepTime: 5, image: '', difficulty: 'Kolay', protein: 14, carbs: 52, fat: 8, servings: 1 },
  { id: '11111111-1111-1111-1111-000000000003', title: 'Mercimek Çorbası', category: 'Çorba', calories: 185, prepTime: 35, image: '', difficulty: 'Kolay', protein: 12, carbs: 28, fat: 4, servings: 4 },
  { id: '11111111-1111-1111-1111-000000000004', title: 'Fırında Somon ve Sebze', category: 'Ana Yemek', calories: 420, prepTime: 35, image: '', difficulty: 'Orta', protein: 38, carbs: 14, fat: 24, servings: 2 },
  { id: '11111111-1111-1111-1111-000000000005', title: 'Sebzeli Bulgur Pilavı', category: 'Ana Yemek', calories: 290, prepTime: 35, image: '', difficulty: 'Kolay', protein: 9, carbs: 52, fat: 5, servings: 4 },
  { id: '11111111-1111-1111-1111-000000000006', title: 'Yumurtalı Sebzeli Omlet', category: 'Kahvaltı', calories: 320, prepTime: 13, image: '', difficulty: 'Kolay', protein: 22, carbs: 6, fat: 22, servings: 1 },
  { id: '11111111-1111-1111-1111-000000000007', title: 'Yoğurtlu Sebze Çorbası', category: 'Çorba', calories: 165, prepTime: 40, image: '', difficulty: 'Orta', protein: 8, carbs: 18, fat: 7, servings: 4 },
  { id: '11111111-1111-1111-1111-000000000008', title: 'Avokadolu Tavuklu Sandviç', category: 'Atıştırmalık', calories: 445, prepTime: 18, image: '', difficulty: 'Kolay', protein: 32, carbs: 38, fat: 18, servings: 2 },
]

// ── Yemek goselleri (Unsplash) — her tarif icin sabit, anlamli foto ───────
const recipeImageByName: Record<string, string> = {
  // Salata / sandvic / ana
  'Izgara Tavuk Salatası': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=70&auto=format&fit=crop',
  'Yulaflı Muzlu Smoothie': 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=600&q=70&auto=format&fit=crop',
  'Mercimek Çorbası': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=70&auto=format&fit=crop',
  'Fırında Somon ve Sebze': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=70&auto=format&fit=crop',
  'Sebzeli Bulgur Pilavı': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=70&auto=format&fit=crop',
  'Yumurtalı Sebzeli Omlet': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=70&auto=format&fit=crop',
  'Yoğurtlu Sebze Çorbası': 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&q=70&auto=format&fit=crop',
  'Avokadolu Tavuklu Sandviç': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=70&auto=format&fit=crop',
}

function imageForRecipe(title: string, fallbackUrl?: string): string {
  if (fallbackUrl && fallbackUrl.startsWith('http')) return fallbackUrl
  if (recipeImageByName[title]) return recipeImageByName[title]
  // Deterministic seed -> stable picsum image per title
  const seed = encodeURIComponent(title || 'recipe')
  return `https://picsum.photos/seed/nutri-${seed}/600/400`
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const categories = ['Tümü', 'Ana Yemek', 'Çorba', 'Salata', 'Kahvaltı', 'İçecek', 'Atıştırmalık', 'Tatlı']

const difficultyColor: Record<string, 'success' | 'warning' | 'destructive'> = {
  Kolay: 'success',
  Orta: 'warning',
  Zor: 'destructive',
  easy: 'success',
  medium: 'warning',
  hard: 'destructive',
}

const difficultyLabel: Record<string, string> = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
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
  const apiRecipeList: RecipeCardData[] = (Array.isArray(allRecipes) ? allRecipes : []).map((r) => {
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
        <Button size="sm" disabled title="Yakında kullanılabilir olacak" className="opacity-60 cursor-not-allowed">
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
            onClick={() => {
              // UUID guard: non-UUID id'lerle backend'e gidip 500 alma
              if (UUID_RE.test(recipe.id)) navigate(`/recipes/${recipe.id}`)
            }}
          >
            <div className="h-36 bg-secondary/50 overflow-hidden">
              <img
                src={imageForRecipe(recipe.title, recipe.image)}
                alt={recipe.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  // Final fallback: deterministic picsum
                  const seed = encodeURIComponent(recipe.title || 'recipe')
                  ;(e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/nutri-${seed}/600/400`
                }}
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px]">{recipe.category}</Badge>
                <Badge variant={difficultyColor[recipe.difficulty] ?? 'secondary'} className="text-[10px]">
                  {difficultyLabel[recipe.difficulty] ?? recipe.difficulty}
                </Badge>
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
