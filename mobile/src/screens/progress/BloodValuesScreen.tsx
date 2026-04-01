import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type BloodValue = {
  name: string
  value: number
  unit: string
  min: number
  max: number
  date: string
}

const mockBloodValues: BloodValue[] = [
  { name: 'Açlık Kan Şekeri', value: 95, unit: 'mg/dL', min: 70, max: 100, date: '10 Mar' },
  { name: 'Toplam Kolesterol', value: 195, unit: 'mg/dL', min: 0, max: 200, date: '10 Mar' },
  { name: 'LDL Kolesterol', value: 115, unit: 'mg/dL', min: 0, max: 130, date: '10 Mar' },
  { name: 'HDL Kolesterol', value: 55, unit: 'mg/dL', min: 40, max: 100, date: '10 Mar' },
  { name: 'Trigliserit', value: 140, unit: 'mg/dL', min: 0, max: 150, date: '10 Mar' },
  { name: 'Hemoglobin', value: 14.2, unit: 'g/dL', min: 12, max: 17, date: '10 Mar' },
  { name: 'Demir', value: 85, unit: 'µg/dL', min: 60, max: 170, date: '10 Mar' },
  { name: 'B12 Vitamini', value: 320, unit: 'pg/mL', min: 200, max: 900, date: '10 Mar' },
  { name: 'D Vitamini', value: 28, unit: 'ng/mL', min: 30, max: 100, date: '10 Mar' },
  { name: 'TSH', value: 2.5, unit: 'mIU/L', min: 0.4, max: 4.0, date: '10 Mar' },
]

function getStatus(val: number, min: number, max: number) {
  if (val < min) return { label: 'Düşük', color: '#E8A040', bg: '#FEF3C7' }
  if (val > max) return { label: 'Yüksek', color: '#EF4444', bg: '#FEE2E2' }
  return { label: 'Normal', color: '#1A5C37', bg: '#E8F5EC' }
}

export default function BloodValuesScreen() {
  const navigation = useNavigation<Nav>()

  const normalCount = mockBloodValues.filter(v => v.value >= v.min && v.value <= v.max).length

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Kan Değerleri (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-[#E8F5EC] items-center justify-center mr-3">
              <Ionicons name="water" size={22} color="#1A5C37" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-[#1A2E23]">
                {normalCount}/{mockBloodValues.length} Normal
              </Text>
              <Text className="text-xs text-[#5A7264]">Son tahlil: 10 Mart 2026</Text>
            </View>
          </View>
        </View>

        {/* Values list */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Tüm Değerler</Text>
        {mockBloodValues.map((v, i) => {
          const status = getStatus(v.value, v.min, v.max)
          const pct = Math.min(((v.value - v.min) / (v.max - v.min)) * 100, 100)
          return (
            <View key={i} className="bg-white rounded-xl p-4 mb-2.5 border border-[#E8F0EC]">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-base font-semibold text-[#1A2E23] flex-1">{v.name}</Text>
                <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: status.bg }}>
                  <Text className="text-xs font-bold" style={{ color: status.color }}>{status.label}</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xl font-extrabold text-[#1A2E23]">{v.value}</Text>
                <Text className="text-sm text-[#5A7264]">{v.unit}</Text>
              </View>
              {/* Progress bar */}
              <View className="h-2 bg-[#E8F0EC] rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(Math.min(pct, 100), 2)}%`,
                    backgroundColor: status.color,
                  }}
                />
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-[10px] text-[#5A7264]">{v.min} {v.unit}</Text>
                <Text className="text-[10px] text-[#5A7264]">{v.max} {v.unit}</Text>
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
          <Text className="text-base font-semibold text-white">+ Yeni Tahlil Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
