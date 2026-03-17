import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const mockExercises = [
  { id: '1', name: 'Yürüyüş', duration: 30, calories: 150, icon: 'walk-outline' as const, time: '08:00' },
  { id: '2', name: 'Koşu', duration: 20, calories: 240, icon: 'bicycle-outline' as const, time: '17:30' },
  { id: '3', name: 'Yoga', duration: 45, calories: 120, icon: 'body-outline' as const, time: '19:00' },
]

const weekData = [
  { day: 'Pzt', minutes: 45 },
  { day: 'Sal', minutes: 30 },
  { day: 'Çar', minutes: 60 },
  { day: 'Per', minutes: 0 },
  { day: 'Cum', minutes: 35 },
  { day: 'Cmt', minutes: 50 },
  { day: 'Paz', minutes: 20 },
]

export default function ExerciseScreen() {
  const navigation = useNavigation<Nav>()
  const totalMin = mockExercises.reduce((s, e) => s + e.duration, 0)
  const totalCal = mockExercises.reduce((s, e) => s + e.calories, 0)
  const maxMin = Math.max(...weekData.map(w => w.minutes))

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

        {/* Weekly chart */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-4">Haftalık Özet</Text>
          <View className="flex-row items-end justify-between h-24">
            {weekData.map((d, i) => {
              const pct = maxMin > 0 ? (d.minutes / maxMin) * 100 : 0
              return (
                <View key={i} className="items-center flex-1 mx-0.5">
                  <Text className="text-[10px] text-[#5A7264] mb-1">{d.minutes > 0 ? `${d.minutes}` : ''}</Text>
                  <View
                    className="w-5 rounded-t-md"
                    style={{
                      height: `${Math.max(pct, 4)}%`,
                      backgroundColor: d.minutes > 0 ? '#C75B4A' : '#E8F0EC',
                    }}
                  />
                  <Text className="text-[10px] text-[#5A7264] mt-1 font-semibold">{d.day}</Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* Today's exercises */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Bugünün Egzersizleri</Text>
        {mockExercises.map((ex) => (
          <View key={ex.id} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]">
            <View className="w-10 h-10 rounded-full bg-[#FEE2E2] items-center justify-center mr-3">
              <Ionicons name={ex.icon} size={20} color="#C75B4A" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{ex.name}</Text>
              <Text className="text-xs text-[#5A7264]">{ex.time} · {ex.duration} dk</Text>
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
