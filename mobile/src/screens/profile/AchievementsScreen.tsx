import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type Achievement = {
  id: string
  title: string
  desc: string
  icon: string
  earned: boolean
  date?: string
  progress?: { current: number; total: number }
}

const mockAchievements: Achievement[] = [
  { id: '1', title: 'İlk Adım', desc: 'İlk öğününü kaydet', icon: '🎯', earned: true, date: '15 Oca' },
  { id: '2', title: 'Bir Hafta Serisi', desc: '7 gün üst üste öğün kaydet', icon: '🔥', earned: true, date: '22 Oca' },
  { id: '3', title: 'Su Ustası', desc: '30 gün su hedefini tamamla', icon: '💧', earned: true, date: '14 Şub' },
  { id: '4', title: 'AI Keşifçi', desc: '50 fotoğraf ile yemek analizi yap', icon: '📸', earned: false, progress: { current: 32, total: 50 } },
  { id: '5', title: 'Makro Uzmanı', desc: '14 gün makro hedeflerini tamamla', icon: '📊', earned: false, progress: { current: 8, total: 14 } },
  { id: '6', title: 'Kilo Hedefi', desc: 'Hedef kilona ulaş', icon: '⚖️', earned: false, progress: { current: 1, total: 3 } },
  { id: '7', title: 'Sosyal Kelebek', desc: 'Aile modunu aktif et', icon: '👨‍👩‍👧', earned: false },
  { id: '8', title: 'Bir Ay Serisi', desc: '30 gün üst üste öğün kaydet', icon: '🏆', earned: false, progress: { current: 18, total: 30 } },
  { id: '9', title: 'Erken Kuş', desc: '7 gün 08:00 öncesi kahvaltı kaydet', icon: '🌅', earned: true, date: '5 Mar' },
  { id: '10', title: 'Vitamin Dolu', desc: 'Tüm vitamin hedeflerini 1 günde tamamla', icon: '💊', earned: false },
]

export default function AchievementsScreen() {
  const navigation = useNavigation<Nav>()
  const earned = mockAchievements.filter(a => a.earned).length

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Başarılar" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View className="bg-[#1A2E23] rounded-2xl p-5 mb-4 items-center">
          <Text className="text-4xl mb-2">🏆</Text>
          <Text className="text-2xl font-extrabold text-white">{earned}/{mockAchievements.length}</Text>
          <Text className="text-sm text-white/50">Başarı Kazanıldı</Text>
        </View>

        {/* Earned */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Kazanılan ✅</Text>
        {mockAchievements.filter(a => a.earned).map((a) => (
          <View key={a.id} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]">
            <Text className="text-2xl mr-3">{a.icon}</Text>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{a.title}</Text>
              <Text className="text-xs text-[#5A7264]">{a.desc}</Text>
            </View>
            <Text className="text-xs text-[#1A5C37] font-bold">{a.date}</Text>
          </View>
        ))}

        {/* In progress */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3 mt-4">Devam Eden 🔄</Text>
        {mockAchievements.filter(a => !a.earned).map((a) => (
          <View key={a.id} className="bg-white rounded-xl p-4 mb-2.5 border border-[#E8F0EC]">
            <View className="flex-row items-center mb-2">
              <Text className="text-xl mr-3 opacity-50">{a.icon}</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#1A2E23]">{a.title}</Text>
                <Text className="text-xs text-[#5A7264]">{a.desc}</Text>
              </View>
            </View>
            {a.progress && (
              <>
                <View className="h-2 bg-[#E8F0EC] rounded-full overflow-hidden">
                  <View
                    className="h-full bg-[#E8A040] rounded-full"
                    style={{ width: `${(a.progress.current / a.progress.total) * 100}%` }}
                  />
                </View>
                <Text className="text-xs text-[#5A7264] mt-1">{a.progress.current}/{a.progress.total}</Text>
              </>
            )}
          </View>
        ))}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
