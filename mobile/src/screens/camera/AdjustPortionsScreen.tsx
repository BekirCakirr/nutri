import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

const mockItems = [
  { id: '1', name: 'Tavuk Göğsü (Izgara)', portion: 150, unit: 'g', calories: 165 },
  { id: '2', name: 'Pilav', portion: 200, unit: 'g', calories: 206 },
  { id: '3', name: 'Yeşil Salata', portion: 1, unit: 'kase', calories: 20 },
]

export default function AdjustPortionsScreen() {
  const navigation = useNavigation()
  const [items, setItems] = useState(mockItems)

  const adjustPortion = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const newPortion = Math.max(item.unit === 'g' ? 25 : 0.5, item.portion + delta)
        const ratio = newPortion / item.portion
        return { ...item, portion: newPortion, calories: Math.round(item.calories * ratio) }
      })
    )
  }

  const totalCal = items.reduce((s, i) => s + i.calories, 0)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Porsiyon Ayarla" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-[#E8F5EC] rounded-2xl p-4 mb-6 items-center border border-[#C8E6CF]/40">
          <Text className="text-sm font-medium text-[#5A7264]">Toplam</Text>
          <Text className="text-4xl font-extrabold text-[#1A5C37]">{totalCal}</Text>
          <Text className="text-sm text-[#5A7264]">kcal</Text>
        </View>

        {items.map((item) => {
          const step = item.unit === 'g' ? 25 : 0.5
          return (
            <View key={item.id} className="bg-white rounded-2xl p-4 mb-3 border border-[#E8F0EC]">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-base font-semibold text-[#1A2E23] flex-1">{item.name}</Text>
                <Text className="text-base font-bold text-[#1A5C37]">{item.calories} kcal</Text>
              </View>
              <View className="flex-row items-center justify-center gap-5">
                <TouchableOpacity
                  onPress={() => adjustPortion(item.id, -step)}
                  className="w-11 h-11 rounded-full bg-[#FEE2E2] items-center justify-center"
                >
                  <Ionicons name="remove" size={22} color="#EF4444" />
                </TouchableOpacity>
                <View className="bg-[#F0F5F2] rounded-xl px-5 py-2 min-w-[100px] items-center">
                  <Text className="text-xl font-bold text-[#1A2E23]">
                    {item.portion}{item.unit}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => adjustPortion(item.id, step)}
                  className="w-11 h-11 rounded-full bg-[#E8F5EC] items-center justify-center"
                >
                  <Ionicons name="add" size={22} color="#1A5C37" />
                </TouchableOpacity>
              </View>
            </View>
          )
        })}

        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mt-4 mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          onPress={() => navigation.goBack()}
        >
          <Text className="text-base font-semibold text-white">Onayla ve Kaydet ✅</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
