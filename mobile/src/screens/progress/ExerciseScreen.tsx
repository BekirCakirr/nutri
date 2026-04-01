import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { getExerciseHistory } from '../../services/api/tracking'

type Nav = StackNavigationProp<ProgressStackParamList>

interface ExercisePoint {
  date: string
  name: string
  duration: number
  calories: number
  icon: keyof typeof Ionicons.glyphMap
}

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  walking: 'walk-outline', running: 'bicycle-outline', yoga: 'body-outline', other: 'barbell-outline',
}

export default function ExerciseScreen() {
  const navigation = useNavigation<Nav>()
  const [exercises, setExercises] = useState<ExercisePoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const history = await getExerciseHistory()
        const mapped: ExercisePoint[] = history.slice(-10).map(e => {
          const typ = e.type ?? 'other'
          return {
            date: e.date,
            name: typ.charAt(0).toUpperCase() + typ.slice(1),
            duration: e.minutes ?? 30,
            calories: e.caloriesBurned ?? 0,
            icon: iconMap[typ] ?? 'barbell-outline',
          }
        })
        setExercises(mapped.length > 0 ? mapped : defaultExercises)
      } catch {
        setExercises(defaultExercises)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (isLoading) {
    return (
      <ScreenWrapper padded={false}>
        <AppHeader title="Egzersiz Takibi" onBack={() => navigation.goBack()} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C75B4A" />
        </View>
      </ScreenWrapper>
    )
  }

  const totalMin = exercises.reduce((s, e) => s + e.duration, 0)
  const totalCal = exercises.reduce((s, e) => s + e.calories, 0)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Egzersiz Takibi" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Summary cards */}
        <View className="flex-row mb-4">
          <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E8F0EC] mr-2">
            <View className="w-10 h-10 rounded-full bg-[#FEE2E2] items-center justify-center mb-2">
              <Ionicons name="time-outline" size={20} color="#C75B4A" />
            </View>
            <Text className="text-2xl font-extrabold text-[#1A2E23]">{totalMin}</Text>
            <Text className="text-xs text-[#5A7264]">dakika</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E8F0EC] ml-2">
            <View className="w-10 h-10 rounded-full bg-[#FEF3C7] items-center justify-center mb-2">
              <Ionicons name="flame-outline" size={20} color="#E8A040" />
            </View>
            <Text className="text-2xl font-extrabold text-[#1A2E23]">{totalCal}</Text>
            <Text className="text-xs text-[#5A7264]">kcal yakıldı</Text>
          </View>
        </View>

        {/* Exercise list */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Egzersiz Geçmişi</Text>
        {exercises.map((ex, i) => (
          <View key={i} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]">
            <View className="w-10 h-10 rounded-full bg-[#FEE2E2] items-center justify-center mr-3">
              <Ionicons name={ex.icon} size={20} color="#C75B4A" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{ex.name}</Text>
              <Text className="text-xs text-[#5A7264]">{ex.date} · {ex.duration} dk</Text>
            </View>
            <View className="items-end">
              <Text className="text-sm font-bold text-[#E8A040]">{ex.calories} kcal</Text>
            </View>
          </View>
        ))}

        {/* Add exercise */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mt-4 mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">+ Egzersiz Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const defaultExercises: ExercisePoint[] = [
  { date: 'Bugün', name: 'Yürüyüş', duration: 30, calories: 150, icon: 'walk-outline' },
  { date: 'Bugün', name: 'Yoga', duration: 45, calories: 120, icon: 'body-outline' },
]
