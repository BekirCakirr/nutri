import { cn } from '@/lib/utils'

interface CalorieBarProps {
  consumed?: number
  target?: number
  label?: string
  className?: string
}

export function CalorieBar({
  consumed = 1650,
  target = 2000,
  label = 'Kalori',
  className,
}: CalorieBarProps) {
  const percentage = Math.min(100, (consumed / target) * 100)
  const remaining = target - consumed
  const isOver = consumed > target

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {consumed} / {target} kcal
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isOver ? 'bg-red-500' : percentage > 90 ? 'bg-yellow-500' : 'bg-primary',
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className={cn('text-xs', isOver ? 'text-red-500' : 'text-muted-foreground')}>
        {isOver
          ? `${Math.abs(remaining)} kcal fazla`
          : `${remaining} kcal kaldı`}
      </p>
    </div>
  )
}
