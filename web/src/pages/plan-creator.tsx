import { useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
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
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
import { PageContainer } from '@/components/shared/page-container'
import { cn } from '@/lib/utils'

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
  'Salı-Kahvaltı': [
    { id: '8', name: 'Omlet (2 yumurta)', portion: '150g', calories: 220, protein: 14, carbs: 2, fat: 16 },
    { id: '9', name: 'Tam buğday ekmek', portion: '2 dilim', calories: 140, protein: 6, carbs: 26, fat: 2 },
  ],
  'Salı-Öğle': [
    { id: '10', name: 'Mercimek çorbası', portion: '300ml', calories: 180, protein: 12, carbs: 28, fat: 3 },
    { id: '11', name: 'Salata', portion: '200g', calories: 80, protein: 2, carbs: 12, fat: 3 },
  ],
  'Çarşamba-Kahvaltı': [
    { id: '12', name: 'Yoğurt', portion: '200g', calories: 120, protein: 10, carbs: 8, fat: 5 },
    { id: '13', name: 'Granola', portion: '50g', calories: 210, protein: 5, carbs: 35, fat: 7 },
  ],
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
/*  SortableItem component                                             */
/* ------------------------------------------------------------------ */

interface SortableItemProps {
  item: PlanItem
  onRemove: (id: string) => void
}

function SortableItem({ item, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 rounded-lg bg-background/70 border border-transparent hover:border-border px-3 py-2 transition-all',
        isDragging && 'opacity-40 shadow-lg ring-2 ring-primary/30'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        aria-label="Sürükle"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
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
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  DragOverlay preview card                                           */
/* ------------------------------------------------------------------ */

function DragPreviewItem({ item }: { item: PlanItem }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-background border border-border shadow-xl px-3 py-2 w-[280px] cursor-grabbing">
      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/60" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
        <p className="text-[11px] text-muted-foreground">{item.portion} &middot; {item.calories} kcal</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PlanCreatorPage() {
  const { patientId } = useParams()
  const [selectedPatient, setSelectedPatient] = useState(patientId || '')
  const [selectedDay, setSelectedDay] = useState<string>('Pazartesi')
  const [planTitle, setPlanTitle] = useState('Kilo Verme Programı - Hafta 1')
  const [planItems, setPlanItems] = useState<Record<string, PlanItem[]>>(sampleItems)
  const [activeItem, setActiveItem] = useState<PlanItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  /* ---------- helpers ---------- */

  const getSlotKey = (day: string, meal: string) => `${day}-${meal}`

  const getItemsForSlot = useCallback((day: string, meal: string): PlanItem[] => {
    return planItems[getSlotKey(day, meal)] || []
  }, [planItems])

  /** Find which slot key contains a given item id */
  const findSlotByItemId = useCallback((itemId: string): string | null => {
    for (const [key, items] of Object.entries(planItems)) {
      if (items.some((i) => i.id === itemId)) return key
    }
    return null
  }, [planItems])

  const removeItem = useCallback((itemId: string) => {
    const slotKey = findSlotByItemId(itemId)
    if (!slotKey) return
    setPlanItems((prev) => ({
      ...prev,
      [slotKey]: prev[slotKey].filter((i) => i.id !== itemId),
    }))
  }, [findSlotByItemId])

  const getDaySummary = useCallback((day: string) => {
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
  }, [getItemsForSlot])

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
  }, [getDaySummary])

  const currentSummary = getDaySummary(selectedDay)

  const dayIndex = days.indexOf(selectedDay as typeof days[number])
  const canGoPrev = dayIndex > 0
  const canGoNext = dayIndex < days.length - 1

  const navigateDay = (dir: -1 | 1) => {
    const next = dayIndex + dir
    if (next >= 0 && next < days.length) setSelectedDay(days[next])
  }

  /* ---------- drag-and-drop handlers ---------- */

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const slotKey = findSlotByItemId(String(active.id))
    if (!slotKey) return
    const item = planItems[slotKey]?.find((i) => i.id === active.id)
    if (item) setActiveItem(item)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)
    if (activeId === overId) return

    const activeSlot = findSlotByItemId(activeId)
    // overId might be a slot key itself OR an item id in another slot
    const overSlot = planItems[overId] !== undefined
      ? overId
      : findSlotByItemId(overId)

    if (!activeSlot || !overSlot || activeSlot === overSlot) return

    // Move item from activeSlot to overSlot
    setPlanItems((prev) => {
      const activeItems = [...(prev[activeSlot] || [])]
      const overItems = [...(prev[overSlot] || [])]
      const activeIndex = activeItems.findIndex((i) => i.id === activeId)
      if (activeIndex === -1) return prev
      const [movedItem] = activeItems.splice(activeIndex, 1)

      const overIndex = overItems.findIndex((i) => i.id === overId)
      if (overIndex !== -1) {
        overItems.splice(overIndex, 0, movedItem)
      } else {
        overItems.push(movedItem)
      }

      return {
        ...prev,
        [activeSlot]: activeItems,
        [overSlot]: overItems,
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)
    if (activeId === overId) return

    const activeSlot = findSlotByItemId(activeId)
    const overSlot = findSlotByItemId(overId)

    if (!activeSlot || !overSlot || activeSlot !== overSlot) return

    // Reorder within same slot
    setPlanItems((prev) => {
      const items = [...(prev[activeSlot] || [])]
      const oldIndex = items.findIndex((i) => i.id === activeId)
      const newIndex = items.findIndex((i) => i.id === overId)
      if (oldIndex === -1 || newIndex === -1) return prev
      return {
        ...prev,
        [activeSlot]: arrayMove(items, oldIndex, newIndex),
      }
    })
  }

  /* ---------- macro helper ---------- */

  const macroPercent = (value: number, target: number) =>
    Math.min(Math.round((value / target) * 100), 100)

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
                  {mockPatients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
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

              <TabsList className="flex-1 grid grid-cols-7">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in-stagger">
                  {mealSlots.map((meal) => {
                    const slotKey = getSlotKey(day, meal)
                    const items = getItemsForSlot(day, meal)
                    const mealCalories = items.reduce((sum, i) => sum + i.calories, 0)
                    const mealProtein = items.reduce((sum, i) => sum + i.protein, 0)
                    const mealCarbs = items.reduce((sum, i) => sum + i.carbs, 0)
                    const mealFat = items.reduce((sum, i) => sum + i.fat, 0)

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

                        {/* Meal items — sortable drop zone */}
                        <div className="px-3 py-2 min-h-[100px]">
                          <SortableContext
                            id={slotKey}
                            items={items.map((i) => i.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <ScrollArea className="max-h-[200px]">
                              {items.length > 0 ? (
                                <div className="space-y-1.5">
                                  {items.map((item) => (
                                    <SortableItem
                                      key={item.id}
                                      item={item}
                                      onRemove={removeItem}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <div className="h-[80px] rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-1">
                                  <Plus className="h-4 w-4 text-muted-foreground/40" />
                                  <p className="text-[11px] text-muted-foreground/60">
                                    Yiyecek eklemek veya buraya sürükleyin
                                  </p>
                                </div>
                              )}
                            </ScrollArea>
                          </SortableContext>

                          {/* Meal macro footer */}
                          {items.length > 0 && (
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
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Drag overlay — floating preview while dragging */}
        <DragOverlay>
          {activeItem ? <DragPreviewItem item={activeItem} /> : null}
        </DragOverlay>
        </DndContext>

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
    </PageContainer>
  )
}
