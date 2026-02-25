import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ActivityDataPoint {
  date: string
  logins: number
  mealLogs: number
  messages: number
}

interface PatientActivityChartProps {
  data?: ActivityDataPoint[]
  title?: string
  className?: string
}

const defaultData: ActivityDataPoint[] = [
  { date: '1. Hafta', logins: 5, mealLogs: 18, messages: 3 },
  { date: '2. Hafta', logins: 6, mealLogs: 20, messages: 5 },
  { date: '3. Hafta', logins: 4, mealLogs: 15, messages: 2 },
  { date: '4. Hafta', logins: 7, mealLogs: 21, messages: 4 },
  { date: '5. Hafta', logins: 5, mealLogs: 19, messages: 6 },
  { date: '6. Hafta', logins: 6, mealLogs: 20, messages: 3 },
]

export function PatientActivityChart({
  data = defaultData,
  title = 'Hasta Aktivitesi',
  className,
}: PatientActivityChartProps) {
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
            <Legend />
            <Line
              type="monotone"
              dataKey="logins"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Giriş"
            />
            <Line
              type="monotone"
              dataKey="mealLogs"
              stroke="hsl(45, 100%, 50%)"
              strokeWidth={2}
              name="Öğün Kaydı"
            />
            <Line
              type="monotone"
              dataKey="messages"
              stroke="hsl(140, 70%, 45%)"
              strokeWidth={2}
              name="Mesaj"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
