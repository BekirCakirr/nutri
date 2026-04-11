import React, { useState, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
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
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader
        title="NutriAI Asistan"
        subtitle="Yapay Zeka Beslenme Danışmanı"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 16, paddingTop: 12 }}onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {/* Static Greeting */}
          <View style={{ marginBottom: 12, alignItems: 'flex-start' }}>
            <View style={{ borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#E8F0EC', borderBottomLeftRadius: 4 }} /* TODO: max-w-[85%] bg-white */>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{ width: 20, height: 20, borderRadius: 9999, backgroundColor: '#1A5C37', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
                  <Text style={{ fontSize: 8, color: '#FFFFFF', fontWeight: '700' }}>AI</Text>
                </View>
                <Text style={{ fontSize: 10, color: '#A8BFB2' }}>NutriAI</Text>
              </View>
              <Text style={{ fontSize: 14, lineHeight: 20, color: '#1A2E23' }}>
                Merhaba! Ben NutriAI asistanınızım 🤖 Size beslenme, diyet ve sağlıklı yaşam konularında yardımcı olabilirim. Ne sormak istersiniz?
              </Text>
            </View>
          </View>

          {aiMessages.map((msg) => (
            <View
              key={msg.id}
              style={{ marginBottom: 12, alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <View
                style={{ borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: msg.role === 'user' ? '#1A5C37' : '#FFFFFF',
                  borderWidth: msg.role === 'assistant' ? 1 : 0,
                  borderColor: '#E8F0EC',
                  borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                  borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 16, }} /* TODO: max-w-[85%] */
              >
                {msg.role === 'assistant' && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <View style={{ width: 20, height: 20, borderRadius: 9999, backgroundColor: '#1A5C37', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
                      <Text style={{ fontSize: 8, color: '#FFFFFF', fontWeight: '700' }}>AI</Text>
                    </View>
                    <Text style={{ fontSize: 10, color: '#A8BFB2' }}>NutriAI</Text>
                  </View>
                )}
                <Text
                  style={{ fontSize: 14, lineHeight: 20, color: msg.role === 'user' ? '#FFFFFF' : '#1A2E23' }}
                >
                  {msg.content}
                </Text>
              </View>
              <Text style={{ fontSize: 10, color: '#A8BFB2', marginTop: 2, marginHorizontal: 4 }}>
                {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View style={{ marginBottom: 12, alignItems: 'flex-start' }}>
              <View style={{ borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#E8F0EC', borderBottomLeftRadius: 4 , backgroundColor: '#FFFFFF' }}>
                <Text style={{ fontSize: 14, color: '#A8BFB2' }}>Yazıyor...</Text>
              </View>
            </View>
          )}

          {/* Quick suggestions */}
          {aiMessages.length === 0 && !isLoading && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginBottom: 16 }}>
              {quickSuggestions.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={{ borderRadius: 9999, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC' , backgroundColor: '#FFFFFF' }}activeOpacity={0.7}
                  onPress={() => { setInput(s); }}
                >
                  <Text style={{ fontSize: 12, color: '#1A5C37', fontWeight: '600' }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={{ height: 16 }}/>
        </ScrollView>

        {/* Input area */}
        <View style={{ borderTopWidth: 1, borderColor: '#E8F0EC', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' , backgroundColor: '#FFFFFF' }}>
          <TextInput
            style={{ flex: 1, backgroundColor: '#F8FAF9', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#1A2E23', borderWidth: 1, borderColor: '#E8F0EC' }}value={input}
            onChangeText={setInput}
            placeholder="Mesajınızı yazın..."
            placeholderTextColor="#A8BFB2"
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8, backgroundColor: input.trim() && !isLoading ? '#1A5C37' : '#A8BFB2' }}
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
