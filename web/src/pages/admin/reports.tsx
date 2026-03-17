import { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  UtensilsCrossed,
  CalendarDays,
  Download,
  Activity,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageContainer } from '@/components/shared/page-container'
import { DashboardSkeleton } from '@/components/shared/page-skeletons'
import { StatCard } from '@/components/shared/stat-card'
import { cn } from '@/lib/utils'

const monthlyStats = [
  { month: 'Eylül', users: 856, meals: 12400, appointments: 340, revenue: 45200 },
  { month: 'Ekim', users: 924, meals: 14200, appointments: 380, revenue: 51800 },
  { month: 'Kasım', users: 1012, meals: 15800, appointments: 410, revenue: 58400 },
  { month: 'Aralık', users: 1089, meals: 16500, appointments: 390, revenue: 54600 },
  { month: 'Ocak', users: 1168, meals: 18200, appointments: 420, revenue: 62800 },
  { month: 'Şubat', users: 1247, meals: 17800, appointments: 445, revenue: 64200 },
]

export default function AdminReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 400); return () => clearTimeout(t) }, [])

  if (isLoading) return <DashboardSkeleton />

  return (
    <PageContainer
      title="Sistem Raporları"
      description="Platform analitikleri ve istatistikleri."
      actions={
        <Button size="sm">
          <Download className="h-3.5 w-3.5" />
          Rapor İndir
        </Button>
      }
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-in-stagger">
        <StatCard
          title="Toplam Kullanıcı"
          value="1.247"
          icon={Users}
          color="blue"
          trend="up"
          trendLabel="+79 bu ay"
          featured
        />
        <StatCard
          title="Aylık Öğün Kaydı"
          value="17.800"
          icon={UtensilsCrossed}
          color="green"
          trend="down"
          trendLabel="-2.2%"
        />
        <StatCard
          title="Aylık Randevu"
          value="445"
          icon={CalendarDays}
          color="purple"
          trend="up"
          trendLabel="+5.9%"
        />
        <StatCard
          title="Ort. Uyum Skoru"
          value="%76"
          icon={TrendingUp}
          color="yellow"
          trend="up"
          trendLabel="+3%"
        />
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle className="text-base">Kullanıcı Büyümesi</CardTitle>
            <CardDescription>Son 6 aylık kullanıcı artışı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
              <div className="text-center text-muted-foreground">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-sm font-medium">Kullanıcı Büyüme Grafiği</p>
                <p className="mt-0.5 text-xs">856 &rarr; 1.247 (+45.7%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle className="text-base">Öğün Kayıtları</CardTitle>
            <CardDescription>Aylık öğün kayıt trendi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
              <div className="text-center text-muted-foreground">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                  <BarChart3 className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-sm font-medium">Öğün Kayıt Grafiği</p>
                <p className="mt-0.5 text-xs">Ort. günlük 593 kayıt</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary Table */}
      <Card className="py-0 gap-0 overflow-hidden mb-6 animate-fade-up">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-base">Aylık Özet</CardTitle>
          <CardDescription>Son 6 aylık platform istatistikleri</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Ay</TableHead>
              <TableHead className="text-center">Kullanıcı</TableHead>
              <TableHead className="text-center">Öğün Kaydı</TableHead>
              <TableHead className="text-center">Randevu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthlyStats.map((stat, index) => (
              <TableRow key={stat.month}>
                <TableCell>
                  <span className={cn('text-sm font-medium', index === monthlyStats.length - 1 && 'text-primary')}>
                    {stat.month}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm tabular-nums">{stat.users.toLocaleString('tr-TR')}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm tabular-nums">{stat.meals.toLocaleString('tr-TR')}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm tabular-nums">{stat.appointments}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Report Generation */}
      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle className="text-base">Özel Rapor Oluştur</CardTitle>
          <CardDescription>Belirli tarih aralığı ve rapor tipi seçerek özel rapor oluşturun.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Rapor Tipi</Label>
              <Select defaultValue="usage">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="usage">Kullanım Raporu</SelectItem>
                  <SelectItem value="growth">Büyüme Raporu</SelectItem>
                  <SelectItem value="engagement">Etkileşim Raporu</SelectItem>
                  <SelectItem value="performance">Performans Raporu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Başlangıç Tarihi</Label>
              <Input type="date" defaultValue="2026-01-01" />
            </div>
            <div className="space-y-2">
              <Label>Bitiş Tarihi</Label>
              <Input type="date" defaultValue="2026-02-25" />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Activity className="h-4 w-4" />
                Rapor Oluştur
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
