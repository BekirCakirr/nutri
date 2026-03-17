import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type VitaminItem = {
  name: string
  current: number
  target: number
  unit: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
}

const mockVitamins: VitaminItem[] = [
  { name: 'C Vitamini', current: 72, target: 90, unit: 'mg', icon: 'nutrition-outline', color: '#E8A040' },
  { name: 'D Vitamini', current: 400, target: 600, unit: 'IU', icon: 'sunny-outline', color: '#F59E0B' },
  { name: 'B12 Vitamini', current: 2.0, target: 2.4, unit: 'µg', icon: 'flash-outline', color: '#C75B4A' },
  { name: 'Demir', current: 14, target: 18, unit: 'mg', icon: 'water', color: '#EF4444' },
  { name: 'Kalsiyum', current: 850, target: 1000, unit: 'mg', icon: 'fitness-outline', color: '#4A7FB5' },
  { name: 'Magnezyum', current: 310, target: 400, unit: 'mg', icon: 'leaf-outline', color: '#1A5C37' },
  { name: 'Çinko', current: 9, target: 11, unit: 'mg', icon: 'shield-outline', color: '#8B6BAA' },
  { name: 'A Vitamini', current: 750, target: 900, unit: 'µg', icon: 'eye-outline', color: '#E8A040' },
  { name: 'E Vitamini', current: 12, target: 15, unit: 'mg', icon: 'heart-outline', color: '#4ECDC4' },
  { name: 'Omega-3', current: 1.2, target: 1.6, unit: 'g', icon: 'fish-outline', color: '#4A90B8' },
  { name: 'Lif', current: 22, target: 30, unit: 'g', icon: 'leaf-outline', color: '#5DA06B' },
  { name: 'Potasyum', current: 3200, target: 4700, unit: 'mg', icon: 'pulse-outline', color: '#D4A843' },
]

export default function VitaminsScreen() {
  const navigation = useNavigation<Nav>()

  const adequate = mockVitamins.filter(v => (v.current / v.target) >= 0.8).length

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Vitamin & Mineral" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-sm text-[#5A7264]">Günlük Alım Durumu</Text>
          <Text className="text-2xl font-extrabold text-[#1A2E23] mt-1">
            {adequate}/{mockVitamins.length} yeterli
          </Text>
          <Text className="text-xs text-[#5A7264] mt-1">%80 ve üzeri yeterli kabul edilir</Text>
        </View>

        {/* Vitamins list */}
        {mockVitamins.map((v, i) => {
          const pct = Math.min((v.current / v.target) * 100, 100)
          const isLow = pct < 60
          const isOk = pct >= 80
          return (
            <View key={i} className="bg-white rounded-xl p-4 mb-2.5 border border-[#E8F0EC]">
              <View className="flex-row items-center mb-2.5">
                <View
                  className="w-9 h-9 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: v.color + '20' }}
                >
                  <Ionicons name={v.icon} size={18} color={v.color} />
                </View>
                <Text className="text-base font-semibold text-[#1A2E23] flex-1">{v.name}</Text>
                <Text className="text-sm font-bold" style={{ color: isLow ? '#EF4444' : isOk ? '#1A5C37' : '#E8A040' }}>
                  %{Math.round(pct)}
                </Text>
              </View>
              {/* Progress bar */}
              <View className="h-2.5 bg-[#E8F0EC] rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isLow ? '#EF4444' : isOk ? '#1A5C37' : '#E8A040',
                  }}
                />
              </View>
              <View className="flex-row justify-between mt-1.5">
                <Text className="text-xs text-[#5A7264]">{v.current} {v.unit}</Text>
                <Text className="text-xs text-[#5A7264]">Hedef: {v.target} {v.unit}</Text>
              </View>
            </View>
          )
        })}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
