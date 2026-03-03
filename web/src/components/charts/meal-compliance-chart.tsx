import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ComplianceDataPoint {
  meal: string
  compliance: number
}

interface MealComplianceChartProps {
  data?: ComplianceDataPoint[]
  title?: string
  className?: string
}

const defaultData: ComplianceDataPoint[] = [
  { meal: 'Kahvaltı', compliance: 85 },
  { meal: 'Öğle', compliance: 72 },
  { meal: 'Akşam', compliance: 90 },
  { meal: 'Ara Öğün', compliance: 65 },
]

export function MealComplianceChart({
  data = defaultData,
  title = 'Öğün Uyumu',
  className,
}: MealComplianceChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              domain={[0, 100]}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              unit="%"
            />
            <YAxis
              type="category"
              dataKey="meal"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
              formatter={(value: number | undefined) => [`%${value ?? 0}`, 'Uyum']}
            />
            <Bar
              dataKey="compliance"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
              name="Uyum"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
