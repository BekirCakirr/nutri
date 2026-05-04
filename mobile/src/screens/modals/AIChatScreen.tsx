import React, { useState, useRef, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import type { AIMessage } from '../../types'
import { sendAIMessage } from '../../services/api/ai'

const quickSuggestions = [
  'Bugün ne yemeliyim?',
  'Protein açığımı kapat',
  'Sağlıklı atıştırmalık öner',
  'Kalori hesapla',
]

export default function AIChatScreen() {
  const navigation = useNavigation()
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100)
  }, [])

  const handleSend = async () => {
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

    try {
      const aiMessage = await sendAIMessage(text)
      setMessages(prev => [...prev, aiMessage])
    } catch {
      const errorMessage: AIMessage = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: 'AI servisine ulaşılamadı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
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
