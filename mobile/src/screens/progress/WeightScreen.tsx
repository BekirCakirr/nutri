import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { getWeightHistory } from '../../services/api/tracking'

type Nav = StackNavigationProp<ProgressStackParamList>

interface WeightPoint { date: string; value: number }

const target = 70.0

export default function WeightScreen() {
  const navigation = useNavigation<Nav>()
  const [weightHistory, setWeightHistory] = useState<WeightPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await getWeightHistory()
        const mapped = data.map(w => ({ date: w.date, value: typeof w.value === 'number' ? w.value : 0 }))
        setWeightHistory(mapped.length > 0 ? mapped.slice(-7) : [
          { date: 'Demo', value: 75.0 }, { date: 'Demo', value: 74.8 }, { date: 'Demo', value: 74.5 },
        ])
      } catch {
        setWeightHistory([{ date: 'Demo', value: 74.5 }])
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (isLoading) {
    return (
      <ScreenWrapper padded={false}>
        <AppHeader title="Kilo Takibi" onBack={() => navigation.goBack()} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1A5C37" />
        </View>
      </ScreenWrapper>
    )
  }

  const current = weightHistory[weightHistory.length - 1] ?? { date: '-', value: 0 }
  const diff = current.value - target
  const minW = Math.min(...weightHistory.map(d => d.value), target) - 1
  const maxW = Math.max(...weightHistory.map(d => d.value)) + 1

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Kilo Takibi" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Current weight card */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-sm text-[#5A7264]">Mevcut Kilo</Text>
          <View className="flex-row items-end mt-1">
            <Text className="text-4xl font-extrabold text-[#1A2E23]">{current.value.toFixed(1)}</Text>
            <Text className="text-lg font-semibold text-[#5A7264] ml-1 mb-1">kg</Text>
          </View>
          <View className="flex-row items-center mt-2">
            <View className="bg-[#E8F5EC] rounded-full px-2.5 py-1 flex-row items-center">
              <Ionicons name="arrow-down" size={14} color="#1A5C37" />
              <Text className="text-xs font-bold text-[#1A5C37] ml-0.5">
                {diff.toFixed(1)} kg hedefe kaldı
              </Text>
            </View>
            <Text className="text-xs text-[#5A7264] ml-2">Hedef: {target} kg</Text>
          </View>
        </View>

        {/* Simple bar chart */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-4">Son {weightHistory.length} Gün</Text>
          <View className="flex-row items-end justify-between h-32">
            {weightHistory.map((d, i) => {
              const pct = maxW > minW ? ((d.value - minW) / (maxW - minW)) * 100 : 50
              return (
                <View key={i} className="items-center flex-1 mx-0.5">
                  <Text className="text-[10px] text-[#5A7264] mb-1">{d.value.toFixed(1)}</Text>
                  <View
                    className="w-5 rounded-t-md bg-[#1A5C37]"
                    style={{ height: `${pct}%` }}
                  />
                  <Text className="text-[10px] text-[#5A7264] mt-1">{d.date.split(' ')[0]}</Text>
                </View>
              )
            })}
          </View>
          <View className="flex-row items-center mt-3">
            <View className="h-px flex-1 bg-[#EF4444]/30" />
            <Text className="text-[10px] text-[#EF4444] mx-2">Hedef: {target} kg</Text>
            <View className="h-px flex-1 bg-[#EF4444]/30" />
          </View>
        </View>

        {/* History list */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Geçmiş Kayıtlar</Text>
        {[...weightHistory].reverse().map((d, i) => (
          <View key={i} className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-2 border border-[#E8F0EC]">
            <View className="w-10 h-10 rounded-full bg-[#E8F5EC] items-center justify-center mr-3">
              <Ionicons name="scale-outline" size={18} color="#1A5C37" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{d.value.toFixed(1)} kg</Text>
              <Text className="text-xs text-[#5A7264]">{d.date}</Text>
            </View>
            {i > 0 && weightHistory.length > 1 && (
              <View className="flex-row items-center">
                <Ionicons
                  name={weightHistory[weightHistory.length - 1 - i]?.value < weightHistory[weightHistory.length - i]?.value ? 'arrow-down' : 'arrow-up'}
                  size={14}
                  color={weightHistory[weightHistory.length - 1 - i]?.value < weightHistory[weightHistory.length - i]?.value ? '#1A5C37' : '#EF4444'}
                />
              </View>
            )}
          </View>
        ))}

        {/* Add button */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mt-4 mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">+ Yeni Kayıt Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
