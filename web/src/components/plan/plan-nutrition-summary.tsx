import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface DaySummary {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface PlanNutritionSummaryProps {
  dailyData?: DaySummary[];
  weeklyTotals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const defaultDaily: DaySummary[] = [
  { day: "Pzt", calories: 1850, protein: 95, carbs: 220, fat: 55 },
  { day: "Sal", calories: 1920, protein: 100, carbs: 230, fat: 58 },
  { day: "Car", calories: 1780, protein: 88, carbs: 210, fat: 52 },
  { day: "Per", calories: 2010, protein: 105, carbs: 240, fat: 62 },
  { day: "Cum", calories: 1900, protein: 98, carbs: 225, fat: 56 },
  { day: "Cmt", calories: 2100, protein: 110, carbs: 250, fat: 65 },
  { day: "Paz", calories: 1950, protein: 102, carbs: 235, fat: 59 },
];

const defaultWeekly = {
  calories: 13510,
  protein: 698,
  carbs: 1610,
  fat: 407,
};

export function PlanNutritionSummary({
  dailyData = defaultDaily,
  weeklyTotals = defaultWeekly,
}: PlanNutritionSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Beslenme Ozeti</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList>
            <TabsTrigger value="daily">Gunluk</TabsTrigger>
            <TabsTrigger value="weekly">Haftalik</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="protein" name="Protein (g)" fill="#ef4444" radius={[2, 2, 0, 0]} />
                <Bar dataKey="carbs" name="Karbonhidrat (g)" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="fat" name="Yag (g)" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="weekly" className="mt-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold">{weeklyTotals.calories}</p>
                <p className="text-xs text-muted-foreground">Toplam Kalori</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold">{weeklyTotals.protein}g</p>
                <p className="text-xs text-muted-foreground">Toplam Protein</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold">{weeklyTotals.carbs}g</p>
                <p className="text-xs text-muted-foreground">Toplam Karbonhidrat</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold">{weeklyTotals.fat}g</p>
                <p className="text-xs text-muted-foreground">Toplam Yag</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
