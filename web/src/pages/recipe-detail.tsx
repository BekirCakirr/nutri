import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Flame, Users, Plus, ImageIcon, Printer } from 'lucide-react'
import { DetailPageSkeleton } from '@/components/shared/page-skeletons'
import { getRecipe } from '@/services/recipe.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type RecipeDetailState = {
  id: string; title: string; description: string; category: string;
  calories: number; protein: number; carbs: number; fat: number;
  prepTime: number; cookTime: number; servings: number; difficulty: string;
  fiber: number; sodium: number;
  ingredients: { name: string; amount: string }[];
  steps: string[];
}

export default function RecipeDetailPage() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState<RecipeDetailState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const load = async () => {
      setIsLoading(true)
      try {
        if (id && UUID_RE.test(id)) {
          const rawData = await getRecipe(id)
          const data = rawData as unknown as Partial<RecipeDetailState> & { 
            name?: string; caloriesPerServing?: number; proteinPerServing?: number;
            carbsPerServing?: number; fatPerServing?: number; prepTimeMin?: number;
            cookTimeMin?: number;
          };
          if (data) {
            setRecipe({
              id: data.id ?? '',
              title: data.name ?? 'İsimsiz Tarif',
              description: data.description ?? '',
              category: data.category ?? '',
              calories: data.caloriesPerServing ?? data.calories ?? 0,
              protein: data.proteinPerServing ?? data.protein ?? 0,
              carbs: data.carbsPerServing ?? data.carbs ?? 0,
              fat: data.fatPerServing ?? data.fat ?? 0,
              prepTime: data.prepTimeMin ?? 0,
              cookTime: data.cookTimeMin ?? 0,
              servings: data.servings ?? 1,
              difficulty: data.difficulty ?? '',
              fiber: data.fiber ?? 0,
              sodium: data.sodium ?? 0,
              ingredients: data.ingredients ?? [],
              steps: data.steps ?? [],
            })
          }
        }
      } catch {}
      setIsLoading(false)
    }
    load()
  }, [id])

  const navigate = useNavigate()

  if (isLoading || !recipe) return <DetailPageSkeleton />

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate('/recipes')} className="mt-1">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline">{recipe.category}</Badge>
            <Badge variant="success">{recipe.difficulty}</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{recipe.title}</h1>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon-sm"
            title="Tarifi yazdır"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            title="Yakında kullanılabilir olacak"
            disabled
            className="opacity-60 cursor-not-allowed"
          >
            <Plus className="h-3.5 w-3.5" />Plana Ekle
          </Button>
        </div>
      </div>

      {/* Image placeholder */}
      <div className="h-56 bg-secondary/50 rounded-xl flex items-center justify-center">
        <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">{recipe.description}</p>

      {/* Quick info */}
      <div className="flex items-center gap-6 flex-wrap text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4" />Hazırlık: {recipe.prepTime} dk</span>
        <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4" />Pişirme: {recipe.cookTime} dk</span>
        <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-4 w-4" />{recipe.servings} kişilik</span>
        <span className="flex items-center gap-1.5 text-muted-foreground"><Flame className="h-4 w-4" />{recipe.calories} kcal</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Besin Değerleri</CardTitle></CardHeader>
            <CardContent className="space-y-2.5">
              {[
                ['Kalori', `${recipe.calories} kcal`],
                ['Protein', `${recipe.protein}g`],
                ['Karbonhidrat', `${recipe.carbs}g`],
                ['Yağ', `${recipe.fat}g`],
                ['Lif', `${recipe.fiber}g`],
                ['Sodyum', `${recipe.sodium}mg`],
              ].map(([label, val], i) => (
                <div key={label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium tabular-nums">{val}</span>
                  </div>
                  {i < 5 && <Separator className="mt-2.5" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Malzemeler</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span>{ing.name}</span>
                    <span className="text-muted-foreground tabular-nums">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right column — Steps */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-sm">Hazırlanışı</CardTitle></CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </div>
                    <p className="text-sm pt-0.5 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
