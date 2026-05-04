import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { usePatients } from '@/hooks/use-patients'
import { createPlan } from '@/services/plan.service'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import {
  Save,
  Send,
  Sparkles,
  Plus,
  GripVertical,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Copy,
  RotateCcw,
  Calendar,
  User,
  FileText,
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { PageContainer } from '@/components/shared/page-container'
import { PlanCreatorSkeleton } from '@/components/shared/page-skeletons'
import { cn } from '@/lib/utils'

type ExtendedFoodItem = FoodItem & {
  caloriesPer100g?: number;
  calories_per_100g?: number;
  proteinPer100g?: number;
  protein_per_100g?: number;
  carbsPer100g?: number;
  carbs_per_100g?: number;
  fatPer100g?: number;
  fat_per_100g?: number;
  nutrition?: {
    calories?: number;
    proteinG?: number;
    carbsG?: number;
    fatG?: number;
  };
};
import { searchFoods, type FoodItem } from '@/services/food.service'

/* ------------------------------------------------------------------ */
/*  Constants & mock data                                              */
/* ------------------------------------------------------------------ */

const days = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
] as const

const dayShort: Record<string, string> = {
  'Pazartesi': 'Pzt',
  'Salı': 'Sal',
  'Çarşamba': 'Çar',
  'Perşembe': 'Per',
  'Cuma': 'Cum',
  'Cumartesi': 'Cmt',
  'Pazar': 'Paz',
}

const mealSlots = ['Kahvaltı', 'Öğle', 'Akşam', 'Ara Öğün'] as const

const mealIcons: Record<string, string> = {
  'Kahvaltı': '☕',
  'Öğle': '🍲',
  'Akşam': '🍱',
  'Ara Öğün': '🍎',
}

const mealColors: Record<string, string> = {
  'Kahvaltı': 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/40',
  'Öğle': 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40',
  'Akşam': 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/40',
  'Ara Öğün': 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800/40',
}

const mealHeaderColors: Record<string, string> = {
  'Kahvaltı': 'text-amber-700 dark:text-amber-400',
  'Öğle': 'text-emerald-700 dark:text-emerald-400',
  'Akşam': 'text-blue-700 dark:text-blue-400',
  'Ara Öğün': 'text-rose-700 dark:text-rose-400',
}

// Patient list is fetched via usePatients hook below

interface PlanItem {
  id: string
  name: string
  portion: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

/* ------------------------------------------------------------------ */
/*  Target macros (example daily targets for the calorie counter)     */
/* ------------------------------------------------------------------ */

const dailyTargets = {
  calories: 2000,
  protein: 120,
  carbs: 250,
  fat: 65,
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PlanCreatorPage() {
  const { patientId } = useParams()
  const { allPatients, isLoading: isPageLoading } = usePatients()
  const [selectedPatient, setSelectedPatient] = useState(patientId || '')
  const [selectedDay, setSelectedDay] = useState<string>('Pazartesi')
  const [planTitle, setPlanTitle] = useState('Kilo Verme Programı - Hafta 1')
  const [items, setItems] = useState<Record<string, PlanItem[]>>({
    // --- Pazartesi ---
    'Pazartesi-Kahvaltı': [
      { id: 'pzt-k1', name: 'Menemen (domates, biber, yumurta)', portion: '200g', calories: 280, protein: 16, carbs: 10, fat: 18 },
      { id: 'pzt-k2', name: 'Tam buğday ekmeği', portion: '60g', calories: 140, protein: 5, carbs: 24, fat: 2 },
      { id: 'pzt-k3', name: 'Beyaz peynir', portion: '40g', calories: 100, protein: 7, carbs: 1, fat: 8 },
    ],
    'Pazartesi-Öğle': [
      { id: 'pzt-o1', name: 'Izgara tavuk göğsü', portion: '150g', calories: 230, protein: 35, carbs: 0, fat: 8 },
      { id: 'pzt-o2', name: 'Bulgur pilavı', portion: '150g', calories: 195, protein: 6, carbs: 38, fat: 3 },
      { id: 'pzt-o3', name: 'Mevsim salatası', portion: '150g', calories: 60, protein: 2, carbs: 8, fat: 2 },
    ],
    'Pazartesi-Akşam': [
      { id: 'pzt-a1', name: 'Mercimek çorbası', portion: '250g', calories: 180, protein: 12, carbs: 28, fat: 3 },
      { id: 'pzt-a2', name: 'Fırında somon', portion: '150g', calories: 310, protein: 34, carbs: 0, fat: 18 },
      { id: 'pzt-a3', name: 'Buharda brokoli', portion: '120g', calories: 40, protein: 3, carbs: 6, fat: 0 },
    ],
    'Pazartesi-Ara Öğün': [
      { id: 'pzt-ar1', name: 'Yoğurt', portion: '200g', calories: 120, protein: 8, carbs: 10, fat: 5 },
      { id: 'pzt-ar2', name: 'Ceviz (10 adet)', portion: '30g', calories: 200, protein: 5, carbs: 4, fat: 18 },
    ],
    // --- Salı ---
    'Salı-Kahvaltı': [
      { id: 'sal-k1', name: 'Yulaf ezmesi', portion: '60g', calories: 230, protein: 8, carbs: 40, fat: 5 },
      { id: 'sal-k2', name: 'Muz', portion: '120g', calories: 105, protein: 1, carbs: 27, fat: 0 },
      { id: 'sal-k3', name: 'Badem (15 adet)', portion: '20g', calories: 115, protein: 4, carbs: 4, fat: 10 },
    ],
    'Salı-Öğle': [
      { id: 'sal-o1', name: 'Nohutlu tavuk sote', portion: '250g', calories: 340, protein: 30, carbs: 25, fat: 12 },
      { id: 'sal-o2', name: 'Pirinç pilavı', portion: '130g', calories: 170, protein: 3, carbs: 37, fat: 1 },
    ],
    'Salı-Akşam': [
      { id: 'sal-a1', name: 'Karnıyarık', portion: '300g', calories: 380, protein: 22, carbs: 28, fat: 20 },
      { id: 'sal-a2', name: 'Cacık', portion: '150g', calories: 70, protein: 4, carbs: 6, fat: 3 },
    ],
    'Salı-Ara Öğün': [
      { id: 'sal-ar1', name: 'Elma', portion: '150g', calories: 78, protein: 0, carbs: 21, fat: 0 },
      { id: 'sal-ar2', name: 'Fıstık ezmesi', portion: '15g', calories: 90, protein: 4, carbs: 3, fat: 8 },
    ],
    // --- Çarşamba ---
    'Çarşamba-Kahvaltı': [
      { id: 'car-k1', name: 'Peynirli omlet (2 yumurta)', portion: '180g', calories: 280, protein: 18, carbs: 2, fat: 22 },
      { id: 'car-k2', name: 'Domates, salatalık, zeytin', portion: '120g', calories: 65, protein: 2, carbs: 6, fat: 4 },
      { id: 'car-k3', name: 'Çavdar ekmeği', portion: '50g', calories: 120, protein: 4, carbs: 22, fat: 1 },
    ],
    'Çarşamba-Öğle': [
      { id: 'car-o1', name: 'Izgara köfte', portion: '160g', calories: 320, protein: 28, carbs: 4, fat: 20 },
      { id: 'car-o2', name: 'Bulgur pilavı', portion: '130g', calories: 170, protein: 5, carbs: 33, fat: 2 },
      { id: 'car-o3', name: 'Ayran', portion: '200ml', calories: 60, protein: 4, carbs: 6, fat: 2 },
    ],
    'Çarşamba-Akşam': [
      { id: 'car-a1', name: 'Sebzeli makarna', portion: '250g', calories: 340, protein: 12, carbs: 52, fat: 8 },
      { id: 'car-a2', name: 'Ton balıklı salata', portion: '180g', calories: 200, protein: 22, carbs: 6, fat: 10 },
    ],
    'Çarşamba-Ara Öğün': [
      { id: 'car-ar1', name: 'Havuç çubukları', portion: '100g', calories: 35, protein: 1, carbs: 8, fat: 0 },
      { id: 'car-ar2', name: 'Hummus', portion: '50g', calories: 130, protein: 6, carbs: 10, fat: 8 },
    ],
    // --- Perşembe ---
    'Perşembe-Kahvaltı': [
      { id: 'per-k1', name: 'Avokadolu tost', portion: '150g', calories: 290, protein: 8, carbs: 24, fat: 18 },
      { id: 'per-k2', name: 'Haşlanmış yumurta', portion: '50g', calories: 78, protein: 6, carbs: 1, fat: 5 },
      { id: 'per-k3', name: 'Yeşil çay', portion: '200ml', calories: 2, protein: 0, carbs: 0, fat: 0 },
    ],
    'Perşembe-Öğle': [
      { id: 'per-o1', name: 'Etli yaprak sarması', portion: '250g', calories: 340, protein: 20, carbs: 22, fat: 18 },
      { id: 'per-o2', name: 'Yoğurt', portion: '150g', calories: 90, protein: 6, carbs: 8, fat: 3 },
    ],
    'Perşembe-Akşam': [
      { id: 'per-a1', name: 'Fırında levrek', portion: '180g', calories: 260, protein: 36, carbs: 0, fat: 12 },
      { id: 'per-a2', name: 'Ispanaklı börek', portion: '120g', calories: 280, protein: 10, carbs: 28, fat: 14 },
    ],
    'Perşembe-Ara Öğün': [
      { id: 'per-ar1', name: 'Kivi (2 adet)', portion: '150g', calories: 90, protein: 2, carbs: 22, fat: 0 },
    ],
    // --- Cuma ---
    'Cuma-Kahvaltı': [
      { id: 'cum-k1', name: 'Lor peynirli krep', portion: '200g', calories: 260, protein: 16, carbs: 30, fat: 8 },
      { id: 'cum-k2', name: 'Bal', portion: '15g', calories: 45, protein: 0, carbs: 12, fat: 0 },
      { id: 'cum-k3', name: 'Taze meyve tabağı', portion: '150g', calories: 75, protein: 1, carbs: 18, fat: 0 },
    ],
    'Cuma-Öğle': [
      { id: 'cum-o1', name: 'Tavuk wrap', portion: '250g', calories: 380, protein: 28, carbs: 32, fat: 14 },
      { id: 'cum-o2', name: 'Mevsim salatası', portion: '120g', calories: 50, protein: 2, carbs: 6, fat: 2 },
    ],
    'Cuma-Akşam': [
      { id: 'cum-a1', name: 'Etli kuru fasulye', portion: '300g', calories: 420, protein: 26, carbs: 42, fat: 14 },
      { id: 'cum-a2', name: 'Pirinç pilavı', portion: '100g', calories: 130, protein: 3, carbs: 28, fat: 1 },
      { id: 'cum-a3', name: 'Turşu', portion: '50g', calories: 10, protein: 0, carbs: 2, fat: 0 },
    ],
    'Cuma-Ara Öğün': [
      { id: 'cum-ar1', name: 'Karışık kuruyemiş', portion: '30g', calories: 175, protein: 5, carbs: 6, fat: 15 },
      { id: 'cum-ar2', name: 'Kuru kayısı (5 adet)', portion: '40g', calories: 95, protein: 1, carbs: 22, fat: 0 },
    ],
    // --- Cumartesi ---
    'Cumartesi-Kahvaltı': [
      { id: 'cmt-k1', name: 'Serpme kahvaltı tabağı', portion: '100g', calories: 180, protein: 10, carbs: 8, fat: 12 },
      { id: 'cmt-k2', name: 'Kaşar peyniri', portion: '40g', calories: 150, protein: 10, carbs: 1, fat: 12 },
      { id: 'cmt-k3', name: 'Siyah zeytin (8 adet)', portion: '30g', calories: 85, protein: 1, carbs: 1, fat: 8 },
      { id: 'cmt-k4', name: 'Tam buğday ekmeği', portion: '60g', calories: 140, protein: 5, carbs: 24, fat: 2 },
    ],
    'Cumartesi-Öğle': [
      { id: 'cmt-o1', name: 'Lahmacun (2 adet)', portion: '200g', calories: 420, protein: 18, carbs: 48, fat: 16 },
      { id: 'cmt-o2', name: 'Yeşillik ve limon', portion: '80g', calories: 15, protein: 1, carbs: 3, fat: 0 },
      { id: 'cmt-o3', name: 'Ayran', portion: '200ml', calories: 60, protein: 4, carbs: 6, fat: 2 },
    ],
    'Cumartesi-Akşam': [
      { id: 'cmt-a1', name: 'Sebzeli güveç', portion: '300g', calories: 250, protein: 8, carbs: 30, fat: 10 },
      { id: 'cmt-a2', name: 'Yoğurtlu semizotu', portion: '150g', calories: 90, protein: 4, carbs: 8, fat: 4 },
    ],
    'Cumartesi-Ara Öğün': [
      { id: 'cmt-ar1', name: 'Meyveli yoğurt', portion: '200g', calories: 150, protein: 6, carbs: 22, fat: 4 },
    ],
    // --- Pazar ---
    'Pazar-Kahvaltı': [
      { id: 'paz-k1', name: 'Simit', portion: '120g', calories: 340, protein: 10, carbs: 56, fat: 8 },
      { id: 'paz-k2', name: 'Süzme peynir', portion: '50g', calories: 45, protein: 8, carbs: 2, fat: 0 },
      { id: 'paz-k3', name: 'Çay (şekersiz)', portion: '200ml', calories: 2, protein: 0, carbs: 0, fat: 0 },
    ],
    'Pazar-Öğle': [
      { id: 'paz-o1', name: 'Kuzu tandır', portion: '180g', calories: 380, protein: 32, carbs: 0, fat: 26 },
      { id: 'paz-o2', name: 'Bulgur pilavı', portion: '150g', calories: 195, protein: 6, carbs: 38, fat: 3 },
      { id: 'paz-o3', name: 'Çoban salatası', portion: '150g', calories: 70, protein: 2, carbs: 8, fat: 3 },
    ],
    'Pazar-Akşam': [
      { id: 'paz-a1', name: 'Mercimek köftesi', portion: '150g', calories: 200, protein: 12, carbs: 28, fat: 4 },
      { id: 'paz-a2', name: 'Marul salatası', portion: '120g', calories: 20, protein: 2, carbs: 3, fat: 0 },
    ],
    'Pazar-Ara Öğün': [
      { id: 'paz-ar1', name: 'Portakal (2 adet)', portion: '300g', calories: 120, protein: 2, carbs: 30, fat: 0 },
    ],
  })

  // Search Modal State
  const [addFoodModal, setAddFoodModal] = useState<{ day: string; meal: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [planDuration, setPlanDuration] = useState<'7' | '14' | '28'>('7')

  // Day name → dayOfWeek (Pazartesi=1 ... Pazar=7) mapping
  const dayOfWeekMap: Record<string, number> = {
    'Pazartesi': 1, 'Salı': 2, 'Çarşamba': 3, 'Perşembe': 4,
    'Cuma': 5, 'Cumartesi': 6, 'Pazar': 7,
  }
  const mealTypeMap: Record<string, string> = {
    'Kahvaltı': 'breakfast', 'Öğle': 'lunch', 'Akşam': 'dinner', 'Ara Öğün': 'snack',
  }

  function buildPlanPayload(status: 'draft' | 'active') {
    const planItems: Array<Record<string, unknown>> = []
    days.forEach((day) => {
      mealSlots.forEach((meal) => {
        const slot = items[`${day}-${meal}`] || []
        slot.forEach((item, idx) => {
          // Parse portion like "200g" → 200
          const amountMatch = String(item.portion).match(/(\d+(?:\.\d+)?)/)
          const amountG = amountMatch ? Number(amountMatch[1]) : 100
          planItems.push({
            dayOfWeek: dayOfWeekMap[day] ?? 1,
            mealType: mealTypeMap[meal] ?? 'breakfast',
            foodName: item.name,
            amountG,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            sortOrder: idx,
          })
        })
      })
    })

    const today = new Date()
    const start = today.toISOString().slice(0, 10)
    const end = new Date(today.getTime() + Number(planDuration) * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)

    return {
      patientId: selectedPatient,
      title: planTitle.trim() || 'Yeni Plan',
      startDate: start,
      endDate: end,
      dailyCalorieTarget: dailyTargets.calories,
      dailyProteinTarget: dailyTargets.protein,
      dailyCarbTarget: dailyTargets.carbs,
      dailyFatTarget: dailyTargets.fat,
      items: planItems,
      status,
    }
  }

  async function handleSavePlan(status: 'draft' | 'active') {
    if (!selectedPatient) {
      toast.error('Lütfen önce bir hasta seçin.')
      return
    }
    if (!planTitle.trim()) {
      toast.error('Plan başlığı boş olamaz.')
      return
    }
    const payload = buildPlanPayload(status)
    if ((payload.items as unknown[]).length === 0) {
      toast.error('En az bir öğün eklemelisiniz.')
      return
    }
    setIsSaving(true)
    try {
      await createPlan(payload as never)
      toast.success(status === 'active' ? 'Plan yayınlandı ve hastaya atandı.' : 'Taslak kaydedildi.')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Plan kaydedilemedi.'
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }


  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await searchFoods(searchQuery)
        setSearchResults(results)
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearching(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  /* ---------- helpers ---------- */

  const getItemsForSlot = (day: string, meal: string): PlanItem[] => {
    return items[`${day}-${meal}`] || []
  }

  const getDaySummary = (day: string) => {
    let calories = 0, protein = 0, carbs = 0, fat = 0
    mealSlots.forEach((meal) => {
      const slotItems = getItemsForSlot(day, meal)
      slotItems.forEach((item) => {
        calories += item.calories
        protein += item.protein
        carbs += item.carbs
        fat += item.fat
      })
    })
    return { calories, protein, carbs, fat }
  }

  const weekSummary = useMemo(() => {
    let calories = 0, protein = 0, carbs = 0, fat = 0, filledDays = 0
    days.forEach((day) => {
      const s = getDaySummary(day)
      calories += s.calories
      protein += s.protein
      carbs += s.carbs
      fat += s.fat
      if (s.calories > 0) filledDays++
    })
    return { calories, protein, carbs, fat, filledDays }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  // Early return AFTER all hooks — keeps hook call order stable across renders
  if (isPageLoading) return <PlanCreatorSkeleton />

  /* ---------- drag & drop ---------- */

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    setItems((prev) => {
      const next = { ...prev }
      const sourceItems = [...(next[source.droppableId] || [])]
      const [moved] = sourceItems.splice(source.index, 1)

      if (source.droppableId === destination.droppableId) {
        sourceItems.splice(destination.index, 0, moved)
        next[source.droppableId] = sourceItems
      } else {
        const destItems = [...(next[destination.droppableId] || [])]
        destItems.splice(destination.index, 0, moved)
        next[source.droppableId] = sourceItems
        next[destination.droppableId] = destItems
      }

      return next
    })
  }

  const currentSummary = getDaySummary(selectedDay)

  const dayIndex = days.indexOf(selectedDay as typeof days[number])
  const canGoPrev = dayIndex > 0
  const canGoNext = dayIndex < days.length - 1

  const navigateDay = (dir: -1 | 1) => {
    const next = dayIndex + dir
    if (next >= 0 && next < days.length) setSelectedDay(days[next])
  }

  /* ---------- macros helper ---------- */

  const macroPercent = (value: number, target: number) =>
    Math.min(Math.round((value / target) * 100), 100)

  /* ---------- add food ---------- */

  const handleAddFood = (food: FoodItem) => {
    if (!addFoodModal) return
    const { day, meal } = addFoodModal
    const slotKey = `${day}-${meal}`
    
    const f = food as unknown as ExtendedFoodItem;
    // Default to 100g portion
    const newItem: PlanItem = {
      id: `${food.id}-${Date.now()}`,
      name: food.name,
      portion: '100g',
      calories: f.caloriesPer100g || f.calories_per_100g || f.nutrition?.calories || 0,
      protein: f.proteinPer100g || f.protein_per_100g || f.nutrition?.proteinG || 0,
      carbs: f.carbsPer100g || f.carbs_per_100g || f.nutrition?.carbsG || 0,
      fat: f.fatPer100g || f.fat_per_100g || f.nutrition?.fatG || 0,
    }

    setItems((prev) => ({
      ...prev,
      [slotKey]: [...(prev[slotKey] || []), newItem],
    }))

    setAddFoodModal(null)
    setSearchQuery('')
  }

  const handleRemoveFood = (day: string, meal: string, itemId: string) => {
    const slotKey = `${day}-${meal}`
    setItems((prev) => ({
      ...prev,
      [slotKey]: (prev[slotKey] || []).filter((i) => i.id !== itemId),
    }))
  }

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <PageContainer
      title="Plan Oluşturucu"
      description="7 günlük beslenme planı hazırlayıp hastanıza atama yapın."
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSavePlan('draft')}
            disabled={isSaving}
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Kaydediliyor...' : 'Taslak Kaydet'}
          </Button>
          <Button
            size="sm"
            onClick={() => handleSavePlan('active')}
            disabled={isSaving}
          >
            <Send className="h-3.5 w-3.5" />
            {isSaving ? 'Yayınlanıyor...' : 'Yayınla'}
          </Button>
        </>
      }
    >
      {/* ====== Plan meta bar ====== */}
      <Card className="animate-fade-up py-4 gap-0">
        <CardContent className="px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Plan name */}
            <div className="md:col-span-4">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                <FileText className="h-3 w-3" />
                Plan Adı
              </label>
              <Input
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="h-9"
                placeholder="Plan adı girin..."
              />
            </div>

            {/* Patient selector */}
            <div className="md:col-span-3">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                <User className="h-3 w-3" />
                Hasta
              </label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Hasta seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {(allPatients ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>{`${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || 'Hasta'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                <Calendar className="h-3 w-3" />
                Süre
              </label>
              <Select value={planDuration} onValueChange={(v) => setPlanDuration(v as '7' | '14' | '28')}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Gün</SelectItem>
                  <SelectItem value="14">14 Gün</SelectItem>
                  <SelectItem value="28">28 Gün</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* AI suggestion button */}
            <div className="md:col-span-3 flex gap-2">
              <Button
                disabled
                title="Yakında kullanılabilir olacak"
                className="flex-1 h-9 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md opacity-60 cursor-not-allowed"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI ile Plan Oluştur
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ====== Main layout: 7-day planner + macro sidebar ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 mt-5">

        {/* ---- Left: Day planner ---- */}
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
          {/* Day navigation tabs */}
          <Tabs value={selectedDay} onValueChange={setSelectedDay}>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-xs"
                disabled={!canGoPrev}
                onClick={() => navigateDay(-1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>

              <TabsList className="flex-1 flex overflow-x-auto flex-nowrap md:grid md:grid-cols-7">
                {days.map((day) => {
                  const s = getDaySummary(day)
                  const hasData = s.calories > 0
                  return (
                    <TooltipProvider key={day}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TabsTrigger
                            value={day}
                            className="relative text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">{day}</span>
                            <span className="sm:hidden">{dayShort[day]}</span>
                            {hasData && (
                              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            )}
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{day}</p>
                          {hasData ? (
                            <p className="text-[11px] opacity-80">
                              {s.calories} kcal &middot; P:{s.protein}g &middot; K:{s.carbs}g &middot; Y:{s.fat}g
                            </p>
                          ) : (
                            <p className="text-[11px] opacity-80">Henüz öğün eklenmedi</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </TabsList>

              <Button
                variant="ghost"
                size="icon-xs"
                disabled={!canGoNext}
                onClick={() => navigateDay(1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Day content panels */}
            {days.map((day) => (
              <TabsContent key={day} value={day} className="mt-4 space-y-3">
                {/* Day header row with quick actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">{day}</h2>
                    <Badge variant="secondary" className="text-[11px]">
                      {getDaySummary(day).calories} kcal
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Günü kopyala</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Günü sıfırla</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Meal slot cards - 2x2 grid */}
                <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in-stagger">
                  {mealSlots.map((meal) => {
                    const slotItems = getItemsForSlot(day, meal)
                    const mealCalories = slotItems.reduce((sum, i) => sum + i.calories, 0)
                    const mealProtein = slotItems.reduce((sum, i) => sum + i.protein, 0)
                    const mealCarbs = slotItems.reduce((sum, i) => sum + i.carbs, 0)
                    const mealFat = slotItems.reduce((sum, i) => sum + i.fat, 0)
                    const droppableId = `${day}-${meal}`

                    return (
                      <Card
                        key={meal}
                        className={cn(
                          'py-0 gap-0 overflow-hidden border transition-all hover:shadow-md',
                          mealColors[meal]
                        )}
                      >
                        {/* Meal header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-inherit">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{mealIcons[meal]}</span>
                            <span className={cn('text-sm font-semibold', mealHeaderColors[meal])}>
                              {meal}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {mealCalories > 0 && (
                              <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono tabular-nums">
                                {mealCalories} kcal
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Meal items */}
                        <div className="px-3 py-2 min-h-[100px]">
                          <Droppable droppableId={droppableId}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={cn(
                                  'min-h-[80px] rounded-lg transition-colors',
                                  snapshot.isDraggingOver && 'bg-primary/5 border-2 border-dashed border-primary/20'
                                )}
                              >
                          <ScrollArea className="max-h-[200px]">
                            {slotItems.length > 0 ? (
                              <div className="space-y-1.5">
                                {slotItems.map((item, index) => (
                                  <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(dragProvided, dragSnapshot) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    className={cn(
                                      'group flex items-center gap-2 rounded-lg bg-background/70 border border-transparent hover:border-border px-3 py-2 transition-all',
                                      dragSnapshot.isDragging && 'shadow-lg border-primary/30 bg-background ring-2 ring-primary/20'
                                    )}
                                  >
                                    <div {...dragProvided.dragHandleProps}>
                                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium leading-tight truncate">
                                        {item.name}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[11px] text-muted-foreground">
                                          {item.portion}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground/60">&middot;</span>
                                        <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                                          {item.calories} kcal
                                        </span>
                                      </div>
                                    </div>
                                    {/* Micro macro pills */}
                                    <div className="hidden sm:flex items-center gap-1">
                                      <span className="text-[9px] px-1 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 font-mono tabular-nums">
                                        P:{item.protein}
                                      </span>
                                      <span className="text-[9px] px-1 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 font-mono tabular-nums">
                                        K:{item.carbs}
                                      </span>
                                      <span className="text-[9px] px-1 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 font-mono tabular-nums">
                                        Y:{item.fat}
                                      </span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon-xs"
                                      onClick={() => handleRemoveFood(day, meal, item.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                    )}
                                  </Draggable>
                                ))}
                              </div>
                            ) : (
                              !snapshot.isDraggingOver && (
                              <div className="h-[80px] rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-1">
                                <Plus className="h-4 w-4 text-muted-foreground/40" />
                                <p className="text-[11px] text-muted-foreground/60">
                                  Yiyecek sürükleyin veya tıklayın
                                </p>
                              </div>
                              )
                            )}
                          </ScrollArea>
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>

                          {/* Meal macro footer */}
                          {slotItems.length > 0 && (
                            <>
                              <Separator className="my-2" />
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                                <span>Toplam: {mealCalories} kcal</span>
                                <span className="font-mono tabular-nums">
                                  P:{mealProtein}g &middot; K:{mealCarbs}g &middot; Y:{mealFat}g
                                </span>
                              </div>
                            </>
                          )}

                          {/* Add food button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAddFoodModal({ day, meal })}
                            className="w-full mt-2 h-7 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                            Yiyecek Ekle
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
                </DragDropContext>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* ---- Right: Real-time calorie/macro sidebar ---- */}
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: '160ms' }}>
          {/* Daily macro tracker */}
          <Card className="py-4 gap-3 sticky top-20">
            <CardHeader className="px-4 pb-0 pt-0">
              <CardTitle className="text-sm font-semibold">Günlük Özet</CardTitle>
              <p className="text-[11px] text-muted-foreground">{selectedDay}</p>
            </CardHeader>
            <CardContent className="px-4 space-y-4">
              {/* Calorie ring-like display */}
              <div className="relative rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/10 p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-2xl font-bold tabular-nums tracking-tight">
                    {currentSummary.calories}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  / {dailyTargets.calories} kcal hedef
                </p>
                <Progress
                  value={macroPercent(currentSummary.calories, dailyTargets.calories)}
                  className="mt-3 h-1.5"
                />
                <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                  %{macroPercent(currentSummary.calories, dailyTargets.calories)} tamamlandı
                </p>
              </div>

              {/* Macro breakdown bars */}
              <div className="space-y-3">
                {/* Protein */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Beef className="h-3 w-3 text-blue-500" />
                      <span className="text-xs font-medium">Protein</span>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-muted-foreground">
                      {currentSummary.protein}g / {dailyTargets.protein}g
                    </span>
                  </div>
                  <Progress
                    value={macroPercent(currentSummary.protein, dailyTargets.protein)}
                    className="h-1.5 [&>[data-slot=progress-indicator]]:bg-blue-500"
                  />
                </div>

                {/* Carbs */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Wheat className="h-3 w-3 text-amber-500" />
                      <span className="text-xs font-medium">Karbonhidrat</span>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-muted-foreground">
                      {currentSummary.carbs}g / {dailyTargets.carbs}g
                    </span>
                  </div>
                  <Progress
                    value={macroPercent(currentSummary.carbs, dailyTargets.carbs)}
                    className="h-1.5 [&>[data-slot=progress-indicator]]:bg-amber-500"
                  />
                </div>

                {/* Fat */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Droplets className="h-3 w-3 text-rose-500" />
                      <span className="text-xs font-medium">Yağ</span>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-muted-foreground">
                      {currentSummary.fat}g / {dailyTargets.fat}g
                    </span>
                  </div>
                  <Progress
                    value={macroPercent(currentSummary.fat, dailyTargets.fat)}
                    className="h-1.5 [&>[data-slot=progress-indicator]]:bg-rose-500"
                  />
                </div>
              </div>

              <Separator />

              {/* Weekly overview */}
              <div>
                <p className="text-xs font-semibold mb-2">Haftalık Genel Bakış</p>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day) => {
                    const s = getDaySummary(day)
                    const filled = s.calories > 0
                    const pct = macroPercent(s.calories, dailyTargets.calories)
                    const isActive = day === selectedDay
                    return (
                      <TooltipProvider key={day}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setSelectedDay(day)}
                              className={cn(
                                'flex flex-col items-center gap-0.5 rounded-md py-1.5 transition-all text-center cursor-pointer',
                                isActive
                                  ? 'bg-primary/10 ring-1 ring-primary/30'
                                  : 'hover:bg-secondary'
                              )}
                            >
                              <span className="text-[9px] font-medium text-muted-foreground">
                                {dayShort[day]}
                              </span>
                              <div
                                className={cn(
                                  'h-1.5 w-1.5 rounded-full',
                                  filled
                                    ? pct >= 80
                                      ? 'bg-emerald-500'
                                      : pct >= 40
                                        ? 'bg-amber-500'
                                        : 'bg-red-400'
                                    : 'bg-muted-foreground/20'
                                )}
                              />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{day}</p>
                            {filled ? (
                              <p className="text-[11px] opacity-80">{s.calories} / {dailyTargets.calories} kcal</p>
                            ) : (
                              <p className="text-[11px] opacity-80">Boş</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              </div>

              <Separator />

              {/* Weekly totals summary */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold">Haftalık Toplam</p>
                <div className="text-[11px] text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Doldurulan gün</span>
                    <span className="font-medium text-foreground">{weekSummary.filledDays} / 7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toplam kalori</span>
                    <span className="font-mono tabular-nums">{weekSummary.calories.toLocaleString('tr-TR')} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ort. günlük</span>
                    <span className="font-mono tabular-nums">
                      {weekSummary.filledDays > 0
                        ? Math.round(weekSummary.calories / weekSummary.filledDays).toLocaleString('tr-TR')
                        : 0} kcal
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* AI suggestion shortcut */}
              <Button
                disabled
                title="Yakında kullanılabilir olacak"
                variant="outline"
                size="sm"
                className="w-full text-xs gap-1.5 border-violet-200 text-violet-700 dark:border-violet-800/40 dark:text-violet-400 opacity-60 cursor-not-allowed"
              >
                <Sparkles className="h-3 w-3" />
                Bu gün için AI önerisi al
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Food Modal */}
      <Dialog 
        open={addFoodModal !== null} 
        onOpenChange={(open) => {
          if (!open) { setAddFoodModal(null); setSearchQuery(''); }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yiyecek Ekle</DialogTitle>
            <DialogDescription>
              {addFoodModal?.day} - {addFoodModal?.meal} için arama yapın.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input 
              placeholder="Yiyecek ara (örn: tavuk, elma)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            
            <ScrollArea className="h-[300px] mt-4 rounded-md border p-2">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Aranıyor...</div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((rawFood) => {
                    const food = rawFood as unknown as ExtendedFoodItem;
                    return (
                    <div 
                      key={food.id} 
                      className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-border"
                      onClick={() => handleAddFood(food)}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-medium truncate">{food.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          100g: {food.caloriesPer100g || food.calories_per_100g || food.nutrition?.calories || 0} kcal &middot; P: {food.proteinPer100g || food.protein_per_100g || food.nutrition?.proteinG || 0}g
                        </p>
                      </div>
                      <Button size="sm" variant="secondary" className="h-7 w-7 p-0 shrink-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    );
                  })}
                </div>
              ) : searchQuery ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Sonuç bulunamadı</div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">Aramak için yazmaya başlayın</div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
