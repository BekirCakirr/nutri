import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Flame, Users, Plus, Printer } from 'lucide-react'
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
  imageUrl?: string;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
}

// Yemek goselleri — recipes.tsx ile esitlemek icin sabit eslesme
const RECIPE_IMAGE_BY_NAME: Record<string, string> = {
  'Izgara Tavuk Salatası': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=75&auto=format&fit=crop',
  'Yulaflı Muzlu Smoothie': 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=1200&q=75&auto=format&fit=crop',
  'Mercimek Çorbası': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=75&auto=format&fit=crop',
  'Fırında Somon ve Sebze': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&q=75&auto=format&fit=crop',
  'Sebzeli Bulgur Pilavı': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&q=75&auto=format&fit=crop',
  'Yumurtalı Sebzeli Omlet': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1200&q=75&auto=format&fit=crop',
  'Yoğurtlu Sebze Çorbası': 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=1200&q=75&auto=format&fit=crop',
  'Avokadolu Tavuklu Sandviç': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1200&q=75&auto=format&fit=crop',
}

function heroImageFor(title: string, providedUrl?: string | null): string {
  if (providedUrl && providedUrl.startsWith('http')) return providedUrl
  if (title && RECIPE_IMAGE_BY_NAME[title]) return RECIPE_IMAGE_BY_NAME[title]
  const seed = encodeURIComponent(title || 'recipe')
  return `https://picsum.photos/seed/nutri-${seed}/1200/600`
}

function toNum(v: unknown, fallback = 0): number {
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    const n = parseFloat(v)
    return Number.isFinite(n) ? n : fallback
  }
  return fallback
}

function instructionsToSteps(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((s) => String(s).trim()).filter(Boolean)
  if (typeof raw === 'string') {
    return raw
      .split(/\n+/)
      .map((s) => s.replace(/^\s*\d+\.\s*/, '').trim())
      .filter(Boolean)
  }
  return []
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
          const data = rawData as unknown as Record<string, unknown>;
          if (data) {
            const tags = Array.isArray(data.tags) ? (data.tags as string[]) : []
            const tagSet = new Set(tags.map((t) => t.toLowerCase()))
            const inferredCategory =
              tagSet.has('çorba') || tagSet.has('corba') ? 'Çorba'
              : tagSet.has('salata') ? 'Salata'
              : tagSet.has('kahvaltı') || tagSet.has('kahvalti') ? 'Kahvaltı'
              : tagSet.has('tatlı') || tagSet.has('tatli') ? 'Tatlı'
              : tagSet.has('smoothie') || tagSet.has('içecek') || tagSet.has('icecek') ? 'İçecek'
              : tagSet.has('atıştırmalık') || tagSet.has('atistirmalik') || tagSet.has('snack') || tagSet.has('sandviç') || tagSet.has('sandvic') ? 'Atıştırmalık'
              : 'Ana Yemek'

            const title = String(data.name ?? data.title ?? 'İsimsiz Tarif')
            const rawDifficulty = String(data.difficulty ?? '')

            setRecipe({
              id: String(data.id ?? ''),
              title,
              description: String(data.description ?? ''),
              category: String(data.category ?? inferredCategory),
              calories: toNum(data.caloriesPerServing ?? data.calories),
              protein: toNum(data.proteinPerServing ?? data.protein),
              carbs: toNum(data.carbsPerServing ?? data.carbs),
              fat: toNum(data.fatPerServing ?? data.fat),
              prepTime: toNum(data.prepTimeMin ?? data.prepTime),
              cookTime: toNum(data.cookTimeMin ?? data.cookTime),
              servings: toNum(data.servings, 1),
              difficulty: DIFFICULTY_LABEL[rawDifficulty] ?? rawDifficulty,
              fiber: toNum(data.fiber),
              sodium: toNum(data.sodium),
              ingredients: Array.isArray(data.ingredients)
                ? (data.ingredients as { name: string; amount: string }[])
                : [],
              steps: instructionsToSteps(data.instructions ?? data.steps),
              imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : '',
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
            <Badge
              variant={
                recipe.difficulty === 'Kolay'
                  ? 'success'
                  : recipe.difficulty === 'Orta'
                  ? 'warning'
                  : recipe.difficulty === 'Zor'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {recipe.difficulty || '—'}
            </Badge>
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

      {/* Hero image */}
      <div className="h-56 sm:h-72 bg-secondary/50 rounded-xl overflow-hidden">
        <img
          src={heroImageFor(recipe.title, recipe.imageUrl)}
          alt={recipe.title}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => {
            const seed = encodeURIComponent(recipe.title || 'recipe')
            ;(e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/nutri-${seed}/1200/600`
          }}
        />
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
