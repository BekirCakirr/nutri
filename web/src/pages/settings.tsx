import { useState } from 'react'
import {
  Save,
  Loader2,
  User,
  Clock,
  Bell,
  Shield,
  Palette,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageContainer } from '@/components/shared/page-container'
import { useAuthStore } from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const user = useAuthStore(s => s.user)
  const { theme, setTheme } = useUiStore()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setIsSaving(false)
  }

  return (
    <PageContainer
      title="Ayarlar"
      description="Hesap ve uygulama ayarlarını yonetin"
      narrow
    >
      <Tabs defaultValue="profile">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-3.5 w-3.5" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="working-hours" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Calısma Saatleri
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            Bildirimler
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Guvenlik
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5">
            <Palette className="h-3.5 w-3.5" />
            Gorunum
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 animate-fade-up">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profil Bilgileri</CardTitle>
              <CardDescription>Kisisel bilgilerinizi guncelleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" defaultValue={user ? `${user.firstName} ${user.lastName}` : 'Dr. Ayse Yılmaz'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" defaultValue={user?.email || 'dr.ayse@nutriai.com'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" defaultValue="+90 532 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Uzmanlık Alanı</Label>
                  <Select defaultValue="klinik">
                    <SelectTrigger id="specialization">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="klinik">Klinik Beslenme</SelectItem>
                      <SelectItem value="sporcu">Sporcu Beslenmesi</SelectItem>
                      <SelectItem value="pediatrik">Pediatrik Beslenme</SelectItem>
                      <SelectItem value="diyabet">Diyabet Beslenmesi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">Hakkımda</Label>
                <Textarea
                  id="about"
                  defaultValue="10 yıllık deneyimli klinik diyetisyen. Kilo yonetimi ve metabolik hastalıklar konusunda uzman."
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working Hours Tab */}
        <TabsContent value="working-hours" className="space-y-4 animate-fade-up">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Calısma Saatleri</CardTitle>
              <CardDescription>Randevu alınabilecek saatleri belirleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Pazartesi', 'Salı', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day, i) => {
                  const isWeekday = i < 5
                  return (
                    <div
                      key={day}
                      className={cn(
                        'flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors',
                        isWeekday ? 'bg-card' : 'bg-secondary/30',
                      )}
                    >
                      <Switch defaultChecked={isWeekday} />
                      <span className="w-28 text-sm font-medium">{day}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          defaultValue="09:00"
                          className="w-28 h-9 tabular-nums"
                          disabled={!isWeekday}
                        />
                        <span className="text-muted-foreground text-sm">-</span>
                        <Input
                          type="time"
                          defaultValue="17:00"
                          className="w-28 h-9 tabular-nums"
                          disabled={!isWeekday}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-end mt-5">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 animate-fade-up">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bildirim Tercihleri</CardTitle>
              <CardDescription>Hangi bildirimleri almak istediginizi secin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {[
                  { label: 'Yeni ogun kaydı', desc: 'Hasta ogun kaydettiginde bildirim al' },
                  { label: 'Randevu hatırlatması', desc: 'Randevulardan 30 dk once hatırlat' },
                  { label: 'Yeni mesaj', desc: 'Hasta mesaj gonderdiginde bildirim al' },
                  { label: 'Kritik uyarılar', desc: 'Hasta saglık uyarıları' },
                  { label: 'Haftalık ozet', desc: 'Her hafta performans ozeti gonder' },
                  { label: 'E-posta bildirimleri', desc: 'Bildirimleri e-posta ile de al' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 animate-fade-up">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sifre Degistir</CardTitle>
              <CardDescription>
                Hesap guvenliginiz icin sifrenizi duzenli olarak degistirin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mevcut Sifre</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Yeni Sifre</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Yeni Sifre (Tekrar)</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Shield className="h-4 w-4" />
                  Sifreyi Degistir
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4 animate-fade-up">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gorunum</CardTitle>
              <CardDescription>Uygulama temasını ozellestirin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border px-4 py-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Karanlık Mod</p>
                  <p className="text-xs text-muted-foreground">Koyu temayı etkinlestir</p>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
