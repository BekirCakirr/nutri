import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Flame,
  Users,
  Plus,
  ImageIcon,
  Printer,
} from 'lucide-react'
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
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/recipes')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{mockRecipe.category}</Badge>
            <Badge variant="secondary">{mockRecipe.difficulty}</Badge>
          </div>
          <h1 className="text-3xl font-bold">{mockRecipe.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Plana Ekle
          </Button>
        </div>
      </div>

      {/* Image */}
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">Tarif Görseli</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground">{mockRecipe.description}</p>

      {/* Quick Info */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Hazırlık: {mockRecipe.prepTime} dk</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Pişirme: {mockRecipe.cookTime} dk</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{mockRecipe.servings} kişilik</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{mockRecipe.calories} kcal / porsiyon</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ingredients + Nutrition */}
        <div className="space-y-6">
          {/* Nutrition Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Besin Değerleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kalori</span>
                <span className="font-medium">{mockRecipe.calories} kcal</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-medium">{mockRecipe.protein}g</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Karbonhidrat</span>
                <span className="font-medium">{mockRecipe.carbs}g</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yağ</span>
                <span className="font-medium">{mockRecipe.fat}g</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lif</span>
                <span className="font-medium">{mockRecipe.fiber}g</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sodyum</span>
                <span className="font-medium">{mockRecipe.sodium}mg</span>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Malzemeler</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span>{ing.name}</span>
                    <span className="text-muted-foreground">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right: Steps */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hazırlanışı</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {mockRecipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{i + 1}</span>
                    </div>
                    <p className="text-sm pt-1">{step}</p>
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
