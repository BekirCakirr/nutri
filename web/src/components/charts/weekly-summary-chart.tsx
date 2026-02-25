import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WeeklySummaryDataPoint {
  day: string
  protein: number
  carbs: number
  fat: number
}

interface WeeklySummaryChartProps {
  data?: WeeklySummaryDataPoint[]
  title?: string
  className?: string
}

const defaultData: WeeklySummaryDataPoint[] = [
  { day: 'Pzt', protein: 120, carbs: 250, fat: 65 },
  { day: 'Sal', protein: 110, carbs: 230, fat: 70 },
  { day: 'Çar', protein: 130, carbs: 260, fat: 60 },
  { day: 'Per', protein: 125, carbs: 240, fat: 72 },
  { day: 'Cum', protein: 100, carbs: 220, fat: 68 },
  { day: 'Cmt', protein: 115, carbs: 270, fat: 75 },
  { day: 'Paz', protein: 105, carbs: 235, fat: 62 },
]

export function WeeklySummaryChart({
  data = defaultData,
  title = 'Haftalık Beslenme Özeti',
  className,
}: WeeklySummaryChartProps) {
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
              dataKey="day"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              unit="g"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
              formatter={(value: number) => [`${value}g`, '']}
            />
            <Legend />
            <Bar
              dataKey="protein"
              fill="hsl(210, 100%, 50%)"
              radius={[4, 4, 0, 0]}
              name="Protein"
            />
            <Bar
              dataKey="carbs"
              fill="hsl(45, 100%, 50%)"
              radius={[4, 4, 0, 0]}
              name="Karbonhidrat"
            />
            <Bar
              dataKey="fat"
              fill="hsl(140, 70%, 45%)"
              radius={[4, 4, 0, 0]}
              name="Yağ"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
