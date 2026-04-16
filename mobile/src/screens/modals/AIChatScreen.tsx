import React, { useState, useRef, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import type { AIMessage } from '../../types'

const quickSuggestions = [
  'Bugün ne yemeliyim?',
  'Protein açığımı kapat',
  'Sağlıklı atıştırmalık öner',
  'Kalori hesapla',
]

const mockConversation: AIMessage[] = [
  {
    id: 'mock-1',
    role: 'user',
    content: 'Bugün kahvaltıda ne yemeliyim? Protein ağırlıklı olsun.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'mock-2',
    role: 'assistant',
    content: 'Günaydın! Protein ağırlıklı bir kahvaltı için şu menüyü öneriyorum:\n\n• 2 yumurta (haşlanmış veya omlet) — 12g protein\n• 1 dilim tam buğday ekmeği — 4g protein\n• 2 yemek kaşığı süzme peynir — 6g protein\n• 5-6 adet ceviz — 3g protein\n• 1 bardak süt — 8g protein\n\nToplam: ~33g protein, ~420 kcal\n\nBu kahvaltı günlük protein hedefinizin yaklaşık %33\'ünü karşılar.',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: 'mock-3',
    role: 'user',
    content: 'Öğle yemeğinde de devam edeyim, düşük kalorili ama tok tutan bir şey önerir misin?',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'mock-4',
    role: 'assistant',
    content: 'Tabii! Düşük kalorili ve tok tutan bir öğle yemeği:\n\n🥗 Izgara Tavuk Salatası\n• 150g ızgara tavuk göğsü — 31g protein\n• Bol yeşillik (roka, marul, ıspanak)\n• 1/2 avokado — sağlıklı yağ\n• Cherry domates + salatalık\n• Zeytinyağı-limon sos (1 yemek kaşığı)\n\nToplam: ~380 kcal, 35g protein, 12g lif\n\nLif içeriği yüksek olduğu için 3-4 saat tok tutar. Yanına bir bardak ayran eklerseniz protein değeri daha da artar.',
    timestamp: new Date(Date.now() - 1700000).toISOString(),
  },
  {
    id: 'mock-5',
    role: 'user',
    content: 'Harika! Su içme hedefim ne olmalı?',
    timestamp: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'mock-6',
    role: 'assistant',
    content: 'Profilinize göre günlük su hedefiniz 2.5 litre (yaklaşık 12-13 bardak). Birkaç ipucu:\n\n💧 Sabah kalkar kalkmaz 1 bardak su için\n💧 Her öğünden 30 dk önce 1 bardak\n💧 Egzersiz öncesi ve sonrası ekstra 1-2 bardak\n💧 Telefonunuza hatırlatıcı kurabilirsiniz\n\nBugün şu ana kadar 3 bardak içmişsiniz — hedefin %25\'i. Gün bitmeden kalan 9 bardağı tamamlamaya çalışın!',
    timestamp: new Date(Date.now() - 500000).toISOString(),
  },
]

const mockResponses: Record<string, string> = {
  'Bugün ne yemeliyim?': 'Bugünkü kalori hedefiniz 2000 kcal. Şu ana kadar 420 kcal tükettiniz. Öğle yemeği için ızgara balık, bulgur pilavı ve mevsim salatası öneriyorum. Bu öğün yaklaşık 550 kcal ve 38g protein sağlar.',
  'Protein açığımı kapat': 'Bugün 33g protein aldınız, hedefiniz 100g. Kalan 67g protein için:\n\n• 200g tavuk göğsü (46g protein)\n• 1 kase yoğurt (10g protein)\n• 30g badem (6g protein)\n• 1 bardak süt (8g protein)\n\nBu kombinasyonla hedefinizi rahatlıkla tutturabilirsiniz!',
  'Sağlıklı atıştırmalık öner': 'İşte düşük kalorili atıştırmalık önerileri:\n\n🍎 1 elma + 1 yemek kaşığı fıstık ezmesi (~200 kcal)\n🥕 Havuç çubukları + hummus (~150 kcal)\n🥜 Bir avuç karışık kuruyemiş (~170 kcal)\n🍌 Muz + tarçın (~105 kcal)\n🥚 Haşlanmış yumurta (~70 kcal)\n\nBunlar hem tok tutar hem de besin değeri yüksektir.',
  'Kalori hesapla': 'Kalori hesaplaması için yemeğinizin fotoğrafını çekebilir veya ismini yazabilirsiniz. Hızlı örnekler:\n\n• 1 porsiyon karnıyarık: ~350 kcal\n• 1 tabak mercimek çorbası: ~180 kcal\n• 1 porsiyon makarna: ~400 kcal\n• 1 dilim pizza: ~280 kcal\n\nDetaylı hesaplama için kamera sekmesinden fotoğraf çekebilirsiniz!',
}

export default function AIChatScreen() {
  const navigation = useNavigation()
  const [messages, setMessages] = useState<AIMessage[]>(mockConversation)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100)
  }, [])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    const text = input.trim()

    const userMessage: AIMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responseText = mockResponses[text] ||
        `Sorunuzu analiz ettim. "${text}" hakkında şunu söyleyebilirim:\n\nBeslenme planınıza göre günlük hedefinize ulaşmak için dengeli öğünler tüketmeniz önemli. Detaylı analiz için lütfen yemeğinizin fotoğrafını çekin veya belirli bir besin sorun.\n\nSize nasıl yardımcı olabilirim?`

      const aiMessage: AIMessage = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1200)
  }

  const handleSuggestion = (text: string) => {
    setInput(text)
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader
        title="NutriAI Asistan"
        subtitle="Yapay Zeka Beslenme Danışmanı"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={st.messageList}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting */}
          <View style={st.msgRow}>
            <View style={[st.bubble, st.bubbleAI]}>
              <View style={st.aiLabel}>
                <View style={st.aiBadge}>
                  <Text style={st.aiBadgeText}>AI</Text>
                </View>
                <Text style={st.aiName}>NutriAI</Text>
              </View>
              <Text style={st.msgText}>
                Merhaba! Ben NutriAI asistanınızım. Size beslenme, diyet ve sağlıklı yaşam konularında yardımcı olabilirim. Ne sormak istersiniz?
              </Text>
            </View>
          </View>

          {messages.map((msg) => (
            <View key={msg.id} style={[st.msgRow, msg.role === 'user' && st.msgRowUser]}>
              <View style={[st.bubble, msg.role === 'user' ? st.bubbleUser : st.bubbleAI]}>
                {msg.role === 'assistant' && (
                  <View style={st.aiLabel}>
                    <View style={st.aiBadge}>
                      <Text style={st.aiBadgeText}>AI</Text>
                    </View>
                    <Text style={st.aiName}>NutriAI</Text>
                  </View>
                )}
                <Text style={[st.msgText, msg.role === 'user' && st.msgTextUser]}>
                  {msg.content}
                </Text>
              </View>
              <Text style={[st.timeText, msg.role === 'user' && { textAlign: 'right' }]}>
                {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View style={st.msgRow}>
              <View style={[st.bubble, st.bubbleAI]}>
                <View style={st.aiLabel}>
                  <View style={st.aiBadge}>
                    <Text style={st.aiBadgeText}>AI</Text>
                  </View>
                  <Text style={st.aiName}>NutriAI</Text>
                </View>
                <Text style={st.typingText}>Yazıyor...</Text>
              </View>
            </View>
          )}

          {/* Quick suggestions - only if no mock messages visible */}
          {messages.length === 0 && !isLoading && (
            <View style={st.suggestionsWrap}>
              {quickSuggestions.map((s, i) => (
                <TouchableOpacity key={i} style={st.suggestionChip} onPress={() => handleSuggestion(s)}>
                  <Text style={st.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Quick suggestions bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.suggestBar} contentContainerStyle={st.suggestBarContent}>
          {quickSuggestions.map((s, i) => (
            <TouchableOpacity key={i} style={st.suggestBarChip} onPress={() => handleSuggestion(s)}>
              <Text style={st.suggestBarText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input area */}
        <View style={st.inputArea}>
          <TextInput
            style={st.input}
            value={input}
            onChangeText={setInput}
            placeholder="Mesajınızı yazın..."
            placeholderTextColor="#A8BFB2"
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[st.sendBtn, input.trim() && !isLoading ? st.sendBtnActive : null]}
            activeOpacity={0.8}
            onPress={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Ionicons name="send" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  messageList: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  msgRow: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  msgRowUser: {
    alignItems: 'flex-end',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '85%' as any,
  },
  bubbleAI: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8F0EC',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#1A5C37',
    borderBottomRightRadius: 4,
  },
  aiLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1A5C37',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  aiBadgeText: {
    fontSize: 8,
    color: '#FFF',
    fontWeight: '700',
  },
  aiName: {
    fontSize: 11,
    color: '#A8BFB2',
    fontWeight: '500',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#1A2E23',
  },
  msgTextUser: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 10,
    color: '#A8BFB2',
    marginTop: 3,
    marginHorizontal: 4,
  },
  typingText: {
    fontSize: 14,
    color: '#A8BFB2',
    fontStyle: 'italic',
  },
  suggestionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 16,
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8F0EC',
  },
  suggestionText: {
    fontSize: 12,
    color: '#1A5C37',
    fontWeight: '600',
  },
  suggestBar: {
    maxHeight: 44,
    backgroundColor: '#F8FAF9',
    borderTopWidth: 1,
    borderColor: '#E8F0EC',
  },
  suggestBarContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  suggestBarChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E8F0EC',
    marginRight: 8,
  },
  suggestBarText: {
    fontSize: 11,
    color: '#1A5C37',
    fontWeight: '600',
  },
  inputArea: {
    borderTopWidth: 1,
    borderColor: '#E8F0EC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A2E23',
    borderWidth: 1,
    borderColor: '#E8F0EC',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: '#A8BFB2',
  },
  sendBtnActive: {
    backgroundColor: '#1A5C37',
  },
})
