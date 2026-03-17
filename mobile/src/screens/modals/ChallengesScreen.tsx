import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Challenge = {
  id: string
  title: string
  desc: string
  icon: string
  duration: string
  participants: number
  progress?: number
  status: 'active' | 'upcoming' | 'completed'
  reward: string
}

const mockChallenges: Challenge[] = [
  { id: '1', title: '7 Gün Su Challenge', icon: '💧', desc: '7 gün boyunca 2.5L su iç', duration: '17-23 Mar', participants: 234, progress: 57, status: 'active', reward: '🏅 Su Ustası rozeti' },
  { id: '2', title: 'Protein Hafta', icon: '💪', desc: '7 gün protein hedefini tamamla', duration: '17-23 Mar', participants: 189, progress: 29, status: 'active', reward: '🥇 Protein Şampiyonu' },
  { id: '3', title: '10K Adım Challenge', icon: '🚶', desc: '5 gün 10.000 adım at', duration: '24-28 Mar', participants: 312, status: 'upcoming', reward: '🎖️ Yürüyüş Kralı' },
  { id: '4', title: 'Sebze Festivali', icon: '🥗', desc: 'Her öğünde en az 2 porsiyon sebze', duration: '24-30 Mar', participants: 156, status: 'upcoming', reward: '🌿 Yeşil Savaşçı' },
  { id: '5', title: 'Erken Kahvaltı', icon: '🌅', desc: '5 gün 08:00 öncesi kahvaltı yap', duration: '10-14 Mar', participants: 198, progress: 100, status: 'completed', reward: '⭐ Erken Kuş' },
]

function statusLabel(s: string) {
  if (s === 'active') return { text: 'Aktif', color: '#1A5C37', bg: '#E8F5EC' }
  if (s === 'upcoming') return { text: 'Yakında', color: '#E8A040', bg: '#FEF3C7' }
  return { text: 'Tamamlandı', color: '#4A7FB5', bg: '#DBEAFE' }
}

export default function ChallengesScreen() {
  const navigation = useNavigation()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Meydan Okumalar" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Active */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">🔥 Aktif Meydan Okumalar</Text>
        {mockChallenges.filter(c => c.status === 'active').map((c) => (
          <View key={c.id} className="bg-white rounded-2xl p-5 mb-3 border border-[#E8F0EC]">
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-3">{c.icon}</Text>
              <View className="flex-1">
                <Text className="text-base font-bold text-[#1A2E23]">{c.title}</Text>
                <Text className="text-xs text-[#5A7264]">{c.desc}</Text>
              </View>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={12} color="#5A7264" />
              <Text className="text-xs text-[#5A7264] ml-1 mr-3">{c.duration}</Text>
              <Ionicons name="people-outline" size={12} color="#5A7264" />
              <Text className="text-xs text-[#5A7264] ml-1">{c.participants} katılımcı</Text>
            </View>
            {c.progress !== undefined && (
              <>
                <View className="h-2.5 bg-[#E8F0EC] rounded-full overflow-hidden mb-1">
                  <View className="h-full bg-[#1A5C37] rounded-full" style={{ width: `${c.progress}%` }} />
                </View>
                <Text className="text-xs text-[#5A7264]">%{c.progress} tamamlandı</Text>
              </>
            )}
            <Text className="text-xs text-[#E8A040] mt-2">🎁 Ödül: {c.reward}</Text>
          </View>
        ))}

        {/* Upcoming */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3 mt-2">📅 Yaklaşan</Text>
        {mockChallenges.filter(c => c.status === 'upcoming').map((c) => {
          const st = statusLabel(c.status)
          return (
            <View key={c.id} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]">
              <Text className="text-2xl mr-3">{c.icon}</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-[#1A2E23]">{c.title}</Text>
                <Text className="text-xs text-[#5A7264]">{c.duration} · {c.participants} kişi</Text>
              </View>
              <TouchableOpacity className="bg-[#E8F5EC] rounded-full px-3 py-1.5" activeOpacity={0.7}>
                <Text className="text-xs font-bold text-[#1A5C37]">Katıl</Text>
              </TouchableOpacity>
            </View>
          )
        })}

        {/* Completed */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3 mt-2">✅ Tamamlanan</Text>
        {mockChallenges.filter(c => c.status === 'completed').map((c) => (
          <View key={c.id} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]">
            <Text className="text-2xl mr-3">{c.icon}</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-[#1A2E23]">{c.title}</Text>
              <Text className="text-xs text-[#1A5C37]">{c.reward}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#1A5C37" />
          </View>
        ))}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
