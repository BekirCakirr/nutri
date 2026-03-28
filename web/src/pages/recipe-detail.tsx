import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Flame, Users, Plus, ImageIcon, Printer } from 'lucide-react'
import { DetailPageSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { getRecipe } from '@/services/recipe.service'
import type { Recipe } from '@/services/recipe.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const difficultyLabel: Record<string, string> = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
  expert: 'Uzman',
}

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) { setNotFound(true); setIsLoading(false); return }
    const load = async () => {
      try {
        const data = await getRecipe(id)
        if (data) setRecipe(data)
        else setNotFound(true)
      } catch {
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  if (isLoading) return <DetailPageSkeleton />

  if (notFound || !recipe) {
    return (
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/recipes')} className="-ml-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Tarifler
        </Button>
        <EmptyState
          icon={ImageIcon}
          title="Tarif bulunamadı"
          description="Bu tarif mevcut değil veya kaldırılmış olabilir."
        />
      </div>
    )
  }

  const calories = (recipe as any).nutritionPerServing?.calories ?? (recipe as any).caloriesPerServing ?? (recipe as any).calories ?? 0
  const protein = (recipe as any).nutritionPerServing?.protein ?? (recipe as any).proteinPerServing ?? (recipe as any).protein ?? 0
  const carbs = (recipe as any).nutritionPerServing?.carbohydrates ?? (recipe as any).carbsPerServing ?? (recipe as any).carbs ?? 0
  const fat = (recipe as any).nutritionPerServing?.fat ?? (recipe as any).fatPerServing ?? (recipe as any).fat ?? 0
  const fiber = (recipe as any).nutritionPerServing?.fiber ?? (recipe as any).fiber ?? 0
  const sodium = (recipe as any).nutritionPerServing?.sodium ?? (recipe as any).sodium ?? 0
  const prepTime = (recipe as any).prepTimeMinutes ?? (recipe as any).prepTimeMin ?? (recipe as any).prepTime ?? 0
  const cookTime = (recipe as any).cookTimeMinutes ?? (recipe as any).cookTimeMin ?? (recipe as any).cookTime ?? 0
  const title = (recipe as any).name ?? recipe.title ?? ''
  const description = recipe.description ?? ''
  const difficulty = difficultyLabel[recipe.difficulty] ?? recipe.difficulty
  const category = (recipe as any).categoryLabel ?? recipe.category ?? ''
  const ingredients: Array<{ name: string; amount: string }> = ((recipe as any).ingredients ?? []).map((ing: any) => ({
    name: ing.name ?? '',
    amount: ing.amount != null ? `${ing.amount}${ing.unit ? ` ${ing.unit}` : ''}` : '',
  }))
  const steps: string[] = ((recipe as any).steps ?? []).map((s: any) =>
    typeof s === 'string' ? s : (s.instruction ?? '')
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate('/recipes')} className="mt-1">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline">{category}</Badge>
            <Badge variant="success">{difficulty}</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="icon-sm"><Printer className="h-4 w-4" /></Button>
          <Button size="sm"><Plus className="h-3.5 w-3.5" />Plana Ekle</Button>
        </div>
      </div>

      {/* Image placeholder */}
      {recipe.imageUrl ? (
        <img src={recipe.imageUrl} alt={title} className="h-56 w-full object-cover rounded-xl" />
      ) : (
        <div className="h-56 bg-secondary/50 rounded-xl flex items-center justify-center">
          <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
        </div>
      )}

      {/* Description */}
      {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}

      {/* Quick info */}
      <div className="flex items-center gap-6 flex-wrap text-sm">
        {prepTime > 0 && <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4" />Hazırlık: {prepTime} dk</span>}
        {cookTime > 0 && <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4" />Pişirme: {cookTime} dk</span>}
        {recipe.servings > 0 && <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-4 w-4" />{recipe.servings} kişilik</span>}
        {calories > 0 && <span className="flex items-center gap-1.5 text-muted-foreground"><Flame className="h-4 w-4" />{calories} kcal</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Besin Değerleri</CardTitle></CardHeader>
            <CardContent className="space-y-2.5">
              {[
                ['Kalori', `${calories} kcal`],
                ['Protein', `${protein}g`],
                ['Karbonhidrat', `${carbs}g`],
                ['Yağ', `${fat}g`],
                ['Lif', `${fiber}g`],
                ['Sodyum', `${sodium}mg`],
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

          {ingredients.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Malzemeler</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span>{ing.name}</span>
                      <span className="text-muted-foreground tabular-nums">{ing.amount}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column — Steps */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-sm">Hazırlanışı</CardTitle></CardHeader>
            <CardContent>
              {steps.length > 0 ? (
                <ol className="space-y-4">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {i + 1}
                      </div>
                      <p className="text-sm pt-0.5 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">Hazırlanış adımları mevcut değil.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
