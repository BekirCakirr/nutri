import { useState, useEffect, useRef, useMemo } from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { avatarFor } from '@/lib/avatar'
import { useMessages } from '@/hooks/use-messages'
import { useAuthStore } from '@/stores/auth-store'
import { ChatSkeleton } from '@/components/shared/page-skeletons'
import { EmptyState } from '@/components/shared/empty-state'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Conversation {
  id: string
  patientName: string
  patientEmail?: string
  avatarUrl: string
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
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function pravatarFor(seed: string): string {
  return avatarFor(seed)
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
  return <CheckCheck className="size-3.5 text-blue-500" />
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
    <div className={cn('flex', message.isOwn ? 'justify-end' : 'justify-start')}>
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
/*  Mock fallback (used only when API returns no conversations)        */
/* ------------------------------------------------------------------ */

const mockConversations: Conversation[] = [
  { id: 'conv-1', patientName: 'Ayşe Yılmaz', patientEmail: 'ayse.yilmaz@email.com', avatarUrl: pravatarFor('ayse.yilmaz@email.com'), lastMessage: 'Teşekkür ederim, planı inceleyeceğim!', lastMessageTime: '14:32', unreadCount: 0, isOnline: true },
  { id: 'conv-2', patientName: 'Mehmet Kaya', patientEmail: 'mehmet.kaya@email.com', avatarUrl: pravatarFor('mehmet.kaya@email.com'), lastMessage: 'Bugün 2 litre su içtim', lastMessageTime: '13:15', unreadCount: 2, isOnline: true },
  { id: 'conv-3', patientName: 'Fatma Demir', patientEmail: 'fatma.demir@email.com', avatarUrl: pravatarFor('fatma.demir@email.com'), lastMessage: 'Akşam yemeğinde ne önerirsiniz?', lastMessageTime: '11:40', unreadCount: 1, isOnline: false },
  { id: 'conv-4', patientName: 'Zeynep Çelik', patientEmail: 'zeynep.celik@email.com', avatarUrl: pravatarFor('zeynep.celik@email.com'), lastMessage: 'Randevu için uygun musunuz?', lastMessageTime: 'Dün', unreadCount: 0, isOnline: false },
]

const mockMessagesByConv: Record<string, Message[]> = {
  'conv-1': [
    { id: 'm1', text: 'Merhaba Elif Hanım, bu haftaki beslenme planımı gönderdim.', time: '09:15', date: '14.04.2026', isOwn: false, status: 'read' },
    { id: 'm2', text: 'Merhaba Ayşe Hanım! Planınızı inceledim, protein alımınız hedefin altında kalmış. Öğle yemeğine ızgara tavuk eklemenizi öneriyorum.', time: '09:45', date: '14.04.2026', isOwn: true, status: 'read' },
    { id: 'm3', text: 'Anladım, tavuk yerine balık olabilir mi? Balığı daha çok seviyorum.', time: '10:02', date: '14.04.2026', isOwn: false, status: 'read' },
    { id: 'm4', text: 'Tabii ki! Somon veya levrek çok iyi alternatifler. Hatta omega-3 açısından daha da faydalı.', time: '10:15', date: '14.04.2026', isOwn: true, status: 'read' },
  ],
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function MessagesPage() {
  const { conversationId: routeConvId } = useParams()
  const currentUser = useAuthStore((s) => s.user)
  const {
    conversations: hookConversations,
    activeMessages: hookMessages,
    fetchConversations,
    openConversation,
    sendMessage: hookSend,
    isLoading,
  } = useMessages()

  const [selectedConversation, setSelectedConversation] = useState<string>(routeConvId || '')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const [search, setSearch] = useState('')
  const [newMessage, setNewMessage] = useState('')
  // Optimistic local-only messages keyed by conversation id
  const [optimisticByConv, setOptimisticByConv] = useState<Record<string, Message[]>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  // Map API conversations (snake_case → camelCase via axios interceptor)
  const apiConversations: Conversation[] = useMemo(() => {
    return (Array.isArray(hookConversations) ? hookConversations : []).map((c: any) => {
      const firstName = c.otherUserFirstName ?? c.participantFirstName ?? ''
      const lastName = c.otherUserLastName ?? c.participantLastName ?? ''
      const fullName = `${firstName} ${lastName}`.trim() || c.participantName || 'Hasta'
      const email = c.otherUserEmail ?? c.participantEmail ?? fullName
      const avatarUrl = c.otherUserAvatar || c.participantAvatar || pravatarFor(email)
      const ts = c.lastMessageAt || c.updatedAt
      const lastMessageTime = ts
        ? new Date(ts).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        : ''
      return {
        id: c.id,
        patientName: fullName,
        patientEmail: email,
        avatarUrl,
        lastMessage: c.lastMessageContent ?? c.lastMessage ?? '',
        lastMessageTime,
        unreadCount: c.unreadCount ?? 0,
        isOnline: c.isOnline ?? false,
      }
    })
  }, [hookConversations])

  const conversations: Conversation[] =
    apiConversations.length > 0 ? apiConversations : mockConversations

  // Auto-select first conversation when list arrives and nothing selected (or invalid)
  useEffect(() => {
    if (!conversations.length) return
    const exists = conversations.some((c) => c.id === selectedConversation)
    if (!exists) {
      const first = conversations[0]
      setSelectedConversation(first.id)
      if (UUID_RE.test(first.id)) {
        openConversation(first.id)
      }
    }
  }, [conversations.length])

  // Map API messages — detect own via senderId === current user id
  const apiMessages: Message[] = useMemo(() => {
    const myId = currentUser?.id
    return (Array.isArray(hookMessages) ? hookMessages : []).map((m: any) => {
      const created = m.createdAt
      const isOwn = !!myId && (m.senderId === myId)
      return {
        id: m.id,
        text: m.content ?? m.text ?? '',
        time: created
          ? new Date(created).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          : '',
        date: created
          ? new Date(created).toLocaleDateString('tr-TR')
          : 'Bugün',
        isOwn,
        status: (m.readAt ? 'read' : 'delivered') as Message['status'],
      }
    })
  }, [hookMessages, currentUser?.id])

  const filteredConversations = conversations.filter((c) =>
    c.patientName.toLowerCase().includes(search.toLowerCase())
  )

  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  // Determine messages to show: API messages reversed (server returns desc) + optimistic, fallback to mock
  const baseMessages: Message[] = useMemo(() => {
    if (UUID_RE.test(selectedConversation) && apiMessages.length > 0) {
      // API returns newest first → reverse for chronological display
      return [...apiMessages].reverse()
    }
    return mockMessagesByConv[selectedConversation] ?? []
  }, [selectedConversation, apiMessages])

  const optimisticMessages = optimisticByConv[selectedConversation] ?? []
  const currentMessages = [...baseMessages, ...optimisticMessages]
  const groupedMessages = groupMessagesByDate(currentMessages)

  // Scroll to bottom on conversation/message change
  useEffect(() => {
    const t = setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    return () => clearTimeout(t)
  }, [selectedConversation, currentMessages.length])

  const handleSend = async () => {
    const text = newMessage.trim()
    if (!text) return

    const tempId = 'local-' + Date.now()
    const optimistic: Message = {
      id: tempId,
      text,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('tr-TR'),
      isOwn: true,
      status: 'sent',
    }
    setOptimisticByConv((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] ?? []), optimistic],
    }))
    setNewMessage('')

    // Only POST when we have a real UUID conversation (mock IDs would 422)
    if (UUID_RE.test(selectedConversation)) {
      try {
        await hookSend(selectedConversation, text)
        // Mark optimistic as delivered
        setOptimisticByConv((prev) => ({
          ...prev,
          [selectedConversation]: (prev[selectedConversation] ?? []).map((m) =>
            m.id === tempId ? { ...m, status: 'delivered' } : m
          ),
        }))
      } catch {
        // leave as 'sent' status
      }
    }
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id)
    if (UUID_RE.test(id)) {
      openConversation(id)
    }
    setMobileView('chat')
  }

  if (isLoading && conversations.length === 0) return <ChatSkeleton />

  return (
    <div style={{ height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }}>
      <Card className="flex flex-1 overflow-hidden p-0" style={{ minHeight: 0 }}>
        {/* ---- Left: Conversation List ---- */}
        <div
          className={cn(
            'w-80 lg:w-96 shrink-0 border-r flex flex-col',
            mobileView === 'list' ? 'flex' : 'hidden md:flex'
          )}
          style={{ minHeight: 0 }}
        >
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
                    selectedConversation === conv.id && 'bg-muted/80 hover:bg-muted/80'
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="size-10">
                      <AvatarImage src={conv.avatarUrl} alt={conv.patientName} />
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
                      <p
                        className={cn(
                          'text-sm truncate',
                          conv.unreadCount > 0 ? 'font-semibold' : 'font-medium'
                        )}
                      >
                        {conv.patientName}
                      </p>
                      <span
                        className={cn(
                          'text-[11px] shrink-0',
                          conv.unreadCount > 0
                            ? 'text-primary font-semibold'
                            : 'text-muted-foreground'
                        )}
                      >
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
                <EmptyState
                  icon={MessageSquare}
                  title="Henüz mesaj yok"
                  description="Hastalarınızla mesajlaşma burada görünecek."
                />
              )}
            </div>
          </div>
        </div>

        {/* ---- Right: Chat Area ---- */}
        <div
          className={cn(
            'flex-1 flex flex-col',
            mobileView === 'chat' ? 'flex' : 'hidden md:flex'
          )}
          style={{ minHeight: 0 }}
        >
          {currentConversation ? (
            <>
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden shrink-0"
                  onClick={() => setMobileView('list')}
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={currentConversation.avatarUrl}
                        alt={currentConversation.patientName}
                      />
                      <AvatarFallback
                        className={cn(
                          'text-xs font-semibold',
                          getInitialColor(currentConversation.patientName)
                        )}
                      >
                        {getInitials(currentConversation.patientName)}
                      </AvatarFallback>
                    </Avatar>
                    {currentConversation.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {currentConversation.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentConversation.isOnline ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Çevrimiçi</span>
                      ) : (
                        'Çevrimdışı'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Video className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              </div>

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

              <div className="border-t px-4 py-3 shrink-0 bg-background">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
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
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="shrink-0"
                  >
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
