import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type ExportFormat = { label: string; icon: keyof typeof Ionicons.glyphMap; desc: string }

const formats: ExportFormat[] = [
  { label: 'PDF Rapor', icon: 'document-text-outline', desc: 'Detaylı beslenme raporu' },
  { label: 'CSV Verileri', icon: 'grid-outline', desc: 'Excel uyumlu ham veri' },
  { label: 'JSON', icon: 'code-outline', desc: 'Geliştirici dostu format' },
]

const dataCategories = [
  { name: 'Öğün Kayıtları', count: 245, icon: 'restaurant-outline' as const },
  { name: 'Kilo Geçmişi', count: 90, icon: 'scale-outline' as const },
  { name: 'Su Takibi', count: 180, icon: 'water-outline' as const },
  { name: 'Egzersiz', count: 65, icon: 'barbell-outline' as const },
  { name: 'Uyku', count: 90, icon: 'moon-outline' as const },
  { name: 'İlerleme Fotoğrafları', count: 8, icon: 'camera-outline' as const },
]

export default function DataExportScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedFormat, setSelectedFormat] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5]))

  const toggleCategory = (idx: number) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Veri Dışa Aktarma" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Format selection */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Format Seçin</Text>
        {formats.map((f, i) => (
          <TouchableOpacity
            key={i}
            className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border"
            style={{ borderColor: selectedFormat === i ? '#1A5C37' : '#E8F0EC' }}
            activeOpacity={0.7}
            onPress={() => setSelectedFormat(i)}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: selectedFormat === i ? '#E8F5EC' : '#F8FAF9' }}
            >
              <Ionicons name={f.icon} size={20} color={selectedFormat === i ? '#1A5C37' : '#5A7264'} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{f.label}</Text>
              <Text className="text-xs text-[#5A7264]">{f.desc}</Text>
            </View>
            <View
              className="w-5 h-5 rounded-full border-2 items-center justify-center"
              style={{ borderColor: selectedFormat === i ? '#1A5C37' : '#D4E2DA' }}
            >
              {selectedFormat === i && <View className="w-2.5 h-2.5 rounded-full bg-[#1A5C37]" />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Data categories */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3 mt-4">Verileri Seçin</Text>
        {dataCategories.map((cat, i) => (
          <TouchableOpacity
            key={i}
            className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2 border border-[#E8F0EC]"
            activeOpacity={0.7}
            onPress={() => toggleCategory(i)}
          >
            <View className="w-9 h-9 rounded-full bg-[#E8F5EC] items-center justify-center mr-3">
              <Ionicons name={cat.icon} size={18} color="#1A5C37" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-[#1A2E23]">{cat.name}</Text>
              <Text className="text-xs text-[#5A7264]">{cat.count} kayıt</Text>
            </View>
            <View
              className="w-5 h-5 rounded border items-center justify-center"
              style={{
                backgroundColor: selectedCategories.has(i) ? '#1A5C37' : '#FFFFFF',
                borderColor: selectedCategories.has(i) ? '#1A5C37' : '#D4E2DA',
              }}
            >
              {selectedCategories.has(i) && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Export button */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mt-4 mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">📥 Dışa Aktar</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
