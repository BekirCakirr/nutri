import React, { useState, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

import { useAI } from '../../hooks'

const quickSuggestions = [
  'Bugün ne yemeliyim?',
  'Protein açığımı kapat',
  'Sağlıklı atıştırmalık öner',
  'Kalori hesapla',
]

export default function AIChatScreen() {
  const navigation = useNavigation()
  const { messages: aiMessages, isLoading, sendMessage } = useAI()
  const [input, setInput] = useState('')
  const scrollRef = useRef<ScrollView>(null)

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input.trim())
    setInput('')
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
          {/* Static Greeting */}
          <View className="mb-3 items-start">
            <View className="rounded-2xl px-4 py-3 max-w-[85%] bg-white border border-[#E8F0EC]" style={{ borderBottomLeftRadius: 4 }}>
              <View className="flex-row items-center mb-1">
                <View className="w-5 h-5 rounded-full bg-[#1A5C37] items-center justify-center mr-1">
                  <Text className="text-[8px] text-white font-bold">AI</Text>
                </View>
                <Text className="text-[10px] text-[#A8BFB2]">NutriAI</Text>
              </View>
              <Text className="text-sm leading-5 text-[#1A2E23]">
                Merhaba! Ben NutriAI asistanınızım 🤖 Size beslenme, diyet ve sağlıklı yaşam konularında yardımcı olabilirim. Ne sormak istersiniz?
              </Text>
            </View>
          </View>

          {aiMessages.map((msg) => (
            <View
              key={msg.id}
              className="mb-3"
              style={{ alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <View
                className="rounded-2xl px-4 py-3 max-w-[85%]"
                style={{
                  backgroundColor: msg.role === 'user' ? '#1A5C37' : '#FFFFFF',
                  borderWidth: msg.role === 'assistant' ? 1 : 0,
                  borderColor: '#E8F0EC',
                  borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                  borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 16,
                }}
              >
                {msg.role === 'assistant' && (
                  <View className="flex-row items-center mb-1">
                    <View className="w-5 h-5 rounded-full bg-[#1A5C37] items-center justify-center mr-1">
                      <Text className="text-[8px] text-white font-bold">AI</Text>
                    </View>
                    <Text className="text-[10px] text-[#A8BFB2]">NutriAI</Text>
                  </View>
                )}
                <Text
                  className="text-sm leading-5"
                  style={{ color: msg.role === 'user' ? '#FFFFFF' : '#1A2E23' }}
                >
                  {msg.content}
                </Text>
              </View>
              <Text className="text-[10px] text-[#A8BFB2] mt-0.5 mx-1">
                {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View className="mb-3 items-start">
              <View className="rounded-2xl px-4 py-3 bg-white border border-[#E8F0EC]" style={{ borderBottomLeftRadius: 4 }}>
                <Text className="text-sm text-[#A8BFB2]">Yazıyor...</Text>
              </View>
            </View>
          )}

          {/* Quick suggestions */}
          {aiMessages.length === 0 && !isLoading && (
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
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!isLoading}
          />
          <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center ml-2 ${input.trim() && !isLoading ? 'bg-[#1A5C37]' : 'bg-[#A8BFB2]'}`}
            activeOpacity={0.8}
            onPress={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}
