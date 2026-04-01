import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const dailyTarget = 2200

const mockCalorieData = [
  { date: '17 Mar', day: 'Pzt', consumed: 1680, burned: 280 },
  { date: '16 Mar', day: 'Paz', consumed: 2100, burned: 150 },
  { date: '15 Mar', day: 'Cmt', consumed: 2450, burned: 320 },
  { date: '14 Mar', day: 'Cum', consumed: 1920, burned: 210 },
  { date: '13 Mar', day: 'Per', consumed: 1850, burned: 180 },
  { date: '12 Mar', day: 'Çar', consumed: 2050, burned: 350 },
  { date: '11 Mar', day: 'Sal', consumed: 1750, burned: 200 },
  { date: '10 Mar', day: 'Pzt', consumed: 2300, burned: 280 },
  { date: '9 Mar', day: 'Paz', consumed: 1600, burned: 100 },
  { date: '8 Mar', day: 'Cmt', consumed: 2650, burned: 400 },
]

type Period = '7 Gün' | '30 Gün'

export default function CalorieHistoryScreen() {
  const navigation = useNavigation<Nav>()
  const [period, setPeriod] = useState<Period>('7 Gün')

  const data = period === '7 Gün' ? mockCalorieData.slice(0, 7) : mockCalorieData
  const avgConsumed = Math.round(data.reduce((s, d) => s + d.consumed, 0) / data.length)
  const avgBurned = Math.round(data.reduce((s, d) => s + d.burned, 0) / data.length)
  const maxCal = Math.max(...data.map(d => d.consumed))

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Kalori Geçmişi (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Period selector */}
        <View className="flex-row mb-4 gap-2">
          {(['7 Gün', '30 Gün'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              className="flex-1 rounded-xl py-2.5 items-center border"
              style={{
                backgroundColor: period === p ? '#1A5C37' : '#FFFFFF',
                borderColor: period === p ? '#1A5C37' : '#E8F0EC',
              }}
              activeOpacity={0.7}
              onPress={() => setPeriod(p)}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: period === p ? '#FFFFFF' : '#5A7264' }}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Average stats */}
        <View className="flex-row mb-4 gap-3">
          <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E8F0EC] items-center">
            <Ionicons name="flame-outline" size={22} color="#E8A040" />
            <Text className="text-xl font-extrabold text-[#1A2E23] mt-1">{avgConsumed}</Text>
            <Text className="text-xs text-[#5A7264]">Ort. alım (kcal)</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E8F0EC] items-center">
            <Ionicons name="flash-outline" size={22} color="#C75B4A" />
            <Text className="text-xl font-extrabold text-[#1A2E23] mt-1">{avgBurned}</Text>
            <Text className="text-xs text-[#5A7264]">Ort. yakım (kcal)</Text>
          </View>
        </View>

        {/* Bar chart */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-4">Kalori Alımı</Text>
          <View className="flex-row items-end justify-between h-28">
            {data.slice(0, 7).map((d, i) => {
              const pct = (d.consumed / maxCal) * 100
              const overTarget = d.consumed > dailyTarget
              return (
                <View key={i} className="items-center flex-1 mx-0.5">
                  <Text className="text-[9px] text-[#5A7264] mb-1">{d.consumed}</Text>
                  <View
                    className="w-5 rounded-t-md"
                    style={{
                      height: `${pct}%`,
                      backgroundColor: overTarget ? '#EF4444' : '#E8A040',
                    }}
                  />
                  <Text className="text-[10px] text-[#5A7264] mt-1 font-semibold">{d.day}</Text>
                </View>
              )
            })}
          </View>
          <View className="flex-row items-center mt-3">
            <View className="h-px flex-1 bg-[#1A5C37]/30" />
            <Text className="text-[10px] text-[#1A5C37] mx-2">Hedef: {dailyTarget} kcal</Text>
            <View className="h-px flex-1 bg-[#1A5C37]/30" />
          </View>
        </View>

        {/* Daily list */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Günlük Kayıtlar</Text>
        {data.map((d, i) => {
          const net = d.consumed - d.burned
          const overTarget = d.consumed > dailyTarget
          return (
            <View key={i} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2 border border-[#E8F0EC]">
              <View
                className="w-9 h-9 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: overTarget ? '#FEE2E2' : '#E8F5EC' }}
              >
                <Ionicons name="flame-outline" size={16} color={overTarget ? '#EF4444' : '#1A5C37'} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-[#1A2E23]">{d.date} ({d.day})</Text>
                <Text className="text-xs text-[#5A7264]">
                  Alım: {d.consumed} · Yakım: {d.burned} · Net: {net}
                </Text>
              </View>
              <Text
                className="text-sm font-bold"
                style={{ color: overTarget ? '#EF4444' : '#1A5C37' }}
              >
                {d.consumed}
              </Text>
            </View>
          )
        })}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
