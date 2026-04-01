import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type Nutrient = {
  name: string
  current: number
  target: number
  unit: string
  color: string
  category: string
}

const categories = ['Makrolar', 'Vitaminler', 'Mineraller']

const mockNutrients: Nutrient[] = [
  // Makrolar
  { name: 'Protein', current: 92, target: 120, unit: 'g', color: '#C75B4A', category: 'Makrolar' },
  { name: 'Karbonhidrat', current: 210, target: 275, unit: 'g', color: '#4A7FB5', category: 'Makrolar' },
  { name: 'Yağ', current: 58, target: 73, unit: 'g', color: '#D4A843', category: 'Makrolar' },
  { name: 'Lif', current: 18, target: 30, unit: 'g', color: '#5DA06B', category: 'Makrolar' },
  { name: 'Şeker', current: 42, target: 50, unit: 'g', color: '#E8A040', category: 'Makrolar' },
  // Vitaminler
  { name: 'C Vitamini', current: 72, target: 90, unit: 'mg', color: '#E8A040', category: 'Vitaminler' },
  { name: 'D Vitamini', current: 400, target: 600, unit: 'IU', color: '#F59E0B', category: 'Vitaminler' },
  { name: 'B12', current: 2.0, target: 2.4, unit: 'µg', color: '#C75B4A', category: 'Vitaminler' },
  { name: 'A Vitamini', current: 750, target: 900, unit: 'µg', color: '#4A7FB5', category: 'Vitaminler' },
  // Mineraller
  { name: 'Kalsiyum', current: 850, target: 1000, unit: 'mg', color: '#4A7FB5', category: 'Mineraller' },
  { name: 'Demir', current: 14, target: 18, unit: 'mg', color: '#EF4444', category: 'Mineraller' },
  { name: 'Magnezyum', current: 310, target: 400, unit: 'mg', color: '#1A5C37', category: 'Mineraller' },
  { name: 'Çinko', current: 9, target: 11, unit: 'mg', color: '#8B6BAA', category: 'Mineraller' },
  { name: 'Potasyum', current: 3200, target: 4700, unit: 'mg', color: '#D4A843', category: 'Mineraller' },
]

export default function NutrientBreakdownScreen() {
  const navigation = useNavigation<Nav>()
  const [activeCategory, setActiveCategory] = useState(0)

  const filtered = mockNutrients.filter(n => n.category === categories[activeCategory])

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Besin Detayı (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-sm text-[#5A7264]">Bugünkü Alım</Text>
          <Text className="text-2xl font-extrabold text-[#1A2E23] mt-1">1680 kcal</Text>
          <Text className="text-xs text-[#5A7264] mt-0.5">
            {mockNutrients.filter(n => (n.current / n.target) >= 0.8).length}/{mockNutrients.length} besin hedefte
          </Text>
        </View>

        {/* Category tabs */}
        <View className="flex-row mb-4 gap-2">
          {categories.map((cat, i) => (
            <TouchableOpacity
              key={i}
              className="flex-1 rounded-xl py-2.5 items-center border"
              style={{
                backgroundColor: activeCategory === i ? '#1A5C37' : '#FFFFFF',
                borderColor: activeCategory === i ? '#1A5C37' : '#E8F0EC',
              }}
              activeOpacity={0.7}
              onPress={() => setActiveCategory(i)}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: activeCategory === i ? '#FFFFFF' : '#5A7264' }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nutrient items */}
        {filtered.map((n, i) => {
          const pct = Math.min((n.current / n.target) * 100, 100)
          return (
            <View key={i} className="bg-white rounded-xl p-4 mb-2.5 border border-[#E8F0EC]">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-base font-semibold text-[#1A2E23]">{n.name}</Text>
                <Text className="text-sm font-bold" style={{ color: n.color }}>
                  {n.current} / {n.target} {n.unit}
                </Text>
              </View>
              <View className="h-2.5 bg-[#E8F0EC] rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: n.color }}
                />
              </View>
              <Text className="text-xs text-[#5A7264] mt-1 text-right">%{Math.round(pct)}</Text>
            </View>
          )
        })}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
