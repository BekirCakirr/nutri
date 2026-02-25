import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WeightDataPoint {
  date: string
  weight: number
  target?: number
}

interface WeightProgressChartProps {
  data?: WeightDataPoint[]
  title?: string
  className?: string
}

const defaultData: WeightDataPoint[] = [
  { date: '1 Oca', weight: 85, target: 78 },
  { date: '15 Oca', weight: 84.2, target: 78 },
  { date: '1 Şub', weight: 83.5, target: 78 },
  { date: '15 Şub', weight: 82.8, target: 78 },
  { date: '1 Mar', weight: 82.1, target: 78 },
  { date: '15 Mar', weight: 81.3, target: 78 },
  { date: '1 Nis', weight: 80.5, target: 78 },
]

export function WeightProgressChart({
  data = defaultData,
  title = 'Kilo Takibi',
  className,
}: WeightProgressChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              domain={['dataMin - 2', 'dataMax + 2']}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              unit=" kg"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
              formatter={(value: number) => [`${value} kg`, '']}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary) / 0.1)"
              strokeWidth={2}
              name="Kilo"
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="hsl(var(--muted-foreground))"
              fill="none"
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Hedef"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
