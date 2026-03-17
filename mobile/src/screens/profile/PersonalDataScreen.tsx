import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type DataField = {
  label: string
  value: string
  icon: keyof typeof Ionicons.glyphMap
  editable: boolean
}

const personalData: { category: string; fields: DataField[] }[] = [
  {
    category: 'Fiziksel Bilgiler',
    fields: [
      { label: 'Boy', value: '178 cm', icon: 'resize-outline', editable: true },
      { label: 'Kilo', value: '74.5 kg', icon: 'scale-outline', editable: true },
      { label: 'Yaş', value: '30', icon: 'calendar-outline', editable: false },
      { label: 'Cinsiyet', value: 'Erkek', icon: 'person-outline', editable: true },
      { label: 'Vücut Kitle İndeksi', value: '23.5 (Normal)', icon: 'body-outline', editable: false },
    ],
  },
  {
    category: 'Aktivite & Yaşam Tarzı',
    fields: [
      { label: 'Aktivite Seviyesi', value: 'Orta Aktif', icon: 'walk-outline', editable: true },
      { label: 'Meslek Türü', value: 'Ofis / Masa Başı', icon: 'briefcase-outline', editable: true },
      { label: 'Uyku Düzeni', value: '23:00 - 07:00', icon: 'moon-outline', editable: true },
    ],
  },
  {
    category: 'Beslenme Tercihleri',
    fields: [
      { label: 'Diyet Türü', value: 'Standart', icon: 'restaurant-outline', editable: true },
      { label: 'Öğün Sayısı', value: '3 Ana + 2 Ara', icon: 'time-outline', editable: true },
      { label: 'Hedef', value: 'Kilo Verme', icon: 'trending-down-outline', editable: true },
    ],
  },
  {
    category: 'Metabolik Bilgiler',
    fields: [
      { label: 'Bazal Metabolizma (BMR)', value: '1.720 kcal', icon: 'flash-outline', editable: false },
      { label: 'Günlük Kalori İhtiyacı (TDEE)', value: '2.200 kcal', icon: 'flame-outline', editable: false },
    ],
  },
]

export default function PersonalDataScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Kişisel Veriler" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4" showsVerticalScrollIndicator={false}>
        {personalData.map((section, si) => (
          <View key={si} className="mb-4">
            <Text className="text-xs font-bold text-[#5A7264] uppercase tracking-wide mb-2 ml-1">
              {section.category}
            </Text>
            <View className="bg-white rounded-2xl border border-[#E8F0EC] overflow-hidden">
              {section.fields.map((field, fi) => (
                <TouchableOpacity
                  key={fi}
                  className="flex-row items-center px-4 py-3.5 border-b border-[#E8F0EC]"
                  style={fi === section.fields.length - 1 ? { borderBottomWidth: 0 } : {}}
                  activeOpacity={field.editable ? 0.6 : 1}
                  disabled={!field.editable}
                >
                  <View className="w-9 h-9 rounded-full bg-[#E8F5EC] items-center justify-center mr-3">
                    <Ionicons name={field.icon} size={16} color="#1A5C37" />
                  </View>
                  <Text className="flex-1 text-[15px] text-[#5A7264]">{field.label}</Text>
                  <Text className="text-[15px] font-semibold text-[#1A2E23] mr-1">{field.value}</Text>
                  {field.editable && <Ionicons name="pencil-outline" size={14} color="#D4E2DA" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Recalculate */}
        <TouchableOpacity
          className="bg-white border-2 border-[#1A5C37] rounded-xl py-4 items-center mb-8"
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-[#1A5C37]">🤖 Metabolizmayı Yeniden Hesapla</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
