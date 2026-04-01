import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { getSleepHistory } from '../../services/api/tracking'

type Nav = StackNavigationProp<ProgressStackParamList>

interface SleepPoint {
  date: string
  duration: number
  quality: number
  bedTime: string
  wakeTime: string
}

function qualityColor(q: number) {
  if (q >= 85) return '#1A5C37'
  if (q >= 70) return '#E8A040'
  return '#EF4444'
}

function qualityLabel(q: number) {
  if (q >= 85) return 'Mükemmel'
  if (q >= 70) return 'İyi'
  if (q >= 50) return 'Orta'
  return 'Düşük'
}

const qualityToPercent: Record<string, number> = {
  excellent: 95, good: 80, fair: 65, poor: 40,
}

export default function SleepScreen() {
  const navigation = useNavigation<Nav>()
  const [sleepData, setSleepData] = useState<SleepPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const history = await getSleepHistory()
        const mapped: SleepPoint[] = history.slice(-7).map(s => {
          return {
            date: s.date,
            duration: s.hours > 0 ? s.hours : 7.5,
            quality: typeof s.quality === 'number' ? s.quality * 20 : 80,
            bedTime: '23:00',
            wakeTime: s.hours > 0 ? `${String(Math.floor(23 + s.hours) % 24).padStart(2, '0')}:00` : '07:00',
          }
        })
        setSleepData(mapped.length > 0 ? mapped : defaultData)
      } catch {
        setSleepData(defaultData)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (isLoading) {
    return (
      <ScreenWrapper padded={false}>
        <AppHeader title="Uyku Takibi" onBack={() => navigation.goBack()} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A7FB5" />
        </View>
      </ScreenWrapper>
    )
  }

  const latest = sleepData[sleepData.length - 1] ?? defaultData[0]
  const avgDuration = (sleepData.reduce((s, d) => s + d.duration, 0) / (sleepData.length || 1)).toFixed(1)
  const avgQuality = Math.round(sleepData.reduce((s, d) => s + d.quality, 0) / (sleepData.length || 1))

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Uyku Takibi" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Current sleep card */}
        <View className="bg-[#1A2E23] rounded-2xl p-5 mb-4">
          <Text className="text-sm text-white/60">Son Gece</Text>
          <View className="flex-row items-end mt-1">
            <Text className="text-4xl font-extrabold text-white">{latest.duration.toFixed(1)}</Text>
            <Text className="text-lg text-white/60 ml-1 mb-1">saat</Text>
          </View>
          <View className="flex-row items-center mt-3 gap-4">
            <View className="flex-row items-center">
              <Ionicons name="moon-outline" size={14} color="rgba(255,255,255,0.6)" />
              <Text className="text-xs text-white/60 ml-1">{latest.bedTime}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="sunny-outline" size={14} color="rgba(255,255,255,0.6)" />
              <Text className="text-xs text-white/60 ml-1">{latest.wakeTime}</Text>
            </View>
            <View
              className="rounded-full px-2.5 py-1 ml-auto"
              style={{ backgroundColor: qualityColor(latest.quality) + '30' }}
            >
              <Text className="text-xs font-bold" style={{ color: qualityColor(latest.quality) === '#1A5C37' ? '#4ECDC4' : qualityColor(latest.quality) }}>
                %{latest.quality} {qualityLabel(latest.quality)}
              </Text>
            </View>
          </View>
        </View>

        {/* Average stats */}
        <View className="flex-row mb-4">
          <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E8F0EC] mr-2 items-center">
            <Ionicons name="time-outline" size={22} color="#4A7FB5" />
            <Text className="text-xl font-extrabold text-[#1A2E23] mt-1">{avgDuration}</Text>
            <Text className="text-xs text-[#5A7264]">Ort. süre (saat)</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E8F0EC] ml-2 items-center">
            <Ionicons name="star-outline" size={22} color="#E8A040" />
            <Text className="text-xl font-extrabold text-[#1A2E23] mt-1">%{avgQuality}</Text>
            <Text className="text-xs text-[#5A7264]">Ort. kalite</Text>
          </View>
        </View>

        {/* Sleep history */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Haftalık Geçmiş</Text>
        {sleepData.map((d, i) => (
          <View key={i} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2 border border-[#E8F0EC]">
            <View className="w-10 h-10 rounded-full bg-[#DBEAFE] items-center justify-center mr-3">
              <Ionicons name="moon-outline" size={18} color="#4A7FB5" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{d.duration.toFixed(1)} saat</Text>
              <Text className="text-xs text-[#5A7264]">{d.date} · {d.bedTime} → {d.wakeTime}</Text>
            </View>
            <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: qualityColor(d.quality) + '20' }}>
              <Text className="text-xs font-bold" style={{ color: qualityColor(d.quality) }}>
                %{d.quality}
              </Text>
            </View>
          </View>
        ))}

        {/* Add button */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mt-4 mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">+ Uyku Kaydı Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const defaultData: SleepPoint[] = [
  { date: '16 Mar', duration: 7.5, quality: 88, bedTime: '23:15', wakeTime: '06:45' },
  { date: '15 Mar', duration: 6.8, quality: 72, bedTime: '00:30', wakeTime: '07:18' },
  { date: '14 Mar', duration: 8.0, quality: 92, bedTime: '22:45', wakeTime: '06:45' },
]
