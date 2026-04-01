import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type Goal = {
  id: string
  title: string
  target: string
  current: number
  total: number
  icon: keyof typeof Ionicons.glyphMap
  color: string
  deadline: string
}

const mockGoals: Goal[] = [
  { id: '1', title: 'Günde 10.000 adım at', target: '10.000 adım/gün', current: 18, total: 30, icon: 'footsteps-outline', color: '#8B6BAA', deadline: '31 Mar' },
  { id: '2', title: '3 kg ver', target: '74.5 → 71.5 kg', current: 1.2, total: 3, icon: 'trending-down-outline', color: '#1A5C37', deadline: '15 Nis' },
  { id: '3', title: 'Haftada 4 gün egzersiz', target: '4 gün/hafta', current: 3, total: 4, icon: 'barbell-outline', color: '#C75B4A', deadline: 'Bu hafta' },
  { id: '4', title: '30 gün şekersiz', target: '30 gün', current: 12, total: 30, icon: 'close-circle-outline', color: '#E8A040', deadline: '5 Nis' },
  { id: '5', title: 'Günde 2.5L su iç', target: '2.5 L/gün', current: 22, total: 30, icon: 'water-outline', color: '#4A90B8', deadline: '31 Mar' },
]

export default function CustomGoalsScreen() {
  const navigation = useNavigation<Nav>()

  const completed = mockGoals.filter(g => g.current >= g.total).length

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Özel Hedefler (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-[#E8F5EC] items-center justify-center mr-3">
              <Ionicons name="flag-outline" size={22} color="#1A5C37" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-[#1A2E23]">{mockGoals.length} Aktif Hedef</Text>
              <Text className="text-xs text-[#5A7264]">{completed} tamamlandı</Text>
            </View>
          </View>
        </View>

        {/* Goals list */}
        {mockGoals.map((goal) => {
          const pct = Math.min((goal.current / goal.total) * 100, 100)
          const isComplete = pct >= 100
          return (
            <View key={goal.id} className="bg-white rounded-xl p-4 mb-3 border border-[#E8F0EC]">
              <View className="flex-row items-center mb-3">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: goal.color + '20' }}
                >
                  <Ionicons name={goal.icon} size={20} color={goal.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-[#1A2E23]">{goal.title}</Text>
                  <Text className="text-xs text-[#5A7264]">{goal.target}</Text>
                </View>
                {isComplete && (
                  <View className="bg-[#E8F5EC] rounded-full p-1.5">
                    <Ionicons name="checkmark" size={14} color="#1A5C37" />
                  </View>
                )}
              </View>
              {/* Progress */}
              <View className="h-2.5 bg-[#E8F0EC] rounded-full overflow-hidden mb-2">
                <View
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: goal.color }}
                />
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-[#5A7264]">%{Math.round(pct)}</Text>
                <Text className="text-xs text-[#5A7264]">⏰ {goal.deadline}</Text>
              </View>
            </View>
          )
        })}

        {/* Add goal */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mt-2 mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">+ Yeni Hedef Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
