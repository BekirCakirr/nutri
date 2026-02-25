import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface AdminReportsViewProps {
  userGrowth?: { month: string; users: number }[];
  mealLogs?: { month: string; meals: number }[];
}

const defaultUserGrowth = [
  { month: "Eyl", users: 45 },
  { month: "Eki", users: 68 },
  { month: "Kas", users: 92 },
  { month: "Ara", users: 125 },
  { month: "Oca", users: 180 },
  { month: "Sub", users: 220 },
];

const defaultMealLogs = [
  { month: "Eyl", meals: 320 },
  { month: "Eki", meals: 480 },
  { month: "Kas", meals: 650 },
  { month: "Ara", meals: 890 },
  { month: "Oca", meals: 1250 },
  { month: "Sub", meals: 1580 },
];

export function AdminReportsView({
  userGrowth = defaultUserGrowth,
  mealLogs = defaultMealLogs,
}: AdminReportsViewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kullanici Buyumesi</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ogun Kayitlari</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mealLogs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="meals" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
