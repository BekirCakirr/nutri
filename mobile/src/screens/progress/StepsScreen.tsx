import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const DAILY_GOAL = 10000

const mockStepsData = [
  { date: '17 Mar', day: 'Pzt', steps: 6420 },
  { date: '16 Mar', day: 'Paz', steps: 8350 },
  { date: '15 Mar', day: 'Cmt', steps: 12100 },
  { date: '14 Mar', day: 'Cum', steps: 7800 },
  { date: '13 Mar', day: 'Per', steps: 5400 },
  { date: '12 Mar', day: 'Çar', steps: 9200 },
  { date: '11 Mar', day: 'Sal', steps: 10500 },
]

export default function StepsScreen() {
  const navigation = useNavigation<Nav>()
  const today = mockStepsData[0]
  const pct = Math.min((today.steps / DAILY_GOAL) * 100, 100)
  const avgSteps = Math.round(mockStepsData.reduce((s, d) => s + d.steps, 0) / mockStepsData.length)
  const maxSteps = Math.max(...mockStepsData.map(d => d.steps))
  const distance = (today.steps * 0.0008).toFixed(1) // ~0.8m per step
  const calories = Math.round(today.steps * 0.04) // ~0.04 kcal per step

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Adım Sayıcı" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Main progress */}
        <View className="bg-white rounded-2xl p-6 border border-[#E8F0EC] mb-4 items-center">
          {/* Circular progress (simplified) */}
          <View className="w-40 h-40 rounded-full border-[8px] border-[#F3E8FF] items-center justify-center mb-4">
            <Ionicons name="footsteps-outline" size={28} color="#8B6BAA" />
            <Text className="text-2xl font-extrabold text-[#1A2E23] mt-1">
              {today.steps.toLocaleString('tr-TR')}
            </Text>
            <Text className="text-xs text-[#5A7264]">/ {DAILY_GOAL.toLocaleString('tr-TR')}</Text>
          </View>

          {/* Progress bar */}
          <View className="w-full h-3 bg-[#F3E8FF] rounded-full overflow-hidden">
            <View
              className="h-full bg-[#8B6BAA] rounded-full"
              style={{ width: `${pct}%` }}
            />
          </View>
          <Text className="text-sm text-[#5A7264] mt-2">%{Math.round(pct)} tamamlandı</Text>
        </View>

        {/* Stats row */}
        <View className="flex-row mb-4 gap-2">
          <View className="flex-1 bg-white rounded-xl p-3.5 border border-[#E8F0EC] items-center">
            <Ionicons name="navigate-outline" size={18} color="#8B6BAA" />
            <Text className="text-lg font-bold text-[#1A2E23] mt-1">{distance} km</Text>
            <Text className="text-[10px] text-[#5A7264]">Mesafe</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3.5 border border-[#E8F0EC] items-center">
            <Ionicons name="flame-outline" size={18} color="#E8A040" />
            <Text className="text-lg font-bold text-[#1A2E23] mt-1">{calories}</Text>
            <Text className="text-[10px] text-[#5A7264]">kcal</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3.5 border border-[#E8F0EC] items-center">
            <Ionicons name="stats-chart-outline" size={18} color="#1A5C37" />
            <Text className="text-lg font-bold text-[#1A2E23] mt-1">{avgSteps.toLocaleString('tr-TR')}</Text>
            <Text className="text-[10px] text-[#5A7264]">Ort.</Text>
          </View>
        </View>

        {/* Weekly chart */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-4">Haftalık</Text>
          <View className="flex-row items-end justify-between h-28">
            {mockStepsData.map((d, i) => {
              const barPct = (d.steps / maxSteps) * 100
              const reachedGoal = d.steps >= DAILY_GOAL
              return (
                <View key={i} className="items-center flex-1 mx-0.5">
                  <Text className="text-[9px] text-[#5A7264] mb-1">
                    {(d.steps / 1000).toFixed(1)}k
                  </Text>
                  <View
                    className="w-5 rounded-t-md"
                    style={{
                      height: `${barPct}%`,
                      backgroundColor: reachedGoal ? '#8B6BAA' : '#D4E2DA',
                    }}
                  />
                  <Text className="text-[10px] text-[#5A7264] mt-1 font-semibold">{d.day}</Text>
                </View>
              )
            })}
          </View>
          <View className="flex-row items-center mt-3">
            <View className="h-px flex-1 bg-[#8B6BAA]/30" />
            <Text className="text-[10px] text-[#8B6BAA] mx-2">Hedef: {(DAILY_GOAL / 1000)}k</Text>
            <View className="h-px flex-1 bg-[#8B6BAA]/30" />
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
