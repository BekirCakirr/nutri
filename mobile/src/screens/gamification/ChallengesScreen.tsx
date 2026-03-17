import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Challenge = {
  id: string
  title: string
  category: 'diet' | 'activity' | 'lifestyle'
  participants: number
  points: number
  status: 'active' | 'upcoming' | 'completed'
  progress?: { current: number; total: number }
  daysLeft?: number
}

const mockChallenges: Challenge[] = [
  { id: '1', title: '7 Gün Şekersiz Yaşam', category: 'diet', participants: 1250, points: 500, status: 'active', progress: { current: 3, total: 7 }, daysLeft: 4 },
  { id: '2', title: '10K Adım Maratonu', category: 'activity', participants: 3400, points: 300, status: 'active', progress: { current: 4, total: 5 }, daysLeft: 1 },
  { id: '3', title: 'Medeniyetten Uzak Hafta Sonu', category: 'lifestyle', participants: 800, points: 400, status: 'upcoming' },
  { id: '4', title: 'Su İçme Alışkanlığı (30 Gün)', category: 'diet', participants: 5200, points: 1000, status: 'completed' },
]

export default function ChallengesScreen() {
  const navigation = useNavigation()

  const activeChallenges = mockChallenges.filter(c => c.status === 'active')
  const upcomingChallenges = mockChallenges.filter(c => c.status === 'upcoming')
  const completedChallenges = mockChallenges.filter(c => c.status === 'completed')

  const catColors = {
    diet: 'bg-emerald-100 text-emerald-700',
    activity: 'bg-blue-100 text-blue-700',
    lifestyle: 'bg-amber-100 text-amber-700'
  }

  const catLabels = {
    diet: 'Diyet',
    activity: 'Egzersiz',
    lifestyle: 'Yaşam Tarzı'
  }

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Meydan Okumalar"
        onBack={() => navigation.goBack()}
        rightIcon="trophy-outline"
        onRightPress={() => navigation.navigate('Leaderboard' as never)}
      />
      
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Active Challenges */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Aktif Katılımların</Text>
        <View className="space-y-4 mb-8">
           {activeChallenges.map(c => (
              <View key={c.id} className="bg-white rounded-2xl p-5 border border-[#E8F0EC]">
                 <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1 pr-2">
                       <View className={`self-start px-2 py-0.5 rounded mb-2 ${catColors[c.category].split(' ')[0]}`}>
                         <Text className={`text-[10px] font-bold uppercase tracking-wide ${catColors[c.category].split(' ')[1]}`}>
                           {catLabels[c.category]}
                         </Text>
                       </View>
                       <Text className="font-bold text-[#1A2E23] text-lg leading-tight">{c.title}</Text>
                    </View>
                    <View className="items-end">
                       <View className="flex-row items-center mb-1">
                          <Ionicons name="flash" size={12} color="#F59E0B" />
                          <Text className="text-xs font-bold text-[#F59E0B] ml-1">{c.points} XP</Text>
                       </View>
                       <View className="flex-row items-center">
                          <Ionicons name="people" size={12} color="#5A7264" />
                          <Text className="text-[10px] text-[#5A7264] ml-1">{c.participants}</Text>
                       </View>
                    </View>
                 </View>

                 {/* Progress Bar */}
                 {c.progress && (
                   <View className="mt-2">
                     <View className="flex-row justify-between items-center mb-1">
                       <Text className="text-xs font-semibold text-[#1A2E23]">{c.progress.current} / {c.progress.total} Gün</Text>
                       <Text className="text-[10px] text-[#EF4444] font-bold">⏳ {c.daysLeft} Gün Kaldı</Text>
                     </View>
                     <View className="h-2.5 bg-[#E8F0EC] rounded-full overflow-hidden">
                       <View 
                         className="h-full bg-[#1A5C37] rounded-full" 
                         style={{ width: `${(c.progress.current / c.progress.total) * 100}%` }}
                       />
                     </View>
                   </View>
                 )}
              </View>
           ))}
        </View>

        {/* Upcoming Challenges */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Yaklaşan Etkinlikler</Text>
        <View className="space-y-4 mb-8">
           {upcomingChallenges.map(c => (
              <View key={c.id} className="bg-white rounded-2xl p-4 border border-[#E8F0EC] flex-row items-center">
                 <View className="flex-1 pr-3">
                    <Text className="font-bold text-[#1A2E23] text-base mb-1">{c.title}</Text>
                    <View className="flex-row items-center">
                       <Ionicons name="flash" size={12} color="#F59E0B" />
                       <Text className="text-xs font-bold text-[#F59E0B] ml-1 mr-3">{c.points} XP</Text>
                       <Text className="text-[10px] text-[#5A7264]">{c.participants} kişi beklemede</Text>
                    </View>
                 </View>
                 <TouchableOpacity className="bg-[#1A5C37] px-4 py-2 rounded-xl">
                    <Text className="text-white font-bold text-xs">Katıl</Text>
                 </TouchableOpacity>
              </View>
           ))}
        </View>

        {/* Completed Challenges */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Tamamlananlar</Text>
        <View className="space-y-3 mb-8">
           {completedChallenges.map(c => (
              <View key={c.id} className="bg-[#F8FAF9] rounded-2xl p-4 border border-[#E8F0EC] flex-row items-center opacity-70">
                 <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3">
                    <Ionicons name="checkmark-done" size={20} color="#10B981" />
                 </View>
                 <View className="flex-1">
                    <Text className="font-bold text-[#1A2E23] text-sm mb-0.5" style={{ textDecorationLine: 'line-through' }}>{c.title}</Text>
                    <Text className="text-[11px] text-[#5A7264]">+{c.points} XP kazanıldı</Text>
                 </View>
              </View>
           ))}
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}
