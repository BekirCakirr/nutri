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


import { sendMessage as sendAiMessage } from '@/services/ai.service'

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
    timestamp: '09:00',
  },
  {
    id: '2',
    role: 'user',
    content: 'Ayşe Yılmaz hastamın son 1 aylık ilerlemesini özetler misin?',
    timestamp: '09:02',
  },
  {
    id: '3',
    role: 'assistant',
    content: `Ayşe Yılmaz — Son 1 Aylık İlerleme Özeti:

📊 Kilo Takibi:
• Başlangıç: 72.5 kg → Güncel: 70.8 kg (−1.7 kg)
• Hedef: 62.0 kg — Hedefe kalan: 8.8 kg
• Haftalık ortalama kayıp: 0.42 kg (sağlıklı aralıkta)

🍽️ Beslenme Uyumu:
• Plan uyum oranı: %88 (önceki ay: %72)
• Günlük ortalama kalori: 1.820 kcal (hedef: 1.850 kcal) ✅
• Protein hedefi tutturma: %82 (gelişme gerekli)
• Su tüketimi: Günlük ort. 2.1L (hedef: 2.5L) ⚠️

📈 Olumlu Gelişmeler:
• Kahvaltı düzeni oturmuş, her gün kayıt giriyor
• Sebze tüketimi %35 artmış
• Fast-food tüketimi tamamen sıfırlanmış

⚠️ Dikkat Edilmesi Gerekenler:
• Öğle yemeğinde protein kaynağı yetersiz — tavuk/balık artırılmalı
• Su tüketimi hedefin altında — hatırlatıcı önerildi
• Hafta sonları kalori aşımı eğilimi var (ort. +200 kcal)

💡 Öneri: Protein ağırlıklı ara öğün eklemek ve su takip hatırlatıcısı kurmak faydalı olacaktır.`,
    timestamp: '09:03',
  },
  {
    id: '4',
    role: 'user',
    content: 'Mehmet Kaya için düşük demir değerlerine uygun bir beslenme önerisi hazırlar mısın?',
    timestamp: '09:10',
  },
  {
    id: '5',
    role: 'assistant',
    content: `Mehmet Kaya — Demir Eksikliği İçin Beslenme Önerisi:

🩸 Mevcut Durum: Demir değeri düşük (son tahlil)

🥩 Demir Açısından Zengin Besinler (günlük plana eklenecek):
• Kırmızı et (haftada 3x, 150g porsiyon) — en iyi emilim kaynağı
• Ispanak (günlük 200g, pişmiş tercih edilmeli)
• Mercimek / kuru fasulye (haftada 4x)
• Kuru kayısı (günlük 5-6 adet)
• Pekmez (günde 1 yemek kaşığı)

🍊 Emilimi Artıran Kombinasyonlar:
• Et yanında C vitamini kaynağı (limon, portakal, biber)
• Ispanaklı yemeklerde limon sıkmak
• Çay/kahveyi yemekten 1 saat sonra içmek (demir emilimini engeller)

🚫 Kaçınılması Gerekenler:
• Yemekle birlikte çay/kahve
• Aşırı süt ürünü tüketimi (kalsiyum demir emilimini azaltır)
• İşlenmiş gıdalar

📋 Örnek Günlük Plan:
Kahvaltı: Pekmezli yulaf + portakal suyu
Öğle: Izgara köfte + limonlu ıspanak + bulgur
Akşam: Mercimek çorbası + tam buğday ekmek
Ara öğün: Kuru kayısı + C vitamini tableti

2 hafta sonra kan tahlili tekrarı önerilir.`,
    timestamp: '09:12',
  },
  {
    id: '6',
    role: 'user',
    content: 'Fatma Demir hastam akşam yemeğinde ne yemeli? Kilo verme programında.',
    timestamp: '09:25',
  },
  {
    id: '7',
    role: 'assistant',
    content: `Fatma Demir — Akşam Yemeği Önerisi (Kilo Verme):

Hedef: ~500 kcal, yüksek protein, düşük karbonhidrat

🥗 Seçenek 1: Hafif & Doyurucu
• Fırında levrek (180g) — 260 kcal, 36g protein
• Buharda kabak-havuç (200g) — 50 kcal
• Zeytinyağlı roka salatası — 80 kcal
Toplam: ~390 kcal | P: 38g | K: 12g | Y: 16g

🍗 Seçenek 2: Pratik & Lezzetli
• Izgara tavuk göğsü (150g) — 230 kcal, 35g protein
• Kinoa (80g, pişmiş) — 120 kcal
• Mevsim salatası (bol yeşillik) — 60 kcal
Toplam: ~410 kcal | P: 40g | K: 30g | Y: 10g

🥚 Seçenek 3: Çabuk Hazırlanan
• Sebzeli omlet (3 yumurta) — 280 kcal
• Tam buğday ekmeği (1 dilim) — 80 kcal
• Cacık (150ml) — 70 kcal
Toplam: ~430 kcal | P: 28g | K: 22g | Y: 22g

⏰ Not: Akşam yemeğini yatmadan en az 2-3 saat önce yemesi önerilir.`,
    timestamp: '09:26',
  },
]

const mockResponses: Record<string, string> = {
  'Diyet planı öner': `Kilo Vermek İsteyen 30 Yaşında Kadın Hasta İçin Haftalık Plan:

📋 Günlük Hedef: 1.600-1.800 kcal | P: 90g | K: 180g | Y: 55g

Pazartesi:
• Kahvaltı: Yulaf + muz + badem (380 kcal)
• Öğle: Tavuklu salata + bulgur (480 kcal)
• Akşam: Mercimek çorbası + ekmek (350 kcal)
• Ara öğün: Yoğurt + meyve (200 kcal)

Salı:
• Kahvaltı: Menemen + tam buğday ekmek (400 kcal)
• Öğle: Nohutlu tavuk sote + pilav (520 kcal)
• Akşam: Fırında balık + sebze (380 kcal)
• Ara öğün: Kuruyemiş karışımı (170 kcal)

... (tüm hafta benzer dengede devam eder)

💡 Önemli: Günlük 2.5L su, haftada 3x egzersiz önerilir.`,
  'Besin analizi yap': `Bugünkü Öğün Analizi — Genel Değerlendirme:

✅ Kahvaltı: Dengeli (protein + karbonhidrat + sağlıklı yağ)
⚠️ Öğle: Protein eksik, sebze yetersiz
❌ Akşam: Henüz kayıt girilmemiş

Eksik Besinler:
• C vitamini: Meyve tüketimi artırılmalı
• Demir: Kırmızı et veya baklagil eklenmeli
• Lif: Tam tahıllar ve sebze porsiyonu artırılmalı

Günlük Toplam (şu ana kadar): 1.120 kcal / 1.800 kcal hedef
Kalan: 680 kcal — akşam yemeği için ideal aralık`,
  'Hasta raporu özetle': `Ayşe Yılmaz — Aylık Rapor Özeti:

Kilo: 72.5 → 70.8 kg (−1.7 kg) ✅
Plan Uyumu: %88
Protein: %82 hedef tutturma
Su: 2.1L/gün (hedef: 2.5L) ⚠️

Genel Değerlendirme: İyi ilerleme, protein ve su takibi artırılmalı.`,
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])


  const handleSend = async (text?: string) => {
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

    try {
      const reply = await sendAiMessage(messageText)
      const aiMessage: ChatMessage = {
        id: String(Date.now()),
        role: 'assistant',
        content: reply.content ?? 'Yanıt alınamadı.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch {
      // Fallback: use mock response or generic answer
      const matchedKey = Object.keys(mockResponses).find(k => messageText.toLowerCase().includes(k.toLowerCase()))
      const fallbackContent = matchedKey
        ? mockResponses[matchedKey]
        : `Sorunuzu analiz ettim. "${messageText}" hakkında şunu söyleyebilirim:\n\nBeslenme planınıza göre günlük hedeflere ulaşmak için dengeli öğünler tüketilmesi önemlidir. Detaylı analiz için hasta profilini ve öğün kayıtlarını inceleyebilirsiniz.\n\nBaşka nasıl yardımcı olabilirim?`

      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: String(Date.now()),
          role: 'assistant',
          content: fallbackContent,
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 1000)
      return
    } finally {
      setIsLoading(false)
    }
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
        {messages.length <= 2 && (
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
