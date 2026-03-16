import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function VoiceScreen() {
  const navigation = useNavigation()
  const [recording, setRecording] = useState(false)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Sesli Giriş" onBack={() => navigation.goBack()} />
      <View className="flex-1 bg-[#F8FAF9] items-center justify-center px-8">
        <View className="bg-[#E8F5EC] rounded-2xl p-4 mb-10 flex-row items-center border border-[#C8E6CF]/40 self-stretch">
          <Ionicons name="mic-outline" size={20} color="#1A5C37" />
          <Text className="text-sm text-[#1A5C37] ml-3 flex-1">
            Ne yediğinizi söyleyin, AI sizin için analiz etsin.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setRecording(!recording)}
          className={`w-28 h-28 rounded-full items-center justify-center mb-6 ${
            recording ? 'bg-[#EF4444]' : 'bg-[#1A5C37]'
          }`}
          style={{ shadowColor: recording ? '#EF4444' : '#1A5C37', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}
        >
          <Ionicons name={recording ? 'stop' : 'mic'} size={40} color="#FFFFFF" />
        </TouchableOpacity>

        <Text className="text-base font-semibold text-[#1A2E23]">
          {recording ? 'Dinleniyor...' : 'Konuşmaya başlayın'}
        </Text>
        <Text className="text-sm text-[#5A7264] mt-2 text-center">
          {recording
            ? '"Öğle yemeğinde pilav ve tavuk yedim" gibi konuşun'
            : 'Mikrofon butonuna basarak kayıt başlatın'}
        </Text>
      </View>
    </ScreenWrapper>
  )
}
