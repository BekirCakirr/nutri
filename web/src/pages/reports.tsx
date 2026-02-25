import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Download,
  Calendar,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function ReportsPage() {
  const navigate = useNavigate()
  const [reportType, setReportType] = useState('weekly')
  const [selectedPatient, setSelectedPatient] = useState('all')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Raporlar</h1>
        <p className="text-muted-foreground">Hasta ilerlemesi ve beslenme raporlarını oluşturun.</p>
      </div>

      {/* Report Config */}
      <Card>
        <CardHeader>
          <CardTitle>Rapor Ayarları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Rapor Tipi</Label>
              <Tabs value={reportType} onValueChange={setReportType}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="weekly">Haftalık</TabsTrigger>
                  <TabsTrigger value="monthly">Aylık</TabsTrigger>
                  <TabsTrigger value="custom">Özel</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label>Başlangıç Tarihi</Label>
              <Input type="date" defaultValue="2026-02-18" />
            </div>
            <div className="space-y-2">
              <Label>Bitiş Tarihi</Label>
              <Input type="date" defaultValue="2026-02-25" />
            </div>
            <div className="space-y-2">
              <Label>Hasta</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Hasta seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Hastalar</SelectItem>
                  <SelectItem value="1">Ayşe Yılmaz</SelectItem>
                  <SelectItem value="2">Mehmet Kaya</SelectItem>
                  <SelectItem value="3">Fatma Demir</SelectItem>
                  <SelectItem value="5">Zeynep Çelik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Aktif Hasta</p>
                <p className="text-xl font-bold">42</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-50">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ort. Uyum</p>
                <p className="text-xl font-bold">%78</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-50">
                <BarChart3 className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Toplam Öğün</p>
                <p className="text-xl font-bold">856</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-50">
                <PieChart className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Randevu</p>
                <p className="text-xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rapor Önizleme</CardTitle>
              <CardDescription>18 Şubat - 25 Şubat 2026</CardDescription>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              PDF Olarak İndir
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chart Placeholder */}
          <div className="h-48 bg-muted/30 rounded-lg border-2 border-dashed flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-10 w-10 mx-auto mb-2" />
              <p className="text-sm">Haftalık Kalori Takip Grafiği</p>
            </div>
          </div>

          <Separator />

          {/* Patient Summary Table */}
          <div>
            <h3 className="font-semibold mb-3">Hasta Özeti</h3>
            <div className="space-y-3">
              {[
                { name: 'Ayşe Yılmaz', adherence: 87, avgCalories: 1720, meals: 28, weight: '-0.5 kg' },
                { name: 'Mehmet Kaya', adherence: 72, avgCalories: 1580, meals: 24, weight: '-0.3 kg' },
                { name: 'Fatma Demir', adherence: 95, avgCalories: 2150, meals: 30, weight: '+0.2 kg' },
                { name: 'Zeynep Çelik', adherence: 81, avgCalories: 1650, meals: 26, weight: '-0.4 kg' },
              ].map((patient, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
                  <span className="font-medium flex-1">{patient.name}</span>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Uyum</p>
                    <p className="text-sm font-medium">%{patient.adherence}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Ort. Kalori</p>
                    <p className="text-sm font-medium">{patient.avgCalories}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Öğün</p>
                    <p className="text-sm font-medium">{patient.meals}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Kilo</p>
                    <p className={`text-sm font-medium ${patient.weight.startsWith('-') ? 'text-green-600' : 'text-orange-600'}`}>
                      {patient.weight}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/reports/patient/${i + 1}`)}>
                    Detay
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
