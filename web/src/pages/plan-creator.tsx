import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usePatients } from '@/hooks/use-patients'
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
  const [items, setItems] = useState<Record<string, PlanItem[]>>({})

  // Search Modal State
  const [addFoodModal, setAddFoodModal] = useState<{ day: string; meal: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [isSearching, setIsSearching] = useState(false)


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

  if (isPageLoading) return <PlanCreatorSkeleton />

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
          <Button variant="outline" size="sm">
            <Save className="h-3.5 w-3.5" />
            Taslak Kaydet
          </Button>
          <Button size="sm">
            <Send className="h-3.5 w-3.5" />
            Yayınla
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
                  {allPatients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{`${p.firstName} ${p.lastName}`}</SelectItem>
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
              <Select defaultValue="7">
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
              <Button className="flex-1 h-9 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md">
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
                variant="outline"
                size="sm"
                className="w-full text-xs gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800 dark:border-violet-800/40 dark:text-violet-400 dark:hover:bg-violet-950/30"
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
