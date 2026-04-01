import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const stressLevels = [
  { level: 1, label: 'Çok Düşük', emoji: '😌', color: '#1A5C37' },
  { level: 2, label: 'Düşük', emoji: '😊', color: '#4AA564' },
  { level: 3, label: 'Hafif', emoji: '🙂', color: '#6FBE84' },
  { level: 4, label: 'Normal', emoji: '😐', color: '#E8A040' },
  { level: 5, label: 'Orta', emoji: '😕', color: '#F59E0B' },
  { level: 6, label: 'Biraz Yüksek', emoji: '😟', color: '#E8A040' },
  { level: 7, label: 'Yüksek', emoji: '😰', color: '#EF4444' },
  { level: 8, label: 'Çok Yüksek', emoji: '😫', color: '#EF4444' },
]

const mockHistory = [
  { date: '17 Mar', level: 4, note: 'İş yoğunluğu' },
  { date: '16 Mar', level: 3, note: '' },
  { date: '15 Mar', level: 6, note: 'Uyku eksikliği' },
  { date: '14 Mar', level: 2, note: 'Meditasyon yaptım' },
  { date: '13 Mar', level: 5, note: '' },
  { date: '12 Mar', level: 3, note: 'Egzersiz sonrası düştü' },
  { date: '11 Mar', level: 4, note: '' },
]

const tips = [
  { title: 'Nefes Egzersizi', desc: '4-7-8 tekniğiyle 5 dakika', icon: 'cloud-outline' as const },
  { title: 'Meditasyon', desc: '10 dakika farkındalık meditasyonu', icon: 'flower-outline' as const },
  { title: 'Yürüyüş', desc: '15 dakika doğada yürüyüş', icon: 'walk-outline' as const },
  { title: 'Müzik', desc: 'Sakinleştirici müzik dinle', icon: 'musical-notes-outline' as const },
]

export default function StressScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedLevel, setSelectedLevel] = useState(4)

  const avgLevel = (mockHistory.reduce((s, d) => s + d.level, 0) / mockHistory.length).toFixed(1)
  const current = stressLevels.find(s => s.level === selectedLevel) || stressLevels[3]

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Stres Seviyesi (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Current stress */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4 items-center">
          <Text className="text-4xl mb-2">{current.emoji}</Text>
          <Text className="text-xl font-extrabold text-[#1A2E23]">{current.label}</Text>
          <Text className="text-sm text-[#5A7264] mt-0.5">Seviye {current.level}/8</Text>

          {/* Level slider */}
          <View className="flex-row mt-4 w-full justify-between">
            {stressLevels.map((s) => (
              <TouchableOpacity
                key={s.level}
                className="items-center"
                activeOpacity={0.7}
                onPress={() => setSelectedLevel(s.level)}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: selectedLevel === s.level ? s.color + '30' : '#F8FAF9',
                    borderWidth: selectedLevel === s.level ? 2 : 1,
                    borderColor: selectedLevel === s.level ? s.color : '#E8F0EC',
                  }}
                >
                  <Text className="text-xs font-bold" style={{ color: s.color }}>{s.level}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            className="bg-[#1A5C37] rounded-xl py-3.5 items-center mt-4 w-full"
            activeOpacity={0.8}
          >
            <Text className="text-sm font-semibold text-white">Kaydet</Text>
          </TouchableOpacity>
        </View>

        {/* Average */}
        <View className="flex-row mb-4 gap-3">
          <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E8F0EC] items-center">
            <Text className="text-xs text-[#5A7264]">Ortalama</Text>
            <Text className="text-xl font-extrabold text-[#1A2E23] mt-1">{avgLevel}/8</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E8F0EC] items-center">
            <Text className="text-xs text-[#5A7264]">Bu hafta en düşük</Text>
            <Text className="text-xl font-extrabold text-[#1A5C37] mt-1">
              {Math.min(...mockHistory.map(h => h.level))}
            </Text>
          </View>
        </View>

        {/* Tips */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Stres Azaltma Önerileri</Text>
        <View className="flex-row flex-wrap mb-4">
          {tips.map((tip, i) => (
            <TouchableOpacity
              key={i}
              className="w-[48%] mx-[1%] mb-2.5 bg-white rounded-xl p-3.5 border border-[#E8F0EC]"
              activeOpacity={0.7}
            >
              <View className="w-9 h-9 rounded-full bg-[#E8F5EC] items-center justify-center mb-2">
                <Ionicons name={tip.icon} size={18} color="#1A5C37" />
              </View>
              <Text className="text-sm font-semibold text-[#1A2E23]">{tip.title}</Text>
              <Text className="text-xs text-[#5A7264] mt-0.5">{tip.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* History */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Geçmiş</Text>
        {mockHistory.map((d, i) => {
          const s = stressLevels.find(l => l.level === d.level) || stressLevels[3]
          return (
            <View key={i} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2 border border-[#E8F0EC]">
              <Text className="text-xl mr-3">{s.emoji}</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-[#1A2E23]">{s.label} ({d.level}/8)</Text>
                {d.note ? <Text className="text-xs text-[#5A7264] mt-0.5">{d.note}</Text> : null}
              </View>
              <Text className="text-xs text-[#5A7264]">{d.date}</Text>
            </View>
          )
        })}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
