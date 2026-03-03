import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MacroData {
  name: string
  value: number
  color: string
}

interface MacroPieChartProps {
  data?: MacroData[]
  title?: string
  className?: string
}

const defaultData: MacroData[] = [
  { name: 'Protein', value: 30, color: 'hsl(210, 100%, 50%)' },
  { name: 'Karbonhidrat', value: 50, color: 'hsl(45, 100%, 50%)' },
  { name: 'Yağ', value: 20, color: 'hsl(140, 70%, 45%)' },
]

export function MacroPieChart({
  data = defaultData,
  title = 'Makro Dağılımı',
  className,
}: MacroPieChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              label={({ name, percent }: { name?: string; percent?: number }) =>
                `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
              formatter={(value: number | undefined) => [`${value ?? 0}g`, '']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
