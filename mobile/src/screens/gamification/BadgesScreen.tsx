import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Badge = {
  id: string
  title: string
  description: string
  icon: string
  color: string
  achieved: boolean
  progress?: { current: number; total: number }
}

const mockBadges: Badge[] = [
  { id: '1', title: 'İlk Adım', description: 'Profilini tamamen doldurdun', icon: 'person-outline', color: '#4A7FB5', achieved: true },
  { id: '2', title: 'Su Canavarı', description: 'Art arda 7 gün su hedefini tutturdun', icon: 'water-outline', color: '#4ECDC4', achieved: true },
  { id: '3', title: 'Kusursuz Hafta', description: 'Tüm öğünlerini bir hafta boyunca kaydettin', icon: 'restaurant-outline', color: '#E8A040', achieved: true },
  { id: '4', title: 'Adım Şampiyonu', description: 'Günde 15.000 adım attın', icon: 'footsteps-outline', color: '#8B6BAA', achieved: true },
  { id: '5', title: 'Erken Kuş', description: '7 gün boyunca sabah 8\'den önce kahvaltı yaptın', icon: 'sunny-outline', color: '#F59E0B', achieved: false, progress: { current: 5, total: 7 } },
  { id: '6', title: 'Şeker Düşmanı', description: '10 gün boyunca sıfır ilave şeker', icon: 'warning-outline', color: '#EF4444', achieved: false, progress: { current: 2, total: 10 } },
  { id: '7', title: 'Demir İrade', description: 'Hedef kaloriyi 30 gün boyunca aşmadın', icon: 'shield-checkmark-outline', color: '#1A5C37', achieved: false, progress: { current: 14, total: 30 } },
]

export default function BadgesScreen() {
  const navigation = useNavigation()
  const achievedBadges = mockBadges.filter(b => b.achieved)
  const lockedBadges = mockBadges.filter(b => !b.achieved)

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Rozetlerim"
        subtitle={`${achievedBadges.length} Kazanılan Rozet`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Header Summary */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-[#E8F0EC] items-center">
           <View className="w-16 h-16 rounded-full bg-amber-100 items-center justify-center mb-3">
             <Ionicons name="trophy" size={32} color="#F59E0B" />
           </View>
           <Text className="font-bold text-2xl text-[#1A2E23]">{achievedBadges.length}</Text>
           <Text className="text-[#5A7264] text-xs uppercase tracking-widest mt-1">Kilit Açıldı</Text>
        </View>

        {/* Achieved Badges */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Kazanılanlar</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {achievedBadges.map(badge => (
             <View key={badge.id} className="w-[48%] bg-white border border-[#E8F0EC] rounded-2xl p-4 mb-4 items-center">
               <View className="w-14 h-14 rounded-full items-center justify-center mb-3" style={{ backgroundColor: badge.color + '20' }}>
                 <Ionicons name={badge.icon as any} size={28} color={badge.color} />
               </View>
               <Text className="font-bold text-[#1A2E23] text-[13px] text-center mb-1">{badge.title}</Text>
               <Text className="text-[10px] text-[#5A7264] text-center">{badge.description}</Text>
             </View>
          ))}
        </View>

        {/* Locked Badges */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Kilitli Rozetler</Text>
        <View className="space-y-3 mb-8">
          {lockedBadges.map(badge => (
            <View key={badge.id} className="bg-white border border-[#E8F0EC] rounded-2xl p-4 flex-row items-center opacity-70">
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-4">
                 <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
              </View>
              <View className="flex-1">
                 <Text className="font-bold text-[#1A2E23] text-sm mb-0.5">{badge.title}</Text>
                 <Text className="text-[11px] text-[#5A7264] mb-2">{badge.description}</Text>
                 
                 {badge.progress && (
                   <View className="w-full">
                     <View className="h-1.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                       <View 
                         className="h-full bg-gray-400 rounded-full" 
                         style={{ width: `${(badge.progress.current / badge.progress.total) * 100}%` }} 
                       />
                     </View>
                     <Text className="text-[10px] text-gray-500 mt-1 text-right">
                       {badge.progress.current} / {badge.progress.total}
                     </Text>
                   </View>
                 )}
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}
