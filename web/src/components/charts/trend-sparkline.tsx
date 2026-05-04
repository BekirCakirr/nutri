import { LineChart, Line } from 'recharts'
import { cn } from '@/lib/utils'

interface TrendSparklineProps {
  data?: number[]
  trend?: 'up' | 'down' | 'neutral'
  width?: number
  height?: number
  className?: string
}

const defaultData = [30, 35, 28, 40, 38, 45, 42]

export function TrendSparkline({
  data = defaultData,
  trend,
  width = 80,
  height = 32,
  className,
}: TrendSparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }))

  const computedTrend =
    trend ??
    (data.length >= 2
      ? data[data.length - 1] > data[0]
        ? 'up'
        : data[data.length - 1] < data[0]
          ? 'down'
          : 'neutral'
      : 'neutral')

  const colorMap = {
    up: 'hsl(140, 70%, 45%)',
    down: 'hsl(0, 80%, 55%)',
    neutral: 'hsl(var(--muted-foreground))',
  }

  return (
    <div className={cn('inline-block', className)} style={{ width, height }}>
      <LineChart width={width} height={height} data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={colorMap[computedTrend]}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </div>
  )
}
