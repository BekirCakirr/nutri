import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type Goal = {
  id: string
  title: string
  category: string
  value: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
  editable: boolean
}

const mockGoals: Goal[] = [
  { id: '1', title: 'Hedef Kilo', category: 'Vücut', value: '70 kg', icon: 'scale-outline', color: '#1A5C37', editable: true },
  { id: '2', title: 'Günlük Kalori', category: 'Beslenme', value: '2.200 kcal', icon: 'flame-outline', color: '#E8A040', editable: true },
  { id: '3', title: 'Protein Hedefi', category: 'Beslenme', value: '120g / gün', icon: 'nutrition-outline', color: '#C75B4A', editable: true },
  { id: '4', title: 'Karbonhidrat Hedefi', category: 'Beslenme', value: '275g / gün', icon: 'leaf-outline', color: '#4A7FB5', editable: true },
  { id: '5', title: 'Yağ Hedefi', category: 'Beslenme', value: '73g / gün', icon: 'water-outline', color: '#D4A843', editable: true },
  { id: '6', title: 'Su Hedefi', category: 'Sağlık', value: '2.5L / gün', icon: 'water', color: '#4A90B8', editable: true },
  { id: '7', title: 'Adım Hedefi', category: 'Aktivite', value: '10.000 / gün', icon: 'footsteps-outline', color: '#8B6BAA', editable: true },
  { id: '8', title: 'Uyku Hedefi', category: 'Sağlık', value: '7-8 saat', icon: 'moon-outline', color: '#4A7FB5', editable: true },
  { id: '9', title: 'Egzersiz Hedefi', category: 'Aktivite', value: '4 gün / hafta', icon: 'barbell-outline', color: '#C75B4A', editable: true },
]

// Group by category
const grouped: Record<string, Goal[]> = {}
mockGoals.forEach(g => {
  if (!grouped[g.category]) grouped[g.category] = []
  grouped[g.category].push(g)
})

export default function GoalsScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Hedeflerim" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Info */}
        <View className="bg-[#E8F5EC] rounded-2xl p-4 mb-4 flex-row items-center border border-[#C8E6CF]/40">
          <Ionicons name="information-circle-outline" size={20} color="#1A5C37" />
          <Text className="flex-1 text-xs text-[#5A7264] ml-2">
            Hedefleriniz yapay zeka önerilerine göre otomatik hesaplanır. Dilediğiniz zaman düzenleyebilirsiniz.
          </Text>
        </View>

        {/* Grouped goals */}
        {Object.entries(grouped).map(([category, goals]) => (
          <View key={category} className="mb-4">
            <Text className="text-xs font-bold text-[#5A7264] uppercase tracking-wide mb-2 ml-1">
              {category}
            </Text>
            <View className="bg-white rounded-2xl border border-[#E8F0EC] overflow-hidden">
              {goals.map((goal, i) => (
                <TouchableOpacity
                  key={goal.id}
                  className="flex-row items-center px-4 py-3.5 border-b border-[#E8F0EC]"
                  style={i === goals.length - 1 ? { borderBottomWidth: 0 } : {}}
                  activeOpacity={0.6}
                >
                  <View
                    className="w-9 h-9 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: goal.color + '18' }}
                  >
                    <Ionicons name={goal.icon} size={18} color={goal.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-semibold text-[#1A2E23]">{goal.title}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-sm font-bold text-[#1A2E23] mr-1">{goal.value}</Text>
                    <Ionicons name="pencil-outline" size={14} color="#D4E2DA" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* AI recalculate */}
        <TouchableOpacity
          className="bg-white border-2 border-[#1A5C37] rounded-xl py-4 items-center mb-3"
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-[#1A5C37]">🤖 AI ile Yeniden Hesapla</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">+ Özel Hedef Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
