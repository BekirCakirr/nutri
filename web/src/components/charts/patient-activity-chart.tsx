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
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600, marginBottom: '4px' }}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Legend 
               verticalAlign="bottom" 
               height={36} 
               iconType="circle"
               wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
            <Bar
              dataKey="mealLogs"
              fill="hsl(140, 70%, 45%)"
              name="Öğün Kaydı"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="logins"
              fill="hsl(175, 94%, 55%)"
              name="Giriş"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="messages"
              fill="hsl(155, 40%, 80%)"
              name="Mesaj"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
