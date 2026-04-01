import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type MacroData = {
  name: string
  current: number
  target: number
  unit: string
  color: string
  calories: number
}

const macros: MacroData[] = [
  { name: 'Protein', current: 92, target: 120, unit: 'g', color: '#C75B4A', calories: 368 },
  { name: 'Karbonhidrat', current: 210, target: 275, unit: 'g', color: '#4A7FB5', calories: 840 },
  { name: 'Yağ', current: 58, target: 73, unit: 'g', color: '#D4A843', calories: 522 },
]

const totalCal = macros.reduce((s, m) => s + m.calories, 0)
const targetCal = 2200

const weeklyMacros = [
  { day: 'Pzt', protein: 95, carbs: 230, fat: 62 },
  { day: 'Sal', protein: 85, carbs: 200, fat: 55 },
  { day: 'Çar', protein: 110, carbs: 260, fat: 70 },
  { day: 'Per', protein: 88, carbs: 195, fat: 58 },
  { day: 'Cum', protein: 100, carbs: 240, fat: 65 },
  { day: 'Cmt', protein: 75, carbs: 280, fat: 80 },
  { day: 'Paz', protein: 92, carbs: 210, fat: 58 },
]

export default function MacroTrackingScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Makro Takibi (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Total calories from macros */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4 items-center">
          <Text className="text-sm text-[#5A7264]">Makrolardan Kalori</Text>
          <Text className="text-3xl font-extrabold text-[#1A2E23] mt-1">{totalCal} kcal</Text>
          <Text className="text-xs text-[#5A7264] mt-0.5">Hedef: {targetCal} kcal</Text>
        </View>

        {/* Macro donut (simplified with bars) */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-4">Bugün</Text>

          {/* Distribution bar */}
          <View className="h-4 bg-[#E8F0EC] rounded-full overflow-hidden flex-row mb-4">
            {macros.map((m, i) => (
              <View
                key={i}
                className="h-full"
                style={{
                  width: `${(m.calories / totalCal) * 100}%`,
                  backgroundColor: m.color,
                }}
              />
            ))}
          </View>

          {/* Legend */}
          <View className="flex-row justify-between">
            {macros.map((m, i) => (
              <View key={i} className="items-center">
                <View className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: m.color }} />
                <Text className="text-xs font-semibold text-[#1A2E23]">{m.name}</Text>
                <Text className="text-xs text-[#5A7264]">
                  {Math.round((m.calories / totalCal) * 100)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Individual macro progress */}
        {macros.map((m, i) => {
          const pct = Math.min((m.current / m.target) * 100, 100)
          return (
            <View key={i} className="bg-white rounded-xl p-4 mb-3 border border-[#E8F0EC]">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: m.color }} />
                  <Text className="text-base font-semibold text-[#1A2E23]">{m.name}</Text>
                </View>
                <Text className="text-base font-bold" style={{ color: m.color }}>
                  {m.current}g / {m.target}g
                </Text>
              </View>
              <View className="h-3 bg-[#E8F0EC] rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: m.color }}
                />
              </View>
              <View className="flex-row justify-between mt-1.5">
                <Text className="text-xs text-[#5A7264]">%{Math.round(pct)}</Text>
                <Text className="text-xs text-[#5A7264]">{m.calories} kcal</Text>
              </View>
            </View>
          )
        })}

        {/* Weekly table */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-8 mt-2">
          <Text className="text-base font-bold text-[#1A2E23] mb-3">Haftalık Özet</Text>
          {/* Header */}
          <View className="flex-row pb-2 mb-2 border-b border-[#E8F0EC]">
            <Text className="flex-1 text-xs font-bold text-[#5A7264]">Gün</Text>
            <Text className="w-16 text-xs font-bold text-center" style={{ color: '#C75B4A' }}>P</Text>
            <Text className="w-16 text-xs font-bold text-center" style={{ color: '#4A7FB5' }}>K</Text>
            <Text className="w-16 text-xs font-bold text-center" style={{ color: '#D4A843' }}>Y</Text>
          </View>
          {weeklyMacros.map((w, i) => (
            <View key={i} className="flex-row py-1.5">
              <Text className="flex-1 text-sm text-[#1A2E23] font-semibold">{w.day}</Text>
              <Text className="w-16 text-sm text-center text-[#1A2E23]">{w.protein}g</Text>
              <Text className="w-16 text-sm text-center text-[#1A2E23]">{w.carbs}g</Text>
              <Text className="w-16 text-sm text-center text-[#1A2E23]">{w.fat}g</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}
