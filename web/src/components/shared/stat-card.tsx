import type { ElementType, ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon?: ElementType
  trend?: 'up' | 'down'
  trendLabel?: string
  color?: 'default' | 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'teal'
  className?: string
  sparkline?: ReactNode
  featured?: boolean
}

const colorMap = {
  default: {
    icon: 'bg-primary/10 text-primary',
    ring: 'ring-primary/5',
  },
  blue: {
    icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    ring: 'ring-blue-500/5',
  },
  green: {
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    ring: 'ring-emerald-500/5',
  },
  red: {
    icon: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    ring: 'ring-red-500/5',
  },
  yellow: {
    icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    ring: 'ring-amber-500/5',
  },
  purple: {
    icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    ring: 'ring-purple-500/5',
  },
  teal: {
    icon: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    ring: 'ring-teal-500/5',
  },
} as const

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'default',
  className,
  sparkline,
  featured = false,
}: StatCardProps) {
  const colors = colorMap[color]

  return (
    <Card
      className={cn(
        'gap-0 py-0 overflow-hidden transition-all duration-[var(--duration-fast)] hover:shadow-md',
        featured && 'ring-1 ring-primary/10',
        className
      )}
    >
      <CardContent className="flex items-start gap-4 p-5">
        {Icon && (
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              colors.icon,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className={cn('font-bold tabular-nums', featured ? 'text-3xl' : 'text-2xl')}>
              {value}
            </p>
            {trend && trendLabel && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-medium rounded-full px-1.5 py-0.5',
                  trend === 'up'
                    ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20'
                    : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
                )}
              >
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trendLabel}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      {sparkline && (
        <div className="h-10 px-5 pb-3 -mt-1">
          {sparkline}
        </div>
      )}
    </Card>
  )
}
