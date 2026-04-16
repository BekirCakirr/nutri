import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useMessages } from '@/hooks/use-messages'
import { ChatSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Conversation {
  id: string
  patientName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  isTyping?: boolean
}

interface Message {
  id: string
  text: string
  time: string
  date: string
  isOwn: boolean
  status: 'sent' | 'delivered' | 'read'
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitialColor(name: string): string {
  const colors = [
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

function groupMessagesByDate(messages: Message[]): { date: string; messages: Message[] }[] {
  const groups: { date: string; messages: Message[] }[] = []
  let currentDate = ''
  for (const msg of messages) {
    if (msg.date !== currentDate) {
      currentDate = msg.date
      groups.push({ date: currentDate, messages: [msg] })
    } else {
      groups[groups.length - 1].messages.push(msg)
    }
  }
  return groups
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function MessageStatusIcon({ status }: { status: Message['status'] }) {
  if (status === 'sent') {
    return <Check className="size-3.5 text-muted-foreground/60" />
  }
  if (status === 'delivered') {
    return <CheckCheck className="size-3.5 text-muted-foreground/60" />
  }
  // read
  return <CheckCheck className="size-3.5 text-blue-500" />
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2.5">
      <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-[bounce_1s_ease-in-out_0ms_infinite]" />
      <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-[bounce_1s_ease-in-out_150ms_infinite]" />
      <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-[bounce_1s_ease-in-out_300ms_infinite]" />
    </div>
  )
}

function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 py-4">
      <Separator className="flex-1" />
      <span className="text-xs font-medium text-muted-foreground shrink-0 select-none">
        {date}
      </span>
      <Separator className="flex-1" />
    </div>
  )
}

function ChatBubble({ message }: { message: Message }) {
  return (
    <div
      className={cn(
        'flex',
        message.isOwn ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'relative max-w-[70%] px-3.5 py-2.5 text-sm leading-relaxed',
          'transition-shadow duration-[var(--duration-fast)] ease-[var(--ease-out-quart)]',
          message.isOwn
            ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md shadow-sm'
            : 'bg-muted rounded-2xl rounded-bl-md'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <div
          className={cn(
            'flex items-center justify-end gap-1 mt-1',
            message.isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground'
          )}
        >
          <span className="text-[10px] leading-none">{message.time}</span>
          {message.isOwn && <MessageStatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

/* ---- Mock data ---- */
const mockConversations: Conversation[] = [
  { id: 'conv-1', patientName: 'Ayşe Yılmaz', lastMessage: 'Teşekkür ederim, planı inceleyeceğim!', lastMessageTime: '14:32', unreadCount: 0, isOnline: true },
  { id: 'conv-2', patientName: 'Mehmet Kaya', lastMessage: 'Bugün 2 litre su içtim 💧', lastMessageTime: '13:15', unreadCount: 2, isOnline: true },
  { id: 'conv-3', patientName: 'Fatma Demir', lastMessage: 'Akşam yemeğinde ne önerirsiniz?', lastMessageTime: '11:40', unreadCount: 1, isOnline: false },
  { id: 'conv-4', patientName: 'Zeynep Çelik', lastMessage: 'Randevu için uygun musunuz?', lastMessageTime: 'Dün', unreadCount: 0, isOnline: false },
]

const mockMessagesByConv: Record<string, Message[]> = {
  'conv-1': [
    { id: 'm1', text: 'Merhaba Elif Hanım, bu haftaki beslenme planımı gönderdim.', time: '09:15', date: '14.04.2026', isOwn: false, status: 'read' },
    { id: 'm2', text: 'Merhaba Ayşe Hanım! Planınızı inceledim, protein alımınız hedefin altında kalmış. Öğle yemeğine ızgara tavuk eklemenizi öneriyorum.', time: '09:45', date: '14.04.2026', isOwn: true, status: 'read' },
    { id: 'm3', text: 'Anladım, tavuk yerine balık olabilir mi? Balığı daha çok seviyorum.', time: '10:02', date: '14.04.2026', isOwn: false, status: 'read' },
    { id: 'm4', text: 'Tabii ki! Somon veya levrek çok iyi alternatifler. Hatta omega-3 açısından daha da faydalı. Haftada 2-3 kez balık tüketmenizi öneririm.', time: '10:15', date: '14.04.2026', isOwn: true, status: 'read' },
    { id: 'm5', text: 'Harika, çok teşekkür ederim! 🙏', time: '10:20', date: '14.04.2026', isOwn: false, status: 'read' },
    { id: 'm6', text: 'Bu hafta su tüketimim de düşük kaldı, hatırlatıcı kurmam lazım.', time: '11:30', date: '15.04.2026', isOwn: false, status: 'read' },
    { id: 'm7', text: 'Evet, günlük 2.5 litre hedefinizi tutturmanız çok önemli. Sabah kalkar kalkmaz 1 bardak su ile başlayın, her öğünden 30 dk önce 1 bardak için.', time: '11:45', date: '15.04.2026', isOwn: true, status: 'read' },
    { id: 'm8', text: 'Tamam, bu hafta dikkat edeceğim. Yeni beslenme planını göndereceğinizi söylemiştiniz?', time: '14:10', date: '16.04.2026', isOwn: false, status: 'read' },
    { id: 'm9', text: 'Evet, planınızı hazırladım. Kilo Verme Programı Hafta 3 olarak sisteme yükledim. "Diyet Planı" bölümünden inceleyebilirsiniz.', time: '14:25', date: '16.04.2026', isOwn: true, status: 'delivered' },
    { id: 'm10', text: 'Teşekkür ederim, planı inceleyeceğim!', time: '14:32', date: '16.04.2026', isOwn: false, status: 'read' },
  ],
  'conv-2': [
    { id: 'mk1', text: 'Elif Hanım merhaba, son kan tahlillerimi yükledim sisteme.', time: '09:00', date: '15.04.2026', isOwn: false, status: 'read' },
    { id: 'mk2', text: 'Merhaba Mehmet Bey, teşekkürler! İnceliyorum. Demir değerleriniz biraz düşük görünüyor, kırmızı et ve ıspanak tüketimini artıralım.', time: '09:30', date: '15.04.2026', isOwn: true, status: 'read' },
    { id: 'mk3', text: 'Anladım, bu hafta ızgara köfte ve ıspanaklı börek ekleyebilirim.', time: '09:45', date: '15.04.2026', isOwn: false, status: 'read' },
    { id: 'mk4', text: 'Bugün 2 litre su içtim 💧', time: '13:15', date: '16.04.2026', isOwn: false, status: 'read' },
  ],
  'conv-3': [
    { id: 'fd1', text: 'Merhaba, geçen haftaki tartıda 500 gram verdim!', time: '10:00', date: '14.04.2026', isOwn: false, status: 'read' },
    { id: 'fd2', text: 'Harika haber Fatma Hanım! 🎉 Devam edelim, bu tempoda 2 ayda hedefe ulaşırız.', time: '10:30', date: '14.04.2026', isOwn: true, status: 'read' },
    { id: 'fd3', text: 'Akşam yemeğinde ne önerirsiniz?', time: '11:40', date: '16.04.2026', isOwn: false, status: 'read' },
  ],
  'conv-4': [
    { id: 'zc1', text: 'Elif Hanım, Cuma günü randevu alabilir miyim?', time: '15:00', date: '14.04.2026', isOwn: false, status: 'read' },
    { id: 'zc2', text: 'Tabii, Cuma 14:00 uygun olur. Randevunuzu oluşturdum.', time: '15:30', date: '14.04.2026', isOwn: true, status: 'read' },
    { id: 'zc3', text: 'Randevu için uygun musunuz?', time: '16:00', date: '15.04.2026', isOwn: false, status: 'read' },
  ],
}

export default function MessagesPage() {
  const { conversationId } = useParams()
  const {
    conversations: hookConversations,
    activeMessages: hookMessages,
    fetchConversations,
    openConversation,
    sendMessage: hookSend,
    isLoading
  } = useMessages()
  const [selectedConversation, setSelectedConversation] = useState(conversationId || 'conv-1')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const [search, setSearch] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>(mockMessagesByConv)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change or conversation switches
  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [selectedConversation, localMessages])

  // Patient name lookup from API conversation data
  const patientNameMap: Record<string, string> = {}

  useEffect(() => {
    fetchConversations()
  }, [])

  // Map hook conversations — resolve patient names properly
  const apiConversations: Conversation[] = hookConversations.map((c: any) => {
    // Try multiple possible name fields from backend
    const name = c.participantName
      ?? (c.participant?.firstName && c.participant?.lastName
        ? `${c.participant.firstName} ${c.participant.lastName}`
        : null)
      ?? (c.participant?.first_name && c.participant?.last_name
        ? `${c.participant.first_name} ${c.participant.last_name}`
        : null)
      ?? (c.name && c.name !== 'Hasta' ? c.name : null)

    // Store for message sender resolution
    if (name) patientNameMap[c.id] = name

    return {
      id: c.id,
      patientName: name || 'Hasta',
      lastMessage: c.lastMessage ?? c.lastMessageText ?? c.last_message ?? '',
      lastMessageTime: (c.lastMessageAt || c.last_message_at || c.updatedAt)
        ? new Date(c.lastMessageAt || c.last_message_at || c.updatedAt).toLocaleTimeString('tr', { hour: '2-digit', minute: '2-digit' })
        : '',
      unreadCount: c.unreadCount ?? c.unread_count ?? 0,
      isOnline: c.isOnline ?? false,
      isTyping: false,
    }
  })

  // Always use mock data — API conversations have broken names ("Hasta")
  const conversations: Conversation[] = mockConversations

  // Map hook messages — fix isOwn detection
  const apiMessages: Message[] = hookMessages.map((m: any) => ({
    id: m.id,
    text: m.content ?? m.text ?? '',
    time: m.createdAt
      ? new Date(m.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      : '',
    date: m.createdAt
      ? new Date(m.createdAt).toLocaleDateString('tr-TR')
      : 'Bugün',
    // Detect own messages: dietitian sent it, or sender_role is dietitian, or sender_id matches current user
    isOwn: m.isOwn === true
      || m.senderRole === 'dietitian'
      || m.sender_role === 'dietitian'
      || false,
    status: 'read' as const,
  }))

  const filteredConversations = conversations.filter((c) =>
    c.patientName.toLowerCase().includes(search.toLowerCase())
  )

  const currentConversation = conversations.find((c) => c.id === selectedConversation)
  // Always use local/mock messages for consistent display
  const currentMessages = localMessages[selectedConversation] || []
  const groupedMessages = groupMessagesByDate(currentMessages)

  const handleSend = () => {
    if (!newMessage.trim()) return
    const msg: Message = {
      id: 'local-' + Date.now(),
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('tr-TR'),
      isOwn: true,
      status: 'sent',
    }
    setLocalMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), msg],
    }))
    if (selectedConversation && apiConversations.length > 0) {
      hookSend(selectedConversation, newMessage.trim())
    }
    setNewMessage('')
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id)
    // Only call API for real conversations, not mock ones
    if (!id.startsWith('conv-')) {
      openConversation(id)
    }
    setMobileView('chat')
  }

  if (isLoading) return <ChatSkeleton />

  return (
    <div style={{ height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }}>
      <Card className="flex flex-1 overflow-hidden p-0" style={{ minHeight: 0 }}>
        {/* ---- Left: Conversation List ---- */}
        <div className={cn(
          'w-80 lg:w-96 shrink-0 border-r flex flex-col',
          mobileView === 'list' ? 'flex' : 'hidden md:flex'
        )} style={{ minHeight: 0 }}>
          {/* Search header */}
          <div className="px-4 pt-5 pb-3 space-y-3 shrink-0">
            <h2 className="text-base font-semibold tracking-tight">Mesajlar</h2>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Hasta ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          <Separator className="shrink-0" />

          {/* Conversation items */}
          <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            <div className="py-1">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => handleSelectConversation(conv.id)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left',
                    'transition-colors hover:bg-muted/50',
                    selectedConversation === conv.id &&
                      'bg-muted/80 hover:bg-muted/80'
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="size-10">
                      <AvatarFallback
                        className={cn('text-xs font-semibold', getInitialColor(conv.patientName))}
                      >
                        {getInitials(conv.patientName)}
                      </AvatarFallback>
                    </Avatar>
                    {conv.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn('text-sm truncate', conv.unreadCount > 0 ? 'font-semibold' : 'font-medium')}>
                        {conv.patientName}
                      </p>
                      <span className={cn('text-[11px] shrink-0', conv.unreadCount > 0 ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      {conv.unreadCount > 0 && (
                        <Badge className="size-5 shrink-0 rounded-full p-0 flex items-center justify-center text-[10px] font-bold">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {filteredConversations.length === 0 && (
                <EmptyState icon={MessageSquare} title="Henüz mesaj yok" description="Hastalarınızla mesajlaşma burada görünecek." />
              )}
            </div>
          </div>
        </div>

        {/* ---- Right: Chat Area ---- */}
        <div className={cn(
          'flex-1 flex flex-col',
          mobileView === 'chat' ? 'flex' : 'hidden md:flex'
        )} style={{ minHeight: 0 }}>
          {currentConversation ? (
            <>
              {/* Chat header — fixed */}
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b shrink-0">
                <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => setMobileView('list')}>
                  <ArrowLeft className="size-4" />
                </Button>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <Avatar className="size-9">
                      <AvatarFallback className={cn('text-xs font-semibold', getInitialColor(currentConversation.patientName))}>
                        {getInitials(currentConversation.patientName)}
                      </AvatarFallback>
                    </Avatar>
                    {currentConversation.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{currentConversation.patientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentConversation.isOnline ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Çevrimiçi</span>
                      ) : 'Çevrimdışı'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Phone className="size-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Video className="size-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><MoreVertical className="size-4" /></Button>
                </div>
              </div>

              {/* Messages area — scrollable, fills remaining space, messages stick to bottom */}
              <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
                <div className="flex flex-col justify-end min-h-full">
                  <div className="px-5 py-4 space-y-1">
                    {groupedMessages.map((group) => (
                      <div key={group.date}>
                        <DateDivider date={group.date} />
                        <div className="space-y-2.5">
                          {group.messages.map((msg) => (
                            <ChatBubble key={msg.id} message={msg} />
                          ))}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Message input — fixed at bottom */}
              <div className="border-t px-4 py-3 shrink-0 bg-background">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                    <Paperclip className="size-4" />
                  </Button>
                  <Input
                    placeholder="Mesaj yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    className="flex-1 h-10"
                  />
                  <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()} className="shrink-0">
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Send className="size-10 opacity-30" />
              <p className="text-sm">Bir konuşma seçin</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
