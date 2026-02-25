import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface Conversation {
  id: string
  patientName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
}

interface Message {
  id: string
  text: string
  time: string
  isOwn: boolean
  status: 'sent' | 'delivered' | 'read'
}

const mockConversations: Conversation[] = [
  { id: '1', patientName: 'Ayşe Yılmaz', lastMessage: 'Teşekkürler, yarınki randevuda görüşürüz!', lastMessageTime: '14:50', unreadCount: 0, isOnline: true },
  { id: '2', patientName: 'Mehmet Kaya', lastMessage: 'Bugün çok fazla yedim galiba...', lastMessageTime: '13:20', unreadCount: 2, isOnline: true },
  { id: '3', patientName: 'Fatma Demir', lastMessage: 'Antrenman sonrası ne yesem iyi olur?', lastMessageTime: '11:45', unreadCount: 1, isOnline: false },
  { id: '4', patientName: 'Zeynep Çelik', lastMessage: 'Planımdaki değişikliği gördüm, teşekkürler.', lastMessageTime: 'Dün', unreadCount: 0, isOnline: false },
]

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Merhaba, bugünkü öğle yemeğim hakkında bir sorum var.', time: '14:20', isOwn: false, status: 'read' },
    { id: '2', text: 'Tavuk salata yedim ama porsiyon biraz fazla olmuş olabilir.', time: '14:21', isOwn: false, status: 'read' },
    { id: '3', text: 'Merhaba Ayşe, tavuk salata güzel bir tercih. Porsiyon ne kadardı?', time: '14:30', isOwn: true, status: 'read' },
    { id: '4', text: 'Yaklaşık 300g tavuk ve bol yeşillik.', time: '14:32', isOwn: false, status: 'read' },
    { id: '5', text: 'Protein miktarı yeterli ama tavuğu 200g ile sınırlayabilirsiniz. Geri kalan kaloriyi akşam yemeğinden düşeriz.', time: '14:40', isOwn: true, status: 'read' },
    { id: '6', text: 'Anladım, çok teşekkür ederim!', time: '14:45', isOwn: false, status: 'read' },
    { id: '7', text: 'Rica ederim. Yarınki randevuda detaylı konuşuruz.', time: '14:48', isOwn: true, status: 'read' },
    { id: '8', text: 'Teşekkürler, yarınki randevuda görüşürüz!', time: '14:50', isOwn: false, status: 'read' },
  ],
  '2': [
    { id: '1', text: 'Hocam bugün işte stresli bir gün geçirdim.', time: '12:50', isOwn: false, status: 'read' },
    { id: '2', text: 'Öğle yemeğinde fazla yedim.', time: '12:51', isOwn: false, status: 'delivered' },
    { id: '3', text: 'Bugün çok fazla yedim galiba...', time: '13:20', isOwn: false, status: 'delivered' },
  ],
  '3': [
    { id: '1', text: 'Merhaba, bugün sabah antrenmanım vardı.', time: '11:30', isOwn: false, status: 'read' },
    { id: '2', text: 'Antrenman sonrası ne yesem iyi olur?', time: '11:45', isOwn: false, status: 'delivered' },
  ],
}

export default function MessagesPage() {
  const { conversationId } = useParams()
  const [selectedConversation, setSelectedConversation] = useState(conversationId || '1')
  const [search, setSearch] = useState('')
  const [newMessage, setNewMessage] = useState('')

  const filteredConversations = mockConversations.filter((c) =>
    c.patientName.toLowerCase().includes(search.toLowerCase())
  )

  const currentConversation = mockConversations.find(c => c.id === selectedConversation)
  const currentMessages = mockMessages[selectedConversation] || []

  const handleSend = () => {
    if (!newMessage.trim()) return
    setNewMessage('')
  }

  return (
    <div className="h-[calc(100vh-120px)]">
      <div className="flex h-full rounded-lg border overflow-hidden">
        {/* Left: Conversation List */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold mb-3">Mesajlar</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hasta ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 ${selectedConversation === conv.id ? 'bg-muted' : ''}`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs">
                      {conv.patientName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conv.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">{conv.patientName}</p>
                    <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                    {conv.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Right: Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {currentConversation.patientName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{currentConversation.patientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentConversation.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {currentMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${msg.isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Mesaj yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Bir konuşma seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
