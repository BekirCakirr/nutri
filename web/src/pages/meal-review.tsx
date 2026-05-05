import { useState, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import { approveMeal, rejectMeal, getMeals } from '@/services/meal.service'
import {
  Search,
  Check,
  X,
  ImageIcon,
  Bot,
  UtensilsCrossed,
  ChevronDown,
  ChevronUp,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Clock,
  AlertTriangle,
  Sparkles,
  Filter,
  GripVertical,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { avatarFor, mealPhotoFor } from '@/lib/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { DetailPageSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { PageContainer } from '@/components/shared/page-container'
import { cn } from '@/lib/utils'

/* ─── Types ────────────────────────────────────── */

interface MealReview {
  id: string
  patientName: string
  patientId: string
  date: string
  mealType: 'Kahvaltı' | 'Öğle' | 'Akşam' | 'Ara Öğün'
  items: string[]
  totalCalories: number
  protein: number
  carbs: number
  fat: number
  imageUrl: string | null
  status: 'pending' | 'approved' | 'rejected'
  aiScore: number
  aiSummary: string
}

type ColumnStatus = 'pending' | 'approved' | 'rejected'


/* ─── Kanban column config ─────────────────────── */

const columnConfig: Record<ColumnStatus, { label: string; badgeVariant: 'warning' | 'success' | 'destructive'; emptyIcon: typeof Clock; emptyText: string }> = {
  pending: {
    label: 'Bekleyen',
    badgeVariant: 'warning',
    emptyIcon: Clock,
    emptyText: 'Bekleyen öğün yok',
  },
  approved: {
    label: 'Onaylanan',
    badgeVariant: 'success',
    emptyIcon: Check,
    emptyText: 'Henüz onaylanan öğün yok',
  },
  rejected: {
    label: 'Reddedilen',
    badgeVariant: 'destructive',
    emptyIcon: X,
    emptyText: 'Henüz reddedilen öğün yok',
  },
}

/* ─── Meal type badge colors ───────────────────── */

const mealTypeColor: Record<string, string> = {
  'Kahvaltı': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  'Öğle': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  'Akşam': 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800',
  'Ara Öğün': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
}

/* ─── Helpers ──────────────────────────────────── */

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('')
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function getAiScoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function getAiScoreProgressColor(score: number): string {
  if (score >= 85) return '[&_[data-slot=progress-indicator]]:bg-emerald-500'
  if (score >= 60) return '[&_[data-slot=progress-indicator]]:bg-amber-500'
  return '[&_[data-slot=progress-indicator]]:bg-red-500'
}

function getMacroPercent(protein: number, carbs: number, fat: number): { p: number; c: number; f: number } {
  const totalCal = protein * 4 + carbs * 4 + fat * 9
  if (totalCal === 0) return { p: 0, c: 0, f: 0 }
  return {
    p: Math.round((protein * 4 / totalCal) * 100),
    c: Math.round((carbs * 4 / totalCal) * 100),
    f: Math.round((fat * 9 / totalCal) * 100),
  }
}

const mockMealReviews: MealReview[] = [
  {
    id: 'mock-mr1', patientName: 'Ayşe Yılmaz', patientId: 'p1', date: '2026-04-16',
    mealType: 'Kahvaltı', items: ['Yulaf ezmesi (1 porsiyon)', 'Muz (1 adet)', 'Badem (10 adet)', 'Yeşil çay'],
    totalCalories: 380, protein: 14, carbs: 52, fat: 12,
    imageUrl: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop',
    status: 'pending', aiScore: 88, aiSummary: 'Dengeli bir kahvaltı. Protein oranı yeterli, lif içeriği iyi. Porsiyon kontrolü başarılı.',
  },
  {
    id: 'mock-mr2', patientName: 'Mehmet Kaya', patientId: 'p2', date: '2026-04-16',
    mealType: 'Öğle', items: ['Mercimek çorbası (1 kase)', 'Tam buğday ekmeği (1 dilim)', 'Ayran (1 bardak)'],
    totalCalories: 420, protein: 22, carbs: 58, fat: 10,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    status: 'pending', aiScore: 76, aiSummary: 'İyi bir öğle yemeği seçimi. Biraz daha sebze eklenebilir. Protein kaynağı çeşitlendirilebilir.',
  },
  {
    id: 'mock-mr3', patientName: 'Fatma Demir', patientId: 'p3', date: '2026-04-16',
    mealType: 'Akşam', items: ['Fırında tavuk göğsü (150g)', 'Buharda brokoli (200g)', 'Bulgur pilavı (1 porsiyon)', 'Salata'],
    totalCalories: 510, protein: 42, carbs: 48, fat: 14,
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop',
    status: 'pending', aiScore: 92, aiSummary: 'Mükemmel bir akşam yemeği. Protein, karbonhidrat ve yağ dengesi ideal. Sebze çeşitliliği başarılı.',
  },
  {
    id: 'mock-mr4', patientName: 'Zeynep Çelik', patientId: 'p4', date: '2026-04-15',
    mealType: 'Ara Öğün', items: ['Ceviz (30g)', 'Kuru kayısı (5 adet)', 'Kefir (200ml)'],
    totalCalories: 280, protein: 10, carbs: 28, fat: 16,
    imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop',
    status: 'pending', aiScore: 70, aiSummary: 'Atıştırmalık olarak uygun. Kuru meyve miktarı biraz fazla, şeker açısından dikkat edilmeli.',
  },
  {
    id: 'mock-mr5', patientName: 'Ali Öztürk', patientId: 'p5', date: '2026-04-15',
    mealType: 'Kahvaltı', items: ['Yumurta (2 adet, haşlanmış)', 'Domates-salatalık', 'Beyaz peynir (40g)', 'Tam buğday ekmeği (2 dilim)', 'Zeytin (8 adet)'],
    totalCalories: 450, protein: 24, carbs: 35, fat: 22,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    status: 'approved', aiScore: 85, aiSummary: 'Klasik Türk kahvaltısı, dengeli besin değerleri. Protein ve sağlıklı yağ oranı iyi.',
  },
  {
    id: 'mock-mr6', patientName: 'Selin Aydın', patientId: 'p6', date: '2026-04-15',
    mealType: 'Öğle', items: ['Hamburger (1 adet)', 'Patates kızartması (büyük)', 'Kola (330ml)'],
    totalCalories: 950, protein: 28, carbs: 98, fat: 48,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    status: 'rejected', aiScore: 32, aiSummary: 'Kalori değeri çok yüksek. İşlenmiş gıda ve şekerli içecek diyete uygun değil. Sağlıklı alternatifler önerildi.',
  },
  {
    id: 'mock-mr7', patientName: 'Ayşe Yılmaz', patientId: 'p1', date: '2026-04-15',
    mealType: 'Akşam', items: ['Izgara köfte (3 adet)', 'Yoğurt (1 kase)', 'Mevsim salata', 'Esmer pirinç pilavı (1 porsiyon)'],
    totalCalories: 580, protein: 38, carbs: 42, fat: 24,
    imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
    status: 'pending', aiScore: 78, aiSummary: 'Protein açısından yeterli. Karbonhidrat miktarı normal. Sebze çeşitliliği artırılabilir.',
  },
  {
    id: 'mock-mr8', patientName: 'Mehmet Kaya', patientId: 'p2', date: '2026-04-14',
    mealType: 'Ara Öğün', items: ['Elma (1 adet)', 'Fıstık ezmesi (1 yemek kaşığı)'],
    totalCalories: 195, protein: 5, carbs: 22, fat: 10,
    imageUrl: 'https://images.unsplash.com/photo-1574226516831-e1dff420e562?w=400&h=300&fit=crop',
    status: 'pending', aiScore: 82, aiSummary: 'Sağlıklı bir ara öğün. Meyve ve sağlıklı yağ kombinasyonu tokluk hissi sağlar.',
  },
]

/* ─── Meal Card Sub-component ──────────────────── */

function MealCard({
  review,
  onApprove,
  onReject,
  notes,
  onNotesChange,
}: {
  review: MealReview
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  notes: string
  onNotesChange: (id: string, value: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null)
  const macros = getMacroPercent(review.protein, review.carbs, review.fat)
  const isPending = review.status === 'pending'

  const handleConfirm = () => {
    if (confirmAction === 'approve') onApprove?.(review.id)
    if (confirmAction === 'reject') onReject?.(review.id)
    setConfirmAction(null)
  }

  return (
    <Card
      className={cn(
        'py-0 gap-0 transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]',
        'hover:shadow-md',
        review.status === 'approved' && 'border-[var(--success)]/30 bg-[var(--success)]/[0.02]',
        review.status === 'rejected' && 'border-destructive/30 bg-destructive/[0.02]',
      )}
    >
      {/* Card header: patient info + meal type */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={avatarFor(review.patientName)} alt={review.patientName} />
          <AvatarFallback className={cn('text-xs font-semibold', getAvatarColor(review.patientName))}>
            {getInitials(review.patientName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight truncate">{review.patientName}</p>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
            mealTypeColor[review.mealType] || 'bg-secondary text-secondary-foreground',
          )}
        >
          {review.mealType}
        </span>
      </div>

      {/* Food photo */}
      <div className="mx-4 mb-3">
        {review.imageUrl ? (
          <div className="h-36 rounded-lg overflow-hidden">
            <img
              src={review.imageUrl}
              alt={`${review.patientName} - ${review.mealType}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="h-28 rounded-lg bg-surface-2 border-2 border-dashed border-border flex items-center justify-center transition-colors duration-[var(--duration-fast)]">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-5 w-5 mx-auto mb-1 opacity-50" />
              <p className="text-[10px]">Öğün fotoğrafı</p>
            </div>
          </div>
        )}
      </div>

      {/* Macro summary row */}
      <div className="mx-4 mb-3 grid grid-cols-4 gap-1.5">
        <div className="flex flex-col items-center rounded-lg bg-surface-2 px-1.5 py-2 transition-colors duration-[var(--duration-fast)]">
          <Flame className="h-3 w-3 text-orange-500 mb-0.5" />
          <p className="text-[10px] text-muted-foreground">Kalori</p>
          <p className="text-xs font-semibold tabular-nums">{review.totalCalories}</p>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-surface-2 px-1.5 py-2 transition-colors duration-[var(--duration-fast)]">
          <Beef className="h-3 w-3 text-red-500 mb-0.5" />
          <p className="text-[10px] text-muted-foreground">Protein</p>
          <p className="text-xs font-semibold tabular-nums">{review.protein}g</p>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-surface-2 px-1.5 py-2 transition-colors duration-[var(--duration-fast)]">
          <Wheat className="h-3 w-3 text-amber-500 mb-0.5" />
          <p className="text-[10px] text-muted-foreground">Karb.</p>
          <p className="text-xs font-semibold tabular-nums">{review.carbs}g</p>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-surface-2 px-1.5 py-2 transition-colors duration-[var(--duration-fast)]">
          <Droplets className="h-3 w-3 text-blue-500 mb-0.5" />
          <p className="text-[10px] text-muted-foreground">Yağ</p>
          <p className="text-xs font-semibold tabular-nums">{review.fat}g</p>
        </div>
      </div>

      {/* AI evaluation indicator */}
      <div className="mx-4 mb-3">
        <div className="flex items-center gap-2 rounded-lg border bg-surface-2/50 px-3 py-2 transition-colors duration-[var(--duration-fast)]">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <Bot className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-medium text-muted-foreground">AI Skor</span>
              <span className={cn('text-xs font-bold tabular-nums', getAiScoreColor(review.aiScore))}>
                {review.aiScore}/100
              </span>
            </div>
            <Progress
              value={review.aiScore}
              className={cn('h-1', getAiScoreProgressColor(review.aiScore))}
            />
          </div>
          {review.aiScore >= 85 && <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
          {review.aiScore < 60 && <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
        </div>
      </div>

      {/* Expand/collapse toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mx-4 mb-2 flex items-center justify-center gap-1 rounded-md py-1.5 text-xs text-muted-foreground transition-colors duration-[var(--duration-fast)] hover:bg-secondary hover:text-foreground cursor-pointer"
      >
        {expanded ? (
          <>
            <ChevronUp className="h-3 w-3" />
            Detayları gizle
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3" />
            Detayları gör
          </>
        )}
      </button>

      {/* Expanded detail section */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]',
          expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="mx-4 mb-3 space-y-3">
          <Separator />

          {/* Food items list */}
          <div>
            <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
              <UtensilsCrossed className="h-3 w-3 text-muted-foreground" />
              Yiyecekler
            </p>
            <ul className="space-y-1">
              {review.items.map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Nutritional chart — macro distribution bars */}
          <div>
            <p className="text-xs font-medium mb-2">Makro Dağılımı</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-12">Protein</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-400 transition-all duration-[var(--duration-slow)] ease-[var(--ease-out-expo)]"
                    style={{ width: `${macros.p}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold tabular-nums w-8 text-right">{macros.p}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-12">Karb.</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-[var(--duration-slow)] ease-[var(--ease-out-expo)]"
                    style={{ width: `${macros.c}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold tabular-nums w-8 text-right">{macros.c}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-12">Yağ</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-400 transition-all duration-[var(--duration-slow)] ease-[var(--ease-out-expo)]"
                    style={{ width: `${macros.f}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold tabular-nums w-8 text-right">{macros.f}%</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* AI detailed summary */}
          <div className="rounded-lg border bg-primary/[0.03] px-3 py-2.5 dark:bg-primary/[0.06]">
            <div className="flex items-center gap-1.5 mb-1">
              <Bot className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-semibold text-primary">NutriAI Değerlendirmesi</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{review.aiSummary}</p>
          </div>

          {/* Notes input (only for pending) */}
          {isPending && (
            <Textarea
              placeholder="Diyetisyen notu ekle..."
              value={notes}
              onChange={(e) => onNotesChange(review.id, e.target.value)}
              className="resize-none text-xs min-h-[60px]"
              rows={2}
            />
          )}
        </div>
      </div>

      {/* Action buttons (pending only) */}
      {isPending && (
        <div className="px-4 pb-4">
          {confirmAction ? (
            <div className="animate-scale-in">
              <div className="rounded-lg border border-dashed p-3 text-center space-y-2">
                <p className="text-xs font-medium">
                  {confirmAction === 'approve' ? 'Öğünü onaylamak' : 'Öğünü reddetmek'} istediğinize emin misiniz?
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs"
                    onClick={() => setConfirmAction(null)}
                  >
                    Vazgeç
                  </Button>
                  <Button
                    size="sm"
                    className={cn(
                      'flex-1 h-7 text-xs',
                      confirmAction === 'reject' && 'bg-destructive text-white hover:bg-destructive/90',
                    )}
                    onClick={handleConfirm}
                  >
                    {confirmAction === 'approve' ? 'Onayla' : 'Reddet'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => setConfirmAction('approve')}
              >
                <Check className="h-3.5 w-3.5" />
                Onayla
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 h-8 text-xs"
                onClick={() => setConfirmAction('reject')}
              >
                <X className="h-3.5 w-3.5" />
                Reddet
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Status footer for approved/rejected */}
      {!isPending && (
        <div className="px-4 pb-4">
          <div
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium',
              review.status === 'approved' && 'bg-[var(--success)]/10 text-[var(--success)]',
              review.status === 'rejected' && 'bg-destructive/10 text-destructive',
            )}
          >
            {review.status === 'approved' ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Onaylandı
              </>
            ) : (
              <>
                <X className="h-3.5 w-3.5" />
                Reddedildi
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

/* ─── Kanban Column Sub-component ──────────────── */

function KanbanColumn({
  status,
  reviews,
  onApprove,
  onReject,
  notes,
  onNotesChange,
}: {
  status: ColumnStatus
  reviews: MealReview[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  notes: Record<string, string>
  onNotesChange: (id: string, value: string) => void
}) {
  const config = columnConfig[status]
  const EmptyIcon = config.emptyIcon

  return (
    <div className="flex flex-col min-w-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-md',
            status === 'pending' && 'bg-[var(--warning)]/15 text-[var(--warning)]',
            status === 'approved' && 'bg-[var(--success)]/15 text-[var(--success)]',
            status === 'rejected' && 'bg-destructive/15 text-destructive',
          )}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-sm font-semibold tracking-tight">{config.label}</h3>
        <Badge variant={config.badgeVariant} className="ml-auto text-[10px] px-2 py-0">
          {reviews.length}
        </Badge>
      </div>

      {/* Cards list */}
      <div className="space-y-3 animate-in-stagger">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <MealCard
              key={review.id}
              review={review}
              onApprove={status === 'pending' ? onApprove : undefined}
              onReject={status === 'pending' ? onReject : undefined}
              notes={notes[review.id] || ''}
              onNotesChange={onNotesChange}
            />
          ))
        ) : (
          <div className="rounded-xl border-2 border-dashed py-12 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-2">
              <EmptyIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{config.emptyText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main Page Component ──────────────────────── */

export default function MealReviewPage() {
  const [reviews, setReviews] = useState<MealReview[]>([])
  const [search, setSearch] = useState('')
  const [mealTypeFilter, setMealTypeFilter] = useState('all')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Fetch all dietitian's patients' meals (backend now supports this)
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await getMeals({ startDate: '2020-01-01', endDate: '2099-12-31' })
        const items = Array.isArray(res?.items) ? res.items : []
        if (cancelled) return
        if (items.length > 0) {
          const mapped: MealReview[] = items.map((m: any) => {
            // axios interceptor converts snake_case → camelCase, so prefer camelCase keys
            const mealType = m.mealType ?? m.meal_type ?? m.type ?? ''
            const tr =
              mealType === 'breakfast' ? 'Kahvaltı'
              : mealType === 'lunch' ? 'Öğle'
              : mealType === 'dinner' ? 'Akşam'
              : 'Ara Öğün'

            // Sum item-level macros when meal-level totals are null (common for manual entries)
            const itemList = Array.isArray(m.items) ? m.items : []
            const sumField = (key: string) =>
              itemList.reduce((acc: number, i: any) => acc + Number(i?.[key] ?? 0), 0)

            const totalCalories = Number(m.totalCalories ?? m.total_calories ?? 0) || sumField('calories')
            const protein = Number(m.totalProtein ?? m.total_protein ?? 0) || sumField('protein')
            const carbs = Number(m.totalCarbs ?? m.total_carbs ?? 0) || sumField('carbs')
            const fat = Number(m.totalFat ?? m.total_fat ?? 0) || sumField('fat')

            const firstName = m.patientFirstName ?? m.patient_first_name ?? ''
            const lastName = m.patientLastName ?? m.patient_last_name ?? ''
            const patientName = m.patientName || `${firstName} ${lastName}`.trim() || 'Hasta'

            const photoUrl = m.photoUrl ?? m.photo_url ?? m.imageUrl ?? null
            // Curated Turkish food image based on meal type (no laptop/ocean random crap)
            const imageUrl = photoUrl || mealPhotoFor(mealType, m.id)

            const dietitianViewed = m.dietitianViewed ?? m.dietitian_viewed ?? false
            const dietitianFeedback: string = m.dietitianFeedback ?? m.dietitian_feedback ?? ''
            // Heuristic: if feedback text contains rejection keywords, treat as rejected
            const isRejected = dietitianViewed && /reddet|red\b|uygun değil|onaylanma/i.test(dietitianFeedback)
            const status: MealReview['status'] = isRejected
              ? 'rejected'
              : dietitianViewed
                ? 'approved'
                : 'pending'

            // Simple AI score heuristic when backend doesn't provide one
            const aiScore = Number(m.aiScore ?? (totalCalories > 0 && totalCalories < 700 ? 82 : 70))
            const entryMethod = m.entryMethod ?? m.entry_method
            return {
              id: m.id,
              patientName,
              patientId: m.patientId ?? m.patient_id ?? '',
              date: String(m.logDate ?? m.log_date ?? m.date ?? '').slice(0, 10),
              mealType: tr as MealReview['mealType'],
              items: itemList.map((i: any) => {
                const name = i.foodName ?? i.food_name ?? i.name ?? ''
                const grams = i.finalAmountG ?? i.final_amount_g ?? i.amount ?? ''
                return grams ? `${name} (${grams}g)` : name
              }),
              totalCalories: Math.round(totalCalories),
              protein: Math.round(protein),
              carbs: Math.round(carbs),
              fat: Math.round(fat),
              imageUrl,
              status,
              aiScore,
              aiSummary:
                m.aiSummary ??
                dietitianFeedback ??
                (entryMethod === 'photo_ai'
                  ? 'AI fotoğraf analizi ile eklendi.'
                  : 'Manuel olarak kaydedilmiş öğün.'),
            }
          })
          setReviews(mapped)
        } else {
          setReviews(mockMealReviews)
        }
      } catch {
        if (!cancelled) setReviews(mockMealReviews)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleApprove = async (id: string) => {
    const note = notes[id] || ''
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r)))
    // Skip backend persist for mock (non-UUID) ids
    if (id.startsWith('mock-')) {
      toast.success('Öğün onaylandı (demo veri)')
      return
    }
    try {
      await approveMeal(id, note)
      toast.success('Öğün onaylandı')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Öğün onaylanamadı.'
      toast.error(msg)
    }
  }

  const handleReject = async (id: string) => {
    const note = notes[id] || ''
    if (!note.trim()) {
      toast.error('Reddederken bir not yazın (hastaya gönderilecek).')
      return
    }
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r)))
    if (id.startsWith('mock-')) {
      toast.success('Öğün reddedildi (demo veri)')
      return
    }
    try {
      await rejectMeal(id, note)
      toast.success('Öğün reddedildi')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Öğün reddedilemedi.'
      toast.error(msg)
    }
  }

  const handleNotesChange = (id: string, value: string) => {
    setNotes((prev) => ({ ...prev, [id]: value }))
  }

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch = r.patientName.toLowerCase().includes(search.toLowerCase())
      const matchesMealType = mealTypeFilter === 'all' || r.mealType === mealTypeFilter
      return matchesSearch && matchesMealType
    })
  }, [reviews, search, mealTypeFilter])

  const pendingReviews = useMemo(() => filtered.filter((r) => r.status === 'pending'), [filtered])
  const approvedReviews = useMemo(() => filtered.filter((r) => r.status === 'approved'), [filtered])
  const rejectedReviews = useMemo(() => filtered.filter((r) => r.status === 'rejected'), [filtered])

  const totalPending = reviews.filter((r) => r.status === 'pending').length

  if (isLoading) return <DetailPageSkeleton />

  return (
    <PageContainer
      title="Öğün Değerlendirme"
      description="Hastaların kaydettiği öğünleri inceleyin ve onaylayın."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="tabular-nums">
            <Clock className="h-3 w-3" />
            {totalPending} bekleyen
          </Badge>
        </div>
      }
    >
      {/* Search & Filter bar */}
      <Card className="py-0 gap-0 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Hasta ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Öğün Tipi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Öğünler</SelectItem>
                  <SelectItem value="Kahvaltı">Kahvaltı</SelectItem>
                  <SelectItem value="Öğle">Öğle</SelectItem>
                  <SelectItem value="Akşam">Akşam</SelectItem>
                  <SelectItem value="Ara Öğün">Ara Öğün</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Quick stats */}
            <div className="hidden sm:flex items-center gap-3 ml-auto text-xs text-muted-foreground">
              <span className="flex items-center gap-1 tabular-nums">
                <span className="h-2 w-2 rounded-full bg-[var(--warning)]" />
                {pendingReviews.length} bekleyen
              </span>
              <span className="flex items-center gap-1 tabular-nums">
                <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                {approvedReviews.length} onaylı
              </span>
              <span className="flex items-center gap-1 tabular-nums">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                {rejectedReviews.length} red
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban board — 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KanbanColumn
          status="pending"
          reviews={pendingReviews}
          onApprove={handleApprove}
          onReject={handleReject}
          notes={notes}
          onNotesChange={handleNotesChange}
        />
        <KanbanColumn
          status="approved"
          reviews={approvedReviews}
          onApprove={handleApprove}
          onReject={handleReject}
          notes={notes}
          onNotesChange={handleNotesChange}
        />
        <KanbanColumn
          status="rejected"
          reviews={rejectedReviews}
          onApprove={handleApprove}
          onReject={handleReject}
          notes={notes}
          onNotesChange={handleNotesChange}
        />
      </div>

      {/* All reviewed empty state */}
      {filtered.length === 0 && (
        <EmptyState icon={UtensilsCrossed} title="İncelenecek öğün yok" description="Hastaların gönderdiği öğünler burada görünecek." />
      )}
    </PageContainer>
  )
}
