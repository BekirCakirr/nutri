import { Coffee, Cookie, Moon, Sun } from 'lucide-react'
import type { ElementType } from 'react'
import { cn } from '@/lib/utils'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

interface MealTypeIconProps {
  type: MealType
  className?: string
  showLabel?: boolean
}

const mealConfig: Record<MealType, { icon: ElementType; label: string; className: string }> = {
  breakfast: {
    icon: Coffee,
    label: 'Kahvaltı',
    className: 'text-orange-500',
  },
  lunch: {
    icon: Sun,
    label: 'Öğle',
    className: 'text-yellow-500',
  },
  dinner: {
    icon: Moon,
    label: 'Akşam',
    className: 'text-indigo-500',
  },
  snack: {
    icon: Cookie,
    label: 'Ara Öğün',
    className: 'text-pink-500',
  },
}

export function MealTypeIcon({ type, className, showLabel = false }: MealTypeIconProps) {
  const config = mealConfig[type]
  const Icon = config.icon

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <Icon className={cn('h-4 w-4', config.className)} />
      {showLabel && (
        <span className="text-sm">{config.label}</span>
      )}
    </span>
  )
}
