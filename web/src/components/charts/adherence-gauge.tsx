import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AdherenceGaugeProps {
  value?: number
  title?: string
  label?: string
  className?: string
}

function getColor(value: number): string {
  if (value >= 80) return 'text-green-500'
  if (value >= 60) return 'text-yellow-500'
  return 'text-red-500'
}

function getStrokeColor(value: number): string {
  if (value >= 80) return 'stroke-green-500'
  if (value >= 60) return 'stroke-yellow-500'
  return 'stroke-red-500'
}

export function AdherenceGauge({
  value = 75,
  title = 'Uyum Oranı',
  label = 'uyum',
  className,
}: AdherenceGaugeProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (clampedValue / 100) * circumference

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative h-36 w-36">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              className="stroke-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={cn('transition-all duration-500', getStrokeColor(clampedValue))}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-3xl font-bold', getColor(clampedValue))}>
              %{clampedValue}
            </span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
