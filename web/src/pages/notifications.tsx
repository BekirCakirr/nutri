import { useState } from 'react'
import { Bell, Check, CheckCheck, Filter, MessageSquare, CalendarDays, UtensilsCrossed, AlertTriangle, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const mockNotifications = [
  { id: '1', type: 'meal' as const, title: 'Yeni Öğün Kaydı', message: 'Ayşe Yılmaz öğle yemeği kaydetti', time: '5 dk önce', read: false, icon: UtensilsCrossed },
  { id: '2', type: 'appointment' as const, title: 'Randevu Hatırlatması', message: 'Mehmet Kaya ile 14:00 randevunuz var', time: '30 dk önce', read: false, icon: CalendarDays },
  { id: '3', type: 'message' as const, title: 'Yeni Mesaj', message: 'Fatma Demir size mesaj gönderdi', time: '1 saat önce', read: false, icon: MessageSquare },
  { id: '4', type: 'alert' as const, title: 'Uyarı', message: 'Hasan Yıldız 3 gündür öğün kaydı yapmadı', time: '2 saat önce', read: true, icon: AlertTriangle },
  { id: '5', type: 'system' as const, title: 'Sistem', message: 'Yeni güncelleme mevcut: v2.1.0', time: '1 gün önce', read: true, icon: Settings },
  { id: '6', type: 'meal' as const, title: 'Öğün Onayı Bekliyor', message: 'Zeynep Çelik kahvaltı kaydı onay bekliyor', time: '1 gün önce', read: true, icon: UtensilsCrossed },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState('all')

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const filtered = activeTab === 'all'
    ? notifications
    : activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === activeTab)

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bildirimler</h1>
          <p className="text-muted-foreground">{unreadCount} okunmamış bildirim</p>
        </div>
        <Button variant="outline" onClick={markAllRead} disabled={unreadCount === 0}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Tümünü Okundu İşaretle
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tümü</TabsTrigger>
          <TabsTrigger value="unread">Okunmamış {unreadCount > 0 && <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">{unreadCount}</Badge>}</TabsTrigger>
          <TabsTrigger value="meal">Öğün</TabsTrigger>
          <TabsTrigger value="appointment">Randevu</TabsTrigger>
          <TabsTrigger value="message">Mesaj</TabsTrigger>
          <TabsTrigger value="alert">Uyarı</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Bildirim yok</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filtered.map(notification => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                      onClick={() => markRead(notification.id)}
                    >
                      <div className={`p-2 rounded-full ${!notification.read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <notification.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>{notification.title}</p>
                          {!notification.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); markRead(notification.id) }}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
