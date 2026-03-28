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



const categories = ['Tümü', 'Ana Yemek', 'Çorba', 'Salata', 'Atıştırmalık', 'Tatlı']

const difficultyColor = {
  Kolay: 'success' as const,
  Orta: 'warning' as const,
  Zor: 'destructive' as const,
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
  const recipeList = allRecipes.map((r: any) => ({
      id: r.id, title: r.name ?? r.title ?? '', category: r.category ?? '',
      calories: r.calories ?? 0, prepTime: r.preparationTime ?? r.prepTime ?? 0,
      image: r.imageUrl ?? r.image ?? '', difficulty: r.difficulty ?? 'medium',
      protein: r.protein ?? 0, carbs: r.carbohydrates ?? r.carbs ?? 0, fat: r.fat ?? 0,
      servings: r.servings ?? 1,
    } as any))

  const filtered = useMemo(
    () =>
      recipeList.filter((r: any) => {
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
                <Badge variant={(difficultyColor as any)[recipe.difficulty] ?? 'secondary'} className="text-[10px]">{recipe.difficulty}</Badge>
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
