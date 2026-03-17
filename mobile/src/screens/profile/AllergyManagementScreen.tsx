import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type Allergy = {
  id: string
  name: string
  severity: 'Yüksek' | 'Orta' | 'Düşük'
  icon: string
}

const mockAllergies: Allergy[] = [
  { id: '1', name: 'Fıstık', severity: 'Yüksek', icon: '🥜' },
  { id: '2', name: 'Süt Ürünleri', severity: 'Orta', icon: '🥛' },
  { id: '3', name: 'Glüten', severity: 'Düşük', icon: '🌾' },
  { id: '4', name: 'Yumurta', severity: 'Orta', icon: '🥚' },
]

const commonAllergens = [
  { name: 'Kabuklu Deniz Ürünleri', icon: '🦐' },
  { name: 'Soya', icon: '🫘' },
  { name: 'Balık', icon: '🐟' },
  { name: 'Buğday', icon: '🌾' },
  { name: 'Susam', icon: '🫘' },
  { name: 'Hardal', icon: '🟡' },
]

function severityColor(s: string) {
  if (s === 'Yüksek') return { color: '#EF4444', bg: '#FEE2E2' }
  if (s === 'Orta') return { color: '#E8A040', bg: '#FEF3C7' }
  return { color: '#1A5C37', bg: '#E8F5EC' }
}

export default function AllergyManagementScreen() {
  const navigation = useNavigation<Nav>()
  const [allergies, setAllergies] = useState(mockAllergies)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Alerji Yönetimi" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Info card */}
        <View className="bg-[#FEF3C7] rounded-2xl p-4 mb-4 flex-row items-center border border-[#F59E0B]/20">
          <Ionicons name="warning-outline" size={22} color="#E8A040" />
          <View className="flex-1 ml-3">
            <Text className="text-sm font-bold text-[#1A2E23]">Alerji Uyarısı Aktif</Text>
            <Text className="text-xs text-[#5A7264]">Yemek eklerken alerjen içeren besinler işaretlenecek.</Text>
          </View>
        </View>

        {/* Current allergies */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Alerjilerim ({allergies.length})</Text>
        {allergies.map((a) => {
          const sc = severityColor(a.severity)
          return (
            <View key={a.id} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]">
              <Text className="text-xl mr-3">{a.icon}</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#1A2E23]">{a.name}</Text>
                <View className="flex-row items-center mt-0.5">
                  <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: sc.bg }}>
                    <Text className="text-[10px] font-bold" style={{ color: sc.color }}>{a.severity}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="p-2">
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )
        })}

        {/* Common allergens to add */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3 mt-4">Yaygın Alerjenler</Text>
        <View className="flex-row flex-wrap mb-4">
          {commonAllergens.map((a, i) => (
            <TouchableOpacity
              key={i}
              className="bg-white rounded-xl px-3.5 py-2.5 mr-2 mb-2 border border-[#E8F0EC] flex-row items-center"
              activeOpacity={0.7}
            >
              <Text className="mr-1.5">{a.icon}</Text>
              <Text className="text-sm text-[#1A2E23]">{a.name}</Text>
              <Ionicons name="add" size={16} color="#1A5C37" className="ml-1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Add custom */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">+ Özel Alerjen Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
