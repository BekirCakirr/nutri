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
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const monthlyStats = [
  { month: 'Eylül', users: 856, meals: 12400, appointments: 340, revenue: 45200 },
  { month: 'Ekim', users: 924, meals: 14200, appointments: 380, revenue: 51800 },
  { month: 'Kasım', users: 1012, meals: 15800, appointments: 410, revenue: 58400 },
  { month: 'Aralık', users: 1089, meals: 16500, appointments: 390, revenue: 54600 },
  { month: 'Ocak', users: 1168, meals: 18200, appointments: 420, revenue: 62800 },
  { month: 'Şubat', users: 1247, meals: 17800, appointments: 445, revenue: 64200 },
]

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistem Raporları</h1>
          <p className="text-muted-foreground">Platform analitikleri ve istatistikleri.</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Rapor İndir
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Toplam Kullanıcı</p>
                <p className="text-xl font-bold">1,247</p>
                <p className="text-xs text-green-600">+79 bu ay</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-50">
                <UtensilsCrossed className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Aylık Öğün Kaydı</p>
                <p className="text-xl font-bold">17,800</p>
                <p className="text-xs text-red-600">-2.2% geçen aya göre</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-50">
                <CalendarDays className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Aylık Randevu</p>
                <p className="text-xl font-bold">445</p>
                <p className="text-xs text-green-600">+5.9% geçen aya göre</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-50">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ort. Uyum Skoru</p>
                <p className="text-xl font-bold">%76</p>
                <p className="text-xs text-green-600">+3% geçen aya göre</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Büyümesi</CardTitle>
            <CardDescription>Son 6 aylık kullanıcı artışı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-muted/30 rounded-lg border-2 border-dashed flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Kullanıcı Büyüme Grafiği</p>
                <p className="text-xs">856 &rarr; 1,247 (+45.7%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Öğün Kayıtları</CardTitle>
            <CardDescription>Aylık öğün kayıt trendi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-muted/30 rounded-lg border-2 border-dashed flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Öğün Kayıt Grafiği</p>
                <p className="text-xs">Ort. günlük 593 kayıt</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Table */}
      <Card>
        <CardHeader>
          <CardTitle>Aylık Özet</CardTitle>
          <CardDescription>Son 6 aylık platform istatistikleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Ay</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Kullanıcı</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Öğün Kaydı</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Randevu</th>
                </tr>
              </thead>
              <tbody>
                {monthlyStats.map((stat) => (
                  <tr key={stat.month} className="border-b">
                    <td className="p-3 font-medium">{stat.month}</td>
                    <td className="p-3 text-center">{stat.users.toLocaleString()}</td>
                    <td className="p-3 text-center">{stat.meals.toLocaleString()}</td>
                    <td className="p-3 text-center">{stat.appointments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Özel Rapor Oluştur</CardTitle>
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
                <Activity className="mr-2 h-4 w-4" />
                Rapor Oluştur
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
