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
  { name: 'Protein', value: 30, color: 'hsl(175, 94%, 55%)' }, // Teal
  { name: 'Karbonhidrat', value: 50, color: 'hsl(140, 70%, 45%)' }, // Primary Green
  { name: 'Yağ', value: 20, color: 'hsl(155, 40%, 80%)' }, // Light Green
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
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              label={({ name, percent }: { name?: string; percent?: number }) =>
                `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
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
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
              itemStyle={{ fontWeight: 600 }}
              labelStyle={{ display: 'none' }}
              formatter={(value: number | undefined) => [`${value ?? 0}g`, '']}
            />
            <Legend 
               verticalAlign="bottom" 
               height={36} 
               iconType="circle"
               wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
