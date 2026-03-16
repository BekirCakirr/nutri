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

interface CalorieDataPoint {
  date: string
  calories: number
  target?: number
}

interface CalorieChartProps {
  data?: CalorieDataPoint[]
  title?: string
  className?: string
}

const defaultData: CalorieDataPoint[] = [
  { date: 'Pzt', calories: 1850, target: 2000 },
  { date: 'Sal', calories: 2100, target: 2000 },
  { date: 'Çar', calories: 1920, target: 2000 },
  { date: 'Per', calories: 2200, target: 2000 },
  { date: 'Cum', calories: 1780, target: 2000 },
  { date: 'Cmt', calories: 2050, target: 2000 },
  { date: 'Paz', calories: 1900, target: 2000 },
]

export function CalorieChart({
  data = defaultData,
  title = 'Günlük Kalori Alımı',
  className,
}: CalorieChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(140, 70%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(140, 70%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
              itemStyle={{ color: 'hsl(140, 70%, 45%)', fontWeight: 500 }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600, marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="transparent"
              name="Hedef"
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="hsl(140, 70%, 45%)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCalories)"
              name="Kalori"
              activeDot={{ r: 6, fill: 'hsl(140, 70%, 45%)', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
