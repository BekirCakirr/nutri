import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Flame, Users, Plus, ImageIcon, Printer } from 'lucide-react'
import { DetailPageSkeleton } from '@/components/shared/page-skeletons'
import { getRecipe } from '@/services/recipe.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const mockRecipe = {
  id: '1',
  title: 'Izgara Tavuk Salata',
  description: 'Protein açısından zengin, düşük kalorili sağlıklı bir ana yemek. Taze sebzeler ve ızgara tavuk göğsü ile hazırlanan bu salata, diyet yapanlar için ideal bir öğün seçeneğidir.',
  category: 'Ana Yemek',
  difficulty: 'Kolay',
  prepTime: 15,
  cookTime: 10,
  servings: 2,
  calories: 380,
  protein: 35,
  carbs: 12,
  fat: 18,
  fiber: 4,
  sodium: 520,
  ingredients: [
    { name: 'Tavuk göğsü', amount: '300g' },
    { name: 'Marul (karışık)', amount: '200g' },
    { name: 'Kiraz domates', amount: '150g' },
    { name: 'Salatalık', amount: '1 adet' },
    { name: 'Kırmızı soğan', amount: '1/2 adet' },
    { name: 'Zeytinyağı', amount: '2 yemek kaşığı' },
    { name: 'Limon suyu', amount: '1 yemek kaşığı' },
    { name: 'Tuz', amount: 'Bir tutam' },
    { name: 'Karabiber', amount: 'Bir tutam' },
    { name: 'Kekik', amount: '1 çay kaşığı' },
  ],
  steps: [
    'Tavuk göğsünü tuz, karabiber ve kekik ile marine edin.',
    'Izgarayı orta-yüksek ısıda ısıtın.',
    'Tavuğu her iki tarafını da 5-6 dakika pişirin.',
    'Pişen tavuğu 5 dakika dinlendirin, ardından dilimleyin.',
    'Marulu yıkayıp kurulayın ve servis tabağına yerleştirin.',
    'Domatesleri ikiye kesin, salatalığı dilimleyin, soğanı halka halka doğrayın.',
    'Sebzeleri marulun üzerine yerleştirin.',
    'Zeytinyağı ve limon suyunu karıştırarak sos hazırlayın.',
    'Dilimlenmiş tavuğu salatanın üzerine ekleyin.',
    'Sosu üzerine gezdirip servis edin.',
  ],
}

export default function RecipeDetailPage() {
  const { id } = useParams()
  const [apiRecipe, setApiRecipe] = useState<any>(null)

  useEffect(() => {
    if (id) {
      getRecipe(id).then((data) => {
        if (data) {
          setApiRecipe({
            ...mockRecipe,
            id: data.id ?? mockRecipe.id,
            title: (data as any).name ?? mockRecipe.title,
            description: (data as any).description ?? mockRecipe.description,
            category: (data as any).category ?? mockRecipe.category,
            calories: (data as any).caloriesPerServing ?? (data as any).calories ?? mockRecipe.calories,
            protein: (data as any).proteinPerServing ?? (data as any).protein ?? mockRecipe.protein,
            carbs: (data as any).carbsPerServing ?? (data as any).carbs ?? mockRecipe.carbs,
            fat: (data as any).fatPerServing ?? (data as any).fat ?? mockRecipe.fat,
            prepTime: (data as any).prepTimeMin ?? mockRecipe.prepTime,
            cookTime: (data as any).cookTimeMin ?? mockRecipe.cookTime,
            servings: (data as any).servings ?? mockRecipe.servings,
            difficulty: (data as any).difficulty ?? mockRecipe.difficulty,
          })
        }
      }).catch(() => {})
    }
  }, [id])

  // Use API data if available, fallback to mock
  const recipe = apiRecipe ?? mockRecipe
  void id
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 400); return () => clearTimeout(t) }, [])

  if (isLoading) return <DetailPageSkeleton />

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
          <Button variant="outline" size="icon-sm"><Printer className="h-4 w-4" /></Button>
          <Button size="sm"><Plus className="h-3.5 w-3.5" />Plana Ekle</Button>
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
                {recipe.ingredients.map((ing: any, i: number) => (
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
                {recipe.steps.map((step: any, i: number) => (
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
