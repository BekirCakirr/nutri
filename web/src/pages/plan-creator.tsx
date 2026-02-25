import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Save,
  Send,
  Sparkles,
  Plus,
  GripVertical,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
const mealSlots = ['Kahvaltı', 'Öğle', 'Akşam', 'Ara Öğün']

const mockPatients = [
  { id: '1', name: 'Ayşe Yılmaz' },
  { id: '2', name: 'Mehmet Kaya' },
  { id: '3', name: 'Fatma Demir' },
  { id: '5', name: 'Zeynep Çelik' },
]

interface PlanItem {
  id: string
  name: string
  portion: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

const sampleItems: Record<string, PlanItem[]> = {
  'Pazartesi-Kahvaltı': [
    { id: '1', name: 'Yulaf ezmesi', portion: '200g', calories: 280, protein: 10, carbs: 48, fat: 6 },
    { id: '2', name: 'Muz', portion: '1 adet', calories: 90, protein: 1, carbs: 23, fat: 0 },
  ],
  'Pazartesi-Öğle': [
    { id: '3', name: 'Tavuk göğsü', portion: '150g', calories: 240, protein: 36, carbs: 0, fat: 10 },
    { id: '4', name: 'Bulgur pilavı', portion: '200g', calories: 220, protein: 6, carbs: 46, fat: 2 },
  ],
  'Pazartesi-Akşam': [
    { id: '5', name: 'Izgara somon', portion: '200g', calories: 360, protein: 40, carbs: 0, fat: 20 },
    { id: '6', name: 'Sebze sote', portion: '250g', calories: 120, protein: 4, carbs: 18, fat: 4 },
  ],
  'Pazartesi-Ara Öğün': [
    { id: '7', name: 'Badem', portion: '30g', calories: 170, protein: 6, carbs: 6, fat: 14 },
  ],
}

export default function PlanCreatorPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [selectedPatient, setSelectedPatient] = useState(patientId || '')
  const [selectedDay, setSelectedDay] = useState('Pazartesi')
  const [planTitle, setPlanTitle] = useState('Kilo Verme Programı - Hafta 1')

  const getItemsForSlot = (day: string, meal: string) => {
    return sampleItems[`${day}-${meal}`] || []
  }

  const getDaySummary = (day: string) => {
    let calories = 0, protein = 0, carbs = 0, fat = 0
    mealSlots.forEach((meal) => {
      const items = getItemsForSlot(day, meal)
      items.forEach((item) => {
        calories += item.calories
        protein += item.protein
        carbs += item.carbs
        fat += item.fat
      })
    })
    return { calories, protein, carbs, fat }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Diyet Planı Oluştur</h1>
          <p className="text-muted-foreground">7 günlük beslenme planı hazırlayın.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Taslak Kaydet
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Yayınla
          </Button>
        </div>
      </div>

      {/* Plan Info */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Plan Adı</label>
              <Input value={planTitle} onChange={(e) => setPlanTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Hasta</label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Hasta seçin" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                AI ile Plan Öner
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Tabs */}
      <Tabs value={selectedDay} onValueChange={setSelectedDay}>
        <TabsList className="grid w-full grid-cols-7">
          {days.map((day) => (
            <TabsTrigger key={day} value={day} className="text-xs sm:text-sm">
              {day.slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>

        {days.map((day) => {
          const summary = getDaySummary(day)
          return (
            <TabsContent key={day} value={day} className="space-y-4">
              {/* Day Summary */}
              <div className="grid grid-cols-4 gap-3">
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Kalori</p>
                    <p className="text-lg font-bold">{summary.calories} kcal</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="text-lg font-bold">{summary.protein}g</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Karbonhidrat</p>
                    <p className="text-lg font-bold">{summary.carbs}g</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Yağ</p>
                    <p className="text-lg font-bold">{summary.fat}g</p>
                  </CardContent>
                </Card>
              </div>

              {/* Meal Slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mealSlots.map((meal) => {
                  const items = getItemsForSlot(day, meal)
                  const mealCalories = items.reduce((sum, i) => sum + i.calories, 0)
                  return (
                    <Card key={meal}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{meal}</CardTitle>
                          <Badge variant="outline">{mealCalories} kcal</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {items.length > 0 ? (
                          items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2 p-2 rounded border bg-muted/30">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.portion} &middot; {item.calories} kcal</p>
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="h-20 rounded border-2 border-dashed flex items-center justify-center text-muted-foreground">
                            <p className="text-xs">Yiyecek eklemek için sürükleyin veya tıklayın</p>
                          </div>
                        )}
                        <Button variant="ghost" size="sm" className="w-full mt-1">
                          <Plus className="mr-1 h-3 w-3" />
                          Yiyecek Ekle
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
