import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WaterDataPoint {
  date: string
  amount: number
}

interface WaterIntakeChartProps {
  data?: WaterDataPoint[]
  target?: number
  title?: string
  className?: string
}

const defaultData: WaterDataPoint[] = [
  { date: 'Pzt', amount: 2.1 },
  { date: 'Sal', amount: 1.8 },
  { date: 'Çar', amount: 2.5 },
  { date: 'Per', amount: 2.0 },
  { date: 'Cum', amount: 1.5 },
  { date: 'Cmt', amount: 2.3 },
  { date: 'Paz', amount: 1.9 },
]

export function WaterIntakeChart({
  data = defaultData,
  target = 2.0,
  title = 'Su Tüketimi',
  className,
}: WaterIntakeChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              unit=" L"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
              formatter={(value: number) => [`${value} L`, 'Su']}
            />
            <ReferenceLine
              y={target}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{
                value: `Hedef: ${target}L`,
                position: 'right',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="amount"
              fill="hsl(210, 100%, 55%)"
              radius={[4, 4, 0, 0]}
              name="Su"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
