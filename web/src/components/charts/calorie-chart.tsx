import {
  LineChart,
  Line,
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
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4, fill: 'hsl(var(--primary))' }}
              name="Kalori"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name="Hedef"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
