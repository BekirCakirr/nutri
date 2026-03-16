import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function TextInputScreen() {
  const navigation = useNavigation()
  const [text, setText] = useState('')

  return (
    <ScreenWrapper keyboardAvoiding padded={false}>
      <AppHeader title="Yazı ile Giriş" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-6" showsVerticalScrollIndicator={false}>
        <View className="bg-[#E8F5EC] rounded-2xl p-4 mb-6 flex-row items-center border border-[#C8E6CF]/40">
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1A5C37" />
          <Text className="text-sm text-[#1A5C37] ml-3 flex-1">
            Ne yediğinizi yazın, AI sizin için analiz etsin.
          </Text>
        </View>

        <TextInput
          className="bg-white rounded-2xl border border-[#D4E2DA] px-4 py-4 text-base text-[#1A2E23] min-h-[120px] mb-6"
          placeholder="Örn: 1 kase mercimek çorbası, 2 dilim ekmek, 1 bardak ayran..."
          placeholderTextColor="#9CA8A1"
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          className={`rounded-xl py-4 items-center ${text.trim() ? 'bg-[#1A5C37]' : 'bg-[#D4E2DA]'}`}
          disabled={!text.trim()}
          style={text.trim() ? { shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 } : {}}
          onPress={() => navigation.goBack()}
        >
          <Text className={`text-base font-semibold ${text.trim() ? 'text-white' : 'text-[#9CA8A1]'}`}>
            Analiz Et 🔍
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
