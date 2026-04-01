import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const moods = [
  { emoji: '😀', label: 'Harika', color: '#1A5C37' },
  { emoji: '😊', label: 'İyi', color: '#4ECDC4' },
  { emoji: '😐', label: 'Normal', color: '#E8A040' },
  { emoji: '😢', label: 'Üzgün', color: '#4A7FB5' },
  { emoji: '😡', label: 'Sinirli', color: '#EF4444' },
]

const mockHistory = [
  { date: '17 Mar', emoji: '😊', label: 'İyi', note: 'Güzel bir gün geçirdim.' },
  { date: '16 Mar', emoji: '😀', label: 'Harika', note: 'Egzersiz yaptım, enerjik hissediyorum!' },
  { date: '15 Mar', emoji: '😐', label: 'Normal', note: '' },
  { date: '14 Mar', emoji: '😊', label: 'İyi', note: 'Arkadaşlarla buluştum.' },
  { date: '13 Mar', emoji: '😢', label: 'Üzgün', note: 'İyi uyuyamadım.' },
  { date: '12 Mar', emoji: '😀', label: 'Harika', note: '' },
  { date: '11 Mar', emoji: '😊', label: 'İyi', note: 'Yeni bir tarif denedim.' },
]

export default function MoodScreen() {
  const navigation = useNavigation<Nav>()
  const [selected, setSelected] = useState<number | null>(1) // default: İyi

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Ruh Hali (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Today's mood picker */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-1">Bugün nasıl hissediyorsun?</Text>
          <Text className="text-sm text-[#5A7264] mb-4">Ruh halini seç</Text>
          <View className="flex-row justify-between">
            {moods.map((mood, i) => (
              <TouchableOpacity
                key={i}
                className="items-center"
                activeOpacity={0.7}
                onPress={() => setSelected(i)}
              >
                <View
                  className="w-14 h-14 rounded-full items-center justify-center mb-1.5"
                  style={{
                    backgroundColor: selected === i ? mood.color + '20' : '#F8FAF9',
                    borderWidth: selected === i ? 2 : 1,
                    borderColor: selected === i ? mood.color : '#E8F0EC',
                  }}
                >
                  <Text className="text-2xl">{mood.emoji}</Text>
                </View>
                <Text
                  className="text-xs font-semibold"
                  style={{ color: selected === i ? mood.color : '#5A7264' }}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selected !== null && (
            <TouchableOpacity
              className="bg-[#1A5C37] rounded-xl py-3.5 items-center mt-5"
              activeOpacity={0.8}
            >
              <Text className="text-sm font-semibold text-white">Kaydet ✓</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Weekly overview */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-3">Bu Hafta</Text>
          <View className="flex-row justify-between">
            {mockHistory.slice(0, 7).map((d, i) => (
              <View key={i} className="items-center">
                <Text className="text-2xl mb-1">{d.emoji}</Text>
                <Text className="text-[10px] text-[#5A7264]">{d.date.split(' ')[0]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* History list */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Geçmiş</Text>
        {mockHistory.map((d, i) => (
          <View key={i} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2 border border-[#E8F0EC]">
            <Text className="text-2xl mr-3">{d.emoji}</Text>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{d.label}</Text>
              {d.note ? (
                <Text className="text-xs text-[#5A7264] mt-0.5">{d.note}</Text>
              ) : null}
            </View>
            <Text className="text-xs text-[#5A7264]">{d.date}</Text>
          </View>
        ))}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
