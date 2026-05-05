import { useState, useEffect } from 'react'
import {
  Bell,
  Check,
  CheckCheck,
  MessageSquare,
  CalendarDays,
  UtensilsCrossed,
  AlertTriangle,
  Settings,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageContainer } from '@/components/shared/page-container'
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'
import { getNotifications, markAsRead, markAllRead as markAllAsRead } from '@/services/notification.service'

const typeConfig: Record<string, { icon: any; color: string }> = {
  meal: {
    icon: UtensilsCrossed,
    color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
  },
  appointment: {
    icon: CalendarDays,
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  },
  message: {
    icon: MessageSquare,
    color: 'text-violet-600 bg-violet-100 dark:text-violet-400 dark:bg-violet-900/30',
  },
  alert: {
    icon: AlertTriangle,
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
  },
  system: {
    icon: Settings,
    color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800/50',
  },
} as const

interface NotificationItem {
  id: string
  type: 'meal' | 'appointment' | 'message' | 'alert' | 'system' | string
  title: string
  message: string
  time: string
  read: boolean
}

const mockNotifications: NotificationItem[] = [
  { id: 'mock-n1', type: 'meal', title: 'Öğün Kaydı', message: 'Ayşe Yılmaz kahvaltı öğününü kaydetti. İncelemenizi bekliyor.', time: '5 dk önce', read: false },
  { id: 'mock-n2', type: 'appointment', title: 'Randevu Hatırlatması', message: 'Mehmet Kaya ile yarın saat 10:00\'da randevunuz var.', time: '15 dk önce', read: false },
  { id: 'mock-n3', type: 'message', title: 'Yeni Mesaj', message: 'Fatma Demir: "Akşam yemeği için alternatif tarif var mı?"', time: '30 dk önce', read: false },
  { id: 'mock-n4', type: 'alert', title: 'Kalori Uyarısı', message: 'Zeynep Çelik günlük kalori hedefini %120 aştı.', time: '1 saat önce', read: false },
  { id: 'mock-n5', type: 'system', title: 'Sistem Güncellemesi', message: 'Yeni tarif modülü eklendi. Tarifler bölümünü keşfedin.', time: '2 saat önce', read: true },
  { id: 'mock-n6', type: 'meal', title: 'Öğün Kaydı', message: 'Ali Öztürk öğle yemeği öğününü kaydetti. AI skoru: 82/100.', time: '3 saat önce', read: true },
  { id: 'mock-n7', type: 'appointment', title: 'Randevu İptali', message: 'Selin Aydın 18 Nisan tarihli randevusunu iptal etti.', time: '4 saat önce', read: false },
  { id: 'mock-n8', type: 'message', title: 'Yeni Mesaj', message: 'Ali Öztürk: "Protein tozu önerir misiniz?"', time: '5 saat önce', read: true },
  { id: 'mock-n9', type: 'alert', title: 'Su Tüketimi Düşük', message: 'Mehmet Kaya bugün sadece 2 bardak su içti. Hatırlatma gönderin.', time: '6 saat önce', read: false },
  { id: 'mock-n10', type: 'meal', title: 'Öğün Değerlendirmesi', message: 'Fatma Demir akşam yemeği fotoğrafı yükledi. AI analizi tamamlandı.', time: '8 saat önce', read: true },
  { id: 'mock-n11', type: 'system', title: 'Haftalık Rapor', message: 'Bu hafta 12 öğün incelendi, 3 yeni hasta eklendi. Haftalık raporunuz hazır.', time: '1 gün önce', read: true },
  { id: 'mock-n12', type: 'appointment', title: 'Yeni Randevu', message: 'Elif Arslan 20 Nisan saat 14:00 için randevu oluşturdu.', time: '1 gün önce', read: true },
  { id: 'mock-n13', type: 'alert', title: 'Öğün Atlama', message: 'Zeynep Çelik 2 gündür öğle yemeği kaydetmedi.', time: '2 gün önce', read: true },
]

function mapNotificationType(type: string): string {
  const map: Record<string, string> = {
    meal_review: 'meal', plan_update: 'system', achievement: 'system',
  }
  return map[type] ?? type
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} dk önce`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} saat önce`
  return `${Math.floor(hours / 24)} gün önce`
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getNotifications().then((data: any[]) => {
      const mapped = (Array.isArray(data) ? data : []).map((n: any) => ({
        id: n.id,
        type: mapNotificationType(n.type ?? 'system'),
        title: n.title ?? '',
        message: n.body ?? n.message ?? '',
        time: timeAgo(n.createdAt ?? ''),
        read: n.isRead ?? n.read ?? false,
      }))
      setNotifications(mapped.length > 0 ? mapped : mockNotifications)
      setIsLoading(false)
    }).catch(() => {
      setNotifications(mockNotifications)
      setIsLoading(false)
    })
  }, [])

  const markAllRead = () => {
    markAllAsRead().catch(() => {})
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    markAsRead(id).catch(() => {})
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const filtered = activeTab === 'all'
    ? notifications
    : activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === activeTab)

  const unreadCount = notifications.filter(n => !n.read).length

  if (isLoading) return <ListPageSkeleton />

  return (
    <PageContainer
      title="Bildirimler"
      description={`${unreadCount} okunmamıs bildirim`}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="h-4 w-4" />
          Tumunu Okundu Isaretle
        </Button>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tumu</TabsTrigger>
          <TabsTrigger value="unread">
            Okunmamıs
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1.5 h-5 min-w-5 px-1.5 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="meal">Ogun</TabsTrigger>
          <TabsTrigger value="appointment">Randevu</TabsTrigger>
          <TabsTrigger value="message">Mesaj</TabsTrigger>
          <TabsTrigger value="alert">Uyarı</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card className="py-0 gap-0 overflow-hidden">
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <EmptyState
                  icon={Bell}
                  title="Bildirim yok"
                  description="Bu kategoride bildirim bulunmuyor."
                />
              ) : (
                <div className="divide-y divide-border">
                  {filtered.map((notification, index) => {
                    const config = typeConfig[notification.type] ?? typeConfig.system
                    const Icon = config.icon
                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          'flex items-start gap-4 px-5 py-4 cursor-pointer transition-all duration-[var(--duration-fast)]',
                          'hover:bg-secondary/50',
                          !notification.read && 'bg-primary/[0.03]',
                        )}
                        onClick={() => markRead(notification.id)}
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                            config.color,
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={cn(
                                'text-sm leading-tight',
                                !notification.read ? 'font-semibold' : 'font-medium',
                              )}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground leading-snug">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground/70 tabular-nums">
                            {notification.time}
                          </p>
                        </div>

                        {/* Mark as read */}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => { e.stopPropagation(); markRead(notification.id) }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
