import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NutrientDataPoint {
  nutrient: string
  value: number
  max: number
}

interface NutrientRadarChartProps {
  data?: NutrientDataPoint[]
  title?: string
  className?: string
}

const defaultData: NutrientDataPoint[] = [
  { nutrient: 'Protein', value: 80, max: 100 },
  { nutrient: 'Karbonhidrat', value: 65, max: 100 },
  { nutrient: 'Yağ', value: 70, max: 100 },
  { nutrient: 'Lif', value: 55, max: 100 },
  { nutrient: 'Vitamin', value: 85, max: 100 },
  { nutrient: 'Mineral', value: 60, max: 100 },
]

export function NutrientRadarChart({
  data = defaultData,
  title = 'Besin Dengesi',
  className,
}: NutrientRadarChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid className="stroke-muted" />
            <PolarAngleAxis
              dataKey="nutrient"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
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
              formatter={(value: number) => [`%${value}`, 'Oran']}
            />
            <Radar
              name="Besin"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary) / 0.2)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
