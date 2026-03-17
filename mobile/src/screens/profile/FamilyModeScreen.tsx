import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type FamilyMember = {
  id: string
  name: string
  role: string
  emoji: string
  calories: number
}

const mockMembers: FamilyMember[] = [
  { id: '1', name: 'Ahmet (Ben)', role: 'Admin', emoji: '👨', calories: 2200 },
  { id: '2', name: 'Ayşe', role: 'Üye', emoji: '👩', calories: 1800 },
  { id: '3', name: 'Can', role: 'Çocuk', emoji: '👦', calories: 1600 },
]

export default function FamilyModeScreen() {
  const navigation = useNavigation<Nav>()
  const [enabled, setEnabled] = useState(true)
  const [sharedMeals, setSharedMeals] = useState(true)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Aile Modu" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Toggle */}
        <View className="bg-white rounded-2xl p-4 mb-4 border border-[#E8F0EC] flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-[#F3E8FF] items-center justify-center mr-3">
            <Ionicons name="people" size={20} color="#8B6BAA" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-[#1A2E23]">Aile Modu</Text>
            <Text className="text-xs text-[#5A7264]">Ailenizle birlikte beslenme takibi yapın</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: '#D4E2DA', true: '#1A5C37' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Members */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Aile Üyeleri ({mockMembers.length})</Text>
        {mockMembers.map((m) => (
          <View key={m.id} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]">
            <Text className="text-2xl mr-3">{m.emoji}</Text>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{m.name}</Text>
              <View className="flex-row items-center mt-0.5">
                <View className="bg-[#E8F5EC] rounded-full px-2 py-0.5 mr-2">
                  <Text className="text-[10px] font-bold text-[#1A5C37]">{m.role}</Text>
                </View>
                <Text className="text-xs text-[#5A7264]">{m.calories} kcal/gün</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#D4E2DA" />
          </View>
        ))}

        {/* Shared meals toggle */}
        <View className="bg-white rounded-2xl p-4 mt-4 mb-4 border border-[#E8F0EC] flex-row items-center">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-[#1A2E23]">Ortak Öğün Paylaşımı</Text>
            <Text className="text-xs text-[#5A7264]">Aynı yemekler otomatik herkese eklensin</Text>
          </View>
          <Switch
            value={sharedMeals}
            onValueChange={setSharedMeals}
            trackColor={{ false: '#D4E2DA', true: '#1A5C37' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Add member */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">+ Aile Üyesi Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
