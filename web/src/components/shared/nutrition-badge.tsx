import { cn } from '@/lib/utils'

type NutritionType = 'calories' | 'protein' | 'carbs' | 'fat'

interface NutritionBadgeProps {
  type: NutritionType
  value: number
  unit?: string
  className?: string
}

const nutritionConfig: Record<NutritionType, { label: string; className: string; defaultUnit: string }> = {
  calories: {
    label: 'Kalori',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    defaultUnit: 'kcal',
  },
  protein: {
    label: 'Protein',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    defaultUnit: 'g',
  },
  carbs: {
    label: 'Karbonhidrat',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    defaultUnit: 'g',
  },
  fat: {
    label: 'Yağ',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    defaultUnit: 'g',
  },
}

export function NutritionBadge({ type, value, unit, className }: NutritionBadgeProps) {
  const config = nutritionConfig[type]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
    >
      {value}
      {unit ?? config.defaultUnit}
    </span>
  )
}
