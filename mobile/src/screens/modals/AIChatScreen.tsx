import React, { useState, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Message = {
  id: string
  text: string
  sender: 'user' | 'ai'
  time: string
}

const initialMessages: Message[] = [
  { id: '1', text: 'Merhaba! Ben NutriAI asistanınızım 🤖 Size beslenme, diyet ve sağlıklı yaşam konularında yardımcı olabilirim. Ne sormak istersiniz?', sender: 'ai', time: '11:00' },
]

const quickSuggestions = [
  'Bugün ne yemeliyim?',
  'Protein açığımı kapat',
  'Sağlıklı atıştırmalık öner',
  'Kalori hesapla',
]

export default function AIChatScreen() {
  const navigation = useNavigation()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const scrollRef = useRef<ScrollView>(null)

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'İlginç bir soru! Beslenme verilerinize baktığımda, bugün protein alımınız biraz düşük. Öğle yemeği için ızgara tavuk veya mercimek çorbası öneririm. 🥗',
        sender: 'ai',
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1500)
  }

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="NutriAI Asistan"
        subtitle="Yapay Zeka Beslenme Danışmanı"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 bg-[#F8FAF9] px-4 pt-3"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              className="mb-3"
              style={{ alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
            >
              {msg.sender === 'ai' && (
                <View className="flex-row items-center mb-1">
                  <View className="w-5 h-5 rounded-full bg-[#1A5C37] items-center justify-center mr-1">
                    <Text className="text-[8px] text-white font-bold">AI</Text>
                  </View>
                  <Text className="text-[10px] text-[#A8BFB2]">NutriAI</Text>
                </View>
              )}
              <View
                className="rounded-2xl px-4 py-3 max-w-[85%]"
                style={{
                  backgroundColor: msg.sender === 'user' ? '#1A5C37' : '#FFFFFF',
                  borderWidth: msg.sender === 'ai' ? 1 : 0,
                  borderColor: '#E8F0EC',
                  borderBottomRightRadius: msg.sender === 'user' ? 4 : 16,
                  borderBottomLeftRadius: msg.sender === 'ai' ? 4 : 16,
                }}
              >
                <Text
                  className="text-sm leading-5"
                  style={{ color: msg.sender === 'user' ? '#FFFFFF' : '#1A2E23' }}
                >
                  {msg.text}
                </Text>
              </View>
              <Text className="text-[10px] text-[#A8BFB2] mt-0.5 mx-1">{msg.time}</Text>
            </View>
          ))}

          {/* Quick suggestions */}
          {messages.length <= 1 && (
            <View className="flex-row flex-wrap mt-2 mb-4">
              {quickSuggestions.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  className="bg-white rounded-full px-3.5 py-2 mr-2 mb-2 border border-[#E8F0EC]"
                  activeOpacity={0.7}
                  onPress={() => { setInput(s); }}
                >
                  <Text className="text-xs text-[#1A5C37] font-semibold">{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View className="h-4" />
        </ScrollView>

        {/* Input area */}
        <View className="bg-white border-t border-[#E8F0EC] px-4 py-3 flex-row items-center">
          <TextInput
            className="flex-1 bg-[#F8FAF9] rounded-full px-4 py-2.5 text-sm text-[#1A2E23] border border-[#E8F0EC]"
            value={input}
            onChangeText={setInput}
            placeholder="Mesajınızı yazın..."
            placeholderTextColor="#A8BFB2"
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-[#1A5C37] items-center justify-center ml-2"
            activeOpacity={0.8}
            onPress={sendMessage}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}
