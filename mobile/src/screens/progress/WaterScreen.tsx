import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const DAILY_GOAL = 2500 // ml
const GLASS_SIZE = 250 // ml

const quickOptions = [
  { label: '1 Bardak', amount: 250, icon: 'water-outline' as const },
  { label: 'Şişe', amount: 500, icon: 'water' as const },
  { label: 'Büyük Şişe', amount: 750, icon: 'water' as const },
  { label: 'Özel', amount: 0, icon: 'add-outline' as const },
]

const mockLog = [
  { time: '08:30', amount: 250 },
  { time: '10:15', amount: 500 },
  { time: '12:00', amount: 250 },
  { time: '14:30', amount: 250 },
  { time: '16:00', amount: 500 },
]

export default function WaterScreen() {
  const navigation = useNavigation<Nav>()
  const [consumed, setConsumed] = useState(1750)
  const pct = Math.min((consumed / DAILY_GOAL) * 100, 100)
  const glasses = Math.floor(consumed / GLASS_SIZE)

  const addWater = (amount: number) => {
    if (amount > 0) setConsumed(prev => Math.min(prev + amount, 5000))
  }

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Su Takibi" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Main progress card */}
        <View className="bg-white rounded-2xl p-6 border border-[#E8F0EC] mb-4 items-center">
          {/* Circular progress (simplified) */}
          <View className="w-40 h-40 rounded-full border-[8px] border-[#E4F0F7] items-center justify-center mb-4 relative">
            <View
              className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-[8px] border-[#4A90B8]"
              style={{
                borderTopColor: pct >= 25 ? '#4A90B8' : '#E4F0F7',
                borderRightColor: pct >= 50 ? '#4A90B8' : '#E4F0F7',
                borderBottomColor: pct >= 75 ? '#4A90B8' : '#E4F0F7',
                borderLeftColor: pct >= 100 ? '#4A90B8' : '#E4F0F7',
              }}
            />
            <Ionicons name="water" size={28} color="#4A90B8" />
            <Text className="text-2xl font-extrabold text-[#1A2E23] mt-1">
              {(consumed / 1000).toFixed(1)}L
            </Text>
            <Text className="text-xs text-[#5A7264]">/ {(DAILY_GOAL / 1000).toFixed(1)}L</Text>
          </View>

          {/* Progress bar */}
          <View className="w-full h-3 bg-[#E4F0F7] rounded-full overflow-hidden">
            <View
              className="h-full bg-[#4A90B8] rounded-full"
              style={{ width: `${pct}%` }}
            />
          </View>
          <Text className="text-sm text-[#5A7264] mt-2">
            %{Math.round(pct)} tamamlandı · {glasses} bardak
          </Text>
        </View>

        {/* Quick add buttons */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Hızlı Ekle</Text>
        <View className="flex-row flex-wrap mb-4">
          {quickOptions.map((opt, i) => (
            <TouchableOpacity
              key={i}
              className="w-[48%] mx-[1%] mb-2.5 bg-white rounded-xl p-3.5 border border-[#E8F0EC] flex-row items-center"
              activeOpacity={0.7}
              onPress={() => addWater(opt.amount || 200)}
            >
              <View className="w-9 h-9 rounded-full bg-[#E4F0F7] items-center justify-center mr-2.5">
                <Ionicons name={opt.icon} size={18} color="#4A90B8" />
              </View>
              <View>
                <Text className="text-sm font-semibold text-[#1A2E23]">{opt.label}</Text>
                {opt.amount > 0 && (
                  <Text className="text-xs text-[#5A7264]">{opt.amount} ml</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's log */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Bugünün Kayıtları</Text>
        {mockLog.map((entry, i) => (
          <View key={i} className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-2 border border-[#E8F0EC]">
            <View className="w-9 h-9 rounded-full bg-[#E4F0F7] items-center justify-center mr-3">
              <Ionicons name="water-outline" size={16} color="#4A90B8" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-[#1A2E23]">{entry.amount} ml</Text>
              <Text className="text-xs text-[#5A7264]">{entry.time}</Text>
            </View>
            <Text className="text-xs text-[#5A7264]">
              {entry.amount >= 500 ? '🫗' : '🥤'}
            </Text>
          </View>
        ))}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
