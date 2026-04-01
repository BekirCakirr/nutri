import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const mockPhotos = [
  { id: '1', date: '17 Mar 2026', label: 'Önden' },
  { id: '2', date: '17 Mar 2026', label: 'Yandan' },
  { id: '3', date: '10 Mar 2026', label: 'Önden' },
  { id: '4', date: '10 Mar 2026', label: 'Yandan' },
  { id: '5', date: '3 Mar 2026', label: 'Önden' },
  { id: '6', date: '3 Mar 2026', label: 'Arkadan' },
  { id: '7', date: '24 Şub 2026', label: 'Önden' },
  { id: '8', date: '24 Şub 2026', label: 'Yandan' },
]

export default function ProgressPhotosScreen() {
  const navigation = useNavigation<Nav>()

  // Group photos by date
  const grouped: { [date: string]: typeof mockPhotos } = {}
  mockPhotos.forEach(p => {
    if (!grouped[p.date]) grouped[p.date] = []
    grouped[p.date].push(p)
  })

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title="İlerleme Fotoğrafları (Demo)"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity className="p-1">
            <Ionicons name="grid-outline" size={20} color="#1A2E23" />
          </TouchableOpacity>
        }
      />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View className="flex-row mb-4 gap-3">
          <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E8F0EC] items-center">
            <Text className="text-2xl font-extrabold text-[#1A2E23]">{mockPhotos.length}</Text>
            <Text className="text-xs text-[#5A7264]">Toplam Fotoğraf</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E8F0EC] items-center">
            <Text className="text-2xl font-extrabold text-[#1A2E23]">{Object.keys(grouped).length}</Text>
            <Text className="text-xs text-[#5A7264]">Kayıt Günü</Text>
          </View>
        </View>

        {/* Photos grouped by date */}
        {Object.entries(grouped).map(([date, photos]) => (
          <View key={date} className="mb-4">
            <Text className="text-sm font-bold text-[#5A7264] mb-2">{date}</Text>
            <View className="flex-row flex-wrap">
              {photos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  className="w-[48%] mx-[1%] mb-2.5"
                  activeOpacity={0.8}
                >
                  <View className="bg-[#1A2E23] rounded-2xl h-44 items-center justify-center overflow-hidden">
                    <Ionicons name="person-outline" size={40} color="rgba(255,255,255,0.3)" />
                    <Text className="text-white/30 text-sm mt-2">{photo.label}</Text>
                  </View>
                  <Text className="text-xs text-[#5A7264] mt-1 text-center">{photo.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Compare button */}
        <TouchableOpacity
          className="bg-white border-2 border-[#1A5C37] rounded-xl py-4 items-center mb-3"
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-[#1A5C37]">📸 Fotoğrafları Karşılaştır</Text>
        </TouchableOpacity>

        {/* Add photo button */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">+ Yeni Fotoğraf Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
