import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ayarlar</h1>
        <p className="text-muted-foreground">Hesap ve uygulama ayarlarını yönetin</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="working-hours">Çalışma Saatleri</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
          <TabsTrigger value="security">Güvenlik</TabsTrigger>
          <TabsTrigger value="appearance">Görünüm</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profil Bilgileri</CardTitle>
              <CardDescription>Kişisel bilgilerinizi güncelleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ad Soyad</Label>
                  <Input defaultValue={user?.name || 'Dr. Ayşe Yılmaz'} />
                </div>
                <div className="space-y-2">
                  <Label>E-posta</Label>
                  <Input defaultValue={user?.email || 'dr.ayse@nutriai.com'} />
                </div>
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input defaultValue="+90 532 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label>Uzmanlık Alanı</Label>
                  <Select defaultValue="klinik">
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Label>Hakkımda</Label>
                <Textarea defaultValue="10 yıllık deneyimli klinik diyetisyen. Kilo yönetimi ve metabolik hastalıklar konusunda uzman." rows={3} />
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Kaydet
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="working-hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Çalışma Saatleri</CardTitle>
              <CardDescription>Randevu alınabilecek saatleri belirleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day, i) => (
                  <div key={day} className="flex items-center gap-4">
                    <Switch defaultChecked={i < 5} />
                    <span className="w-24 text-sm font-medium">{day}</span>
                    <Input type="time" defaultValue="09:00" className="w-32" disabled={i >= 5} />
                    <span className="text-muted-foreground">-</span>
                    <Input type="time" defaultValue="17:00" className="w-32" disabled={i >= 5} />
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Kaydet
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Tercihleri</CardTitle>
              <CardDescription>Hangi bildirimleri almak istediğinizi seçin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Yeni öğün kaydı', desc: 'Hasta öğün kaydettiğinde bildirim al' },
                { label: 'Randevu hatırlatması', desc: 'Randevulardan 30 dk önce hatırlat' },
                { label: 'Yeni mesaj', desc: 'Hasta mesaj gönderdiğinde bildirim al' },
                { label: 'Kritik uyarılar', desc: 'Hasta sağlık uyarıları' },
                { label: 'Haftalık özet', desc: 'Her hafta performans özeti gönder' },
                { label: 'E-posta bildirimleri', desc: 'Bildirimleri e-posta ile de al' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Şifre Değiştir</CardTitle>
              <CardDescription>Hesap güvenliğiniz için şifrenizi düzenli olarak değiştirin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mevcut Şifre</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Yeni Şifre</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Yeni Şifre (Tekrar)</Label>
                <Input type="password" />
              </div>
              <Button onClick={handleSave} disabled={isSaving}>Şifreyi Değiştir</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Görünüm</CardTitle>
              <CardDescription>Uygulama temasını özelleştirin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Karanlık Mod</p>
                  <p className="text-xs text-muted-foreground">Koyu temayı etkinleştir</p>
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
    </div>
  )
}
