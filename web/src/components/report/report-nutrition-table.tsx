import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NutritionRow {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

interface ReportNutritionTableProps {
  data?: NutritionRow[];
}

const defaultData: NutritionRow[] = [
  { day: "Pazartesi", calories: 1850, protein: 95, carbs: 220, fat: 55, water: 2.1 },
  { day: "Sali", calories: 1920, protein: 100, carbs: 230, fat: 58, water: 1.8 },
  { day: "Carsamba", calories: 1780, protein: 88, carbs: 210, fat: 52, water: 2.5 },
  { day: "Persembe", calories: 2010, protein: 105, carbs: 240, fat: 62, water: 2.3 },
  { day: "Cuma", calories: 1900, protein: 98, carbs: 225, fat: 56, water: 1.9 },
  { day: "Cumartesi", calories: 2100, protein: 110, carbs: 250, fat: 65, water: 2.4 },
  { day: "Pazar", calories: 1950, protein: 102, carbs: 235, fat: 59, water: 2.0 },
];

export function ReportNutritionTable({ data = defaultData }: ReportNutritionTableProps) {
  const avgCalories = Math.round(data.reduce((s, d) => s + d.calories, 0) / data.length);
  const avgProtein = Math.round(data.reduce((s, d) => s + d.protein, 0) / data.length);
  const avgCarbs = Math.round(data.reduce((s, d) => s + d.carbs, 0) / data.length);
  const avgFat = Math.round(data.reduce((s, d) => s + d.fat, 0) / data.length);
  const avgWater = (data.reduce((s, d) => s + d.water, 0) / data.length).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Beslenme Verileri</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gun</TableHead>
                <TableHead className="text-right">Kalori</TableHead>
                <TableHead className="text-right">Protein (g)</TableHead>
                <TableHead className="text-right">Karb. (g)</TableHead>
                <TableHead className="text-right">Yag (g)</TableHead>
                <TableHead className="text-right">Su (L)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.day}>
                  <TableCell className="font-medium">{row.day}</TableCell>
                  <TableCell className="text-right">{row.calories}</TableCell>
                  <TableCell className="text-right">{row.protein}</TableCell>
                  <TableCell className="text-right">{row.carbs}</TableCell>
                  <TableCell className="text-right">{row.fat}</TableCell>
                  <TableCell className="text-right">{row.water}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold bg-muted/50">
                <TableCell>Ortalama</TableCell>
                <TableCell className="text-right">{avgCalories}</TableCell>
                <TableCell className="text-right">{avgProtein}</TableCell>
                <TableCell className="text-right">{avgCarbs}</TableCell>
                <TableCell className="text-right">{avgFat}</TableCell>
                <TableCell className="text-right">{avgWater}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
