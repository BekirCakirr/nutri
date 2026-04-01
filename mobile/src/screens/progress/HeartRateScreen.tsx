import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const mockHeartRateData = [
  { time: '08:00', bpm: 72 },
  { time: '09:30', bpm: 85 },
  { time: '11:00', bpm: 78 },
  { time: '12:30', bpm: 92 },
  { time: '14:00', bpm: 75 },
  { time: '15:30', bpm: 88 },
  { time: '17:00', bpm: 120 },
  { time: '18:30', bpm: 95 },
  { time: '20:00', bpm: 68 },
]

const restingHR = 65
const avgHR = Math.round(mockHeartRateData.reduce((s, d) => s + d.bpm, 0) / mockHeartRateData.length)
const maxHR = Math.max(...mockHeartRateData.map(d => d.bpm))
const minHR = Math.min(...mockHeartRateData.map(d => d.bpm))

function getZone(bpm: number) {
  if (bpm < 60) return { label: 'Düşük', color: '#4A7FB5' }
  if (bpm < 100) return { label: 'Normal', color: '#1A5C37' }
  if (bpm < 140) return { label: 'Orta', color: '#E8A040' }
  return { label: 'Yüksek', color: '#EF4444' }
}

const zones = [
  { label: 'Dinlenme', range: '< 60 bpm', color: '#4A7FB5', bg: '#DBEAFE' },
  { label: 'Normal', range: '60-100 bpm', color: '#1A5C37', bg: '#E8F5EC' },
  { label: 'Orta', range: '100-140 bpm', color: '#E8A040', bg: '#FEF3C7' },
  { label: 'Yoğun', range: '> 140 bpm', color: '#EF4444', bg: '#FEE2E2' },
]

export default function HeartRateScreen() {
  const navigation = useNavigation<Nav>()
  const latest = mockHeartRateData[mockHeartRateData.length - 1]
  const zone = getZone(latest.bpm)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Kalp Hızı (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Current heart rate */}
        <View className="bg-white rounded-2xl p-6 border border-[#E8F0EC] mb-4 items-center">
          <View className="w-20 h-20 rounded-full bg-[#FEE2E2] items-center justify-center mb-3">
            <Ionicons name="heart" size={36} color="#EF4444" />
          </View>
          <Text className="text-4xl font-extrabold text-[#1A2E23]">{latest.bpm}</Text>
          <Text className="text-sm text-[#5A7264]">bpm</Text>
          <View className="rounded-full px-3 py-1 mt-2" style={{ backgroundColor: zone.color + '20' }}>
            <Text className="text-xs font-bold" style={{ color: zone.color }}>{zone.label}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View className="flex-row mb-4 gap-2">
          <View className="flex-1 bg-white rounded-xl p-3.5 border border-[#E8F0EC] items-center">
            <Text className="text-xs text-[#5A7264]">Dinlenme</Text>
            <Text className="text-lg font-bold text-[#4A7FB5] mt-0.5">{restingHR}</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3.5 border border-[#E8F0EC] items-center">
            <Text className="text-xs text-[#5A7264]">Ortalama</Text>
            <Text className="text-lg font-bold text-[#1A2E23] mt-0.5">{avgHR}</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3.5 border border-[#E8F0EC] items-center">
            <Text className="text-xs text-[#5A7264]">Min / Max</Text>
            <Text className="text-lg font-bold text-[#1A2E23] mt-0.5">{minHR}/{maxHR}</Text>
          </View>
        </View>

        {/* Heart rate zones */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-3">Kalp Hızı Bölgeleri</Text>
          {zones.map((z, i) => (
            <View key={i} className="flex-row items-center py-2.5 border-b border-[#E8F0EC] last:border-b-0">
              <View className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: z.color }} />
              <Text className="flex-1 text-sm font-semibold text-[#1A2E23]">{z.label}</Text>
              <Text className="text-sm text-[#5A7264]">{z.range}</Text>
            </View>
          ))}
        </View>

        {/* Today's readings */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Bugünün Ölçümleri</Text>
        {[...mockHeartRateData].reverse().map((d, i) => {
          const z = getZone(d.bpm)
          return (
            <View key={i} className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-2 border border-[#E8F0EC]">
              <View
                className="w-9 h-9 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: z.color + '20' }}
              >
                <Ionicons name="heart" size={16} color={z.color} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#1A2E23]">{d.bpm} bpm</Text>
                <Text className="text-xs text-[#5A7264]">{d.time}</Text>
              </View>
              <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: z.color + '20' }}>
                <Text className="text-[10px] font-bold" style={{ color: z.color }}>{z.label}</Text>
              </View>
            </View>
          )
        })}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
