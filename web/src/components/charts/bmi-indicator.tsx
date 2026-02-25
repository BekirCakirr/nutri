import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface BMIIndicatorProps {
  value?: number
  title?: string
  className?: string
}

interface BMIZone {
  label: string
  min: number
  max: number
  color: string
  bgColor: string
}

const zones: BMIZone[] = [
  { label: 'Zayıf', min: 0, max: 18.5, color: 'text-blue-600', bgColor: 'bg-blue-400' },
  { label: 'Normal', min: 18.5, max: 25, color: 'text-green-600', bgColor: 'bg-green-400' },
  { label: 'Kilolu', min: 25, max: 30, color: 'text-yellow-600', bgColor: 'bg-yellow-400' },
  { label: 'Obez', min: 30, max: 40, color: 'text-red-600', bgColor: 'bg-red-400' },
]

function getZone(bmi: number): BMIZone {
  return zones.find((z) => bmi >= z.min && bmi < z.max) ?? zones[zones.length - 1]
}

function getIndicatorPosition(bmi: number): number {
  const minBmi = 14
  const maxBmi = 40
  const clamped = Math.min(maxBmi, Math.max(minBmi, bmi))
  return ((clamped - minBmi) / (maxBmi - minBmi)) * 100
}

export function BMIIndicator({
  value = 24.5,
  title = 'Vücut Kitle İndeksi',
  className,
}: BMIIndicatorProps) {
  const zone = getZone(value)
  const position = getIndicatorPosition(value)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className={cn('text-3xl font-bold', zone.color)}>
            {value.toFixed(1)}
          </span>
          <span className={cn('text-sm font-medium', zone.color)}>
            {zone.label}
          </span>
        </div>

        <div className="relative">
          {/* Color bar */}
          <div className="flex h-3 overflow-hidden rounded-full">
            <div className="flex-1 bg-blue-400" />
            <div className="flex-[2.5] bg-green-400" />
            <div className="flex-[2] bg-yellow-400" />
            <div className="flex-[4] bg-red-400" />
          </div>

          {/* Indicator */}
          <div
            className="absolute -top-1 h-5 w-1 rounded-full bg-foreground transition-all duration-300"
            style={{ left: `${position}%` }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>14</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>
      </CardContent>
    </Card>
  )
}
