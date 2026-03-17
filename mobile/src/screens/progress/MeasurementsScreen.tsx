import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type Measurement = {
  name: string
  value: number
  prevValue: number
  unit: string
  icon: keyof typeof Ionicons.glyphMap
}

const mockMeasurements: Measurement[] = [
  { name: 'Göğüs', value: 96, prevValue: 98, unit: 'cm', icon: 'body-outline' },
  { name: 'Bel', value: 82, prevValue: 85, unit: 'cm', icon: 'resize-outline' },
  { name: 'Kalça', value: 99, prevValue: 100, unit: 'cm', icon: 'body-outline' },
  { name: 'Sağ Kol', value: 33, prevValue: 32.5, unit: 'cm', icon: 'fitness-outline' },
  { name: 'Sol Kol', value: 32.5, prevValue: 32, unit: 'cm', icon: 'fitness-outline' },
  { name: 'Sağ Bacak', value: 55, prevValue: 56, unit: 'cm', icon: 'walk-outline' },
  { name: 'Sol Bacak', value: 54.5, prevValue: 55.5, unit: 'cm', icon: 'walk-outline' },
  { name: 'Boyun', value: 38, prevValue: 38.5, unit: 'cm', icon: 'person-outline' },
]

const lastUpdate = '16 Mar 2026'

export default function MeasurementsScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Vücut Ölçüleri" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <View className="bg-[#1A2E23] rounded-2xl p-5 mb-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-[#2D4A3A] items-center justify-center mr-3">
              <Ionicons name="body-outline" size={24} color="#4ECDC4" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-white">{mockMeasurements.length} Ölçü</Text>
              <Text className="text-xs text-white/50">Son güncelleme: {lastUpdate}</Text>
            </View>
          </View>
        </View>

        {/* Measurements list */}
        {mockMeasurements.map((m, i) => {
          const diff = m.value - m.prevValue
          const isDown = diff < 0
          const isUp = diff > 0
          return (
            <View key={i} className="bg-white rounded-xl p-4 mb-2.5 border border-[#E8F0EC]">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-[#E8F5EC] items-center justify-center mr-3">
                  <Ionicons name={m.icon} size={18} color="#1A5C37" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-[#1A2E23]">{m.name}</Text>
                  <Text className="text-xs text-[#5A7264]">Önceki: {m.prevValue} {m.unit}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-extrabold text-[#1A2E23]">{m.value} {m.unit}</Text>
                  {diff !== 0 && (
                    <View className="flex-row items-center mt-0.5">
                      <Ionicons
                        name={isDown ? 'arrow-down' : 'arrow-up'}
                        size={12}
                        color={isDown ? '#1A5C37' : '#EF4444'}
                      />
                      <Text
                        className="text-xs font-semibold ml-0.5"
                        style={{ color: isDown ? '#1A5C37' : '#EF4444' }}
                      >
                        {Math.abs(diff).toFixed(1)} {m.unit}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )
        })}

        {/* Add button */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mt-4 mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">+ Yeni Ölçüm Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
