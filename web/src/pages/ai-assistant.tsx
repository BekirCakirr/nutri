import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Sparkles,
  Bot,
  User,
  ClipboardList,
  Apple,
  FileText,
  Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChatSkeleton } from '@/components/shared/page-skeletons'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const suggestedPrompts = [
  { icon: ClipboardList, label: 'Diyet planı öner', prompt: 'Kilo vermek isteyen 30 yaşında kadın hasta için haftalık diyet planı öner.' },
  { icon: Apple, label: 'Besin analizi yap', prompt: 'Bugünkü öğün kaydını analiz et ve eksik besinleri belirle.' },
  { icon: FileText, label: 'Hasta raporu özetle', prompt: 'Ayşe Yılmaz hastasının son 1 aylık ilerlemesini özetle.' },
]

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Merhaba! NutriAI asistanınızım. Size diyet planı oluşturma, besin analizi, hasta raporu hazırlama ve beslenme önerileri konularında yardımcı olabilirim. Nasıl yardımcı olabilirim?',
    timestamp: '14:00',
  },
]

const mockAIResponse = `## Haftalık Diyet Planı Önerisi

**Hasta Profili:** 30 yaş, kadın, kilo verme hedefi
**Günlük Kalori Hedefi:** 1600-1800 kcal

### Pazartesi
- **Kahvaltı:** Yulaf ezmesi (200g) + muz + tarçın (350 kcal)
- **Öğle:** Izgara tavuk salata + tam buğday ekmek (480 kcal)
- **Akşam:** Fırında somon + buharda brokoli (420 kcal)
- **Ara Öğün:** Yoğurt + karışık kuruyemiş (200 kcal)

### Makro Dağılımı
- Protein: %30 (120g)
- Karbonhidrat: %40 (160g)
- Yağ: %30 (53g)

### Önemli Notlar
1. Günlük en az 2.5L su tüketimi
2. Öğünler arası 3-4 saat bekleme
3. Akşam yemeği saat 19:00'dan önce
4. Haftalık 3-4 gün egzersiz

*Bu plan genel bir öneridir. Hastanın alerjileri ve tıbbi durumuna göre düzenlenmelidir.*`

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPageLoading, setIsPageLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setIsPageLoading(false), 400); return () => clearTimeout(t) }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  if (isPageLoading) return <ChatSkeleton />

  const handleSend = (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: String(messages.length + 1),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: String(messages.length + 2),
        role: 'assistant',
        content: mockAIResponse,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="mx-auto max-w-4xl h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI Asistan</h1>
          <p className="text-xs text-muted-foreground">Yapay zeka destekli beslenme asistanınız</p>
        </div>
      </div>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col overflow-hidden py-0 gap-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-fade-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mt-1 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary rounded-bl-md'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  <p
                    className={`text-[10px] mt-1.5 ${
                      msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <Avatar className="h-8 w-8 mt-1 shrink-0">
                    <AvatarFallback className="bg-secondary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 mt-1 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3 border-t">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-2 mt-3">
              Öneriler
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend(prompt.prompt)}
                  className="text-xs h-8"
                >
                  <prompt.icon className="h-3 w-3" />
                  {prompt.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <Input
              placeholder="Mesajınızı yazın..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
