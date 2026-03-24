import { useState, useEffect } from 'react'
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
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const mockConversations: Conversation[] = [
  { id: '1', patientName: 'Ayse Yilmaz', lastMessage: 'Tesekkurler, yarinki randevuda gorusuruz!', lastMessageTime: '14:50', unreadCount: 0, isOnline: true, isTyping: false },
  { id: '2', patientName: 'Mehmet Kaya', lastMessage: 'Bugun cok fazla yedim galiba...', lastMessageTime: '13:20', unreadCount: 2, isOnline: true, isTyping: true },
  { id: '3', patientName: 'Fatma Demir', lastMessage: 'Antrenman sonrasi ne yesem iyi olur?', lastMessageTime: '11:45', unreadCount: 1, isOnline: false },
  { id: '4', patientName: 'Zeynep Celik', lastMessage: 'Planimdaki degisikligi gordum, tesekkurler.', lastMessageTime: 'Dun', unreadCount: 0, isOnline: false },
]

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Merhaba, bugunku ogle yemegim hakkinda bir sorum var.', time: '14:20', date: 'Bugun', isOwn: false, status: 'read' },
    { id: '2', text: 'Tavuk salata yedim ama porsiyon biraz fazla olmus olabilir.', time: '14:21', date: 'Bugun', isOwn: false, status: 'read' },
    { id: '3', text: 'Merhaba Ayse, tavuk salata guzel bir tercih. Porsiyon ne kadardi?', time: '14:30', date: 'Bugun', isOwn: true, status: 'read' },
    { id: '4', text: 'Yaklasik 300g tavuk ve bol yesillik.', time: '14:32', date: 'Bugun', isOwn: false, status: 'read' },
    { id: '5', text: 'Protein miktari yeterli ama tavugu 200g ile sinirlandirebilirsiniz. Geri kalan kaloriyi aksam yemeginden duseriz.', time: '14:40', date: 'Bugun', isOwn: true, status: 'read' },
    { id: '6', text: 'Anladim, cok tesekkur ederim!', time: '14:45', date: 'Bugun', isOwn: false, status: 'read' },
    { id: '7', text: 'Rica ederim. Yarinki randevuda detayli konusuruz.', time: '14:48', date: 'Bugun', isOwn: true, status: 'delivered' },
    { id: '8', text: 'Tesekkurler, yarinki randevuda gorusuruz!', time: '14:50', date: 'Bugun', isOwn: false, status: 'read' },
  ],
  '2': [
    { id: '1', text: 'Hocam dun aksam hafif bir salata yedim, cok iyi hissettim.', time: '18:20', date: 'Dun', isOwn: false, status: 'read' },
    { id: '2', text: 'Harika, aynen devam!', time: '18:45', date: 'Dun', isOwn: true, status: 'read' },
    { id: '3', text: 'Hocam bugun iste stresli bir gun gecirdim.', time: '12:50', date: 'Bugun', isOwn: false, status: 'read' },
    { id: '4', text: 'Ogle yemeginde fazla yedim.', time: '12:51', date: 'Bugun', isOwn: false, status: 'delivered' },
    { id: '5', text: 'Bugun cok fazla yedim galiba...', time: '13:20', date: 'Bugun', isOwn: false, status: 'delivered' },
  ],
  '3': [
    { id: '1', text: 'Merhaba, bugun sabah antremanim vardi.', time: '11:30', date: 'Bugun', isOwn: false, status: 'read' },
    { id: '2', text: 'Antrenman sonrasi ne yesem iyi olur?', time: '11:45', date: 'Bugun', isOwn: false, status: 'delivered' },
  ],
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

export default function MessagesPage() {
  const { conversationId } = useParams()
  const [selectedConversation, setSelectedConversation] = useState(conversationId || '1')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const [search, setSearch] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 400); return () => clearTimeout(t) }, [])

  const filteredConversations = mockConversations.filter((c) =>
    c.patientName.toLowerCase().includes(search.toLowerCase())
  )

  const currentConversation = mockConversations.find((c) => c.id === selectedConversation)
  const currentMessages = mockMessages[selectedConversation] || []
  const groupedMessages = groupMessagesByDate(currentMessages)

  const handleSend = () => {
    if (!newMessage.trim()) return
    setNewMessage('')
  }

  if (isLoading) return <ChatSkeleton />

  return (
    <div className="h-[calc(100vh-120px)]">
      <Card className="flex h-full overflow-hidden p-0">
        {/* ---- Left: Conversation List ---- */}
        <div className={cn(
          'w-80 lg:w-96 shrink-0 border-r flex flex-col',
          mobileView === 'list' ? 'flex' : 'hidden md:flex'
        )}>
          {/* Search header */}
          <div className="px-4 pt-5 pb-3 space-y-3">
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

          <Separator />

          {/* Conversation items */}
          <ScrollArea className="flex-1">
            <div className="py-1">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => { setSelectedConversation(conv.id); setMobileView('chat') }}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left',
                    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quart)]',
                    'hover:bg-muted/50 focus-visible:outline-none focus-visible:bg-muted/50',
                    selectedConversation === conv.id &&
                      'bg-muted/80 hover:bg-muted/80'
                  )}
                >
                  {/* Avatar with online dot */}
                  <div className="relative shrink-0">
                    <Avatar className="size-10">
                      <AvatarFallback
                        className={cn('text-xs font-semibold', getInitialColor(conv.patientName))}
                      >
                        {getInitials(conv.patientName)}
                      </AvatarFallback>
                    </Avatar>
                    {conv.isOnline && (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-background"
                        aria-label="Cevrimici"
                      />
                    )}
                  </div>

                  {/* Name + last message */}
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
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.isTyping ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium italic">
                            yaziyor...
                          </span>
                        ) : (
                          conv.lastMessage
                        )}
                      </p>
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
          </ScrollArea>
        </div>

        {/* ---- Right: Chat Area ---- */}
        <div className={cn(
          'flex-1 flex flex-col min-w-0',
          mobileView === 'chat' ? 'flex' : 'hidden md:flex'
        )}>
          {currentConversation ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b">
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
                        <span className="text-emerald-600 dark:text-emerald-400">Cevrimici</span>
                      ) : (
                        'Cevrimdisi'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Phone className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Video className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Messages area */}
              <ScrollArea className="flex-1">
                <div className="px-5 py-2 space-y-1">
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

                  {/* Typing indicator for the current conversation */}
                  {currentConversation.isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-md">
                        <TypingIndicator />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Message input */}
              <div className="border-t px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="size-4" />
                  </Button>
                  <Input
                    placeholder="Mesaj yazin..."
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
              <p className="text-sm">Bir konusma secin</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
