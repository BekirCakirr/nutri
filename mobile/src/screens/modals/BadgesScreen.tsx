import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Badge = {
  id: string
  title: string
  desc: string
  icon: string
  color: string
  earned: boolean
  date?: string
  rarity: 'Yaygın' | 'Nadir' | 'Epik' | 'Efsanevi'
}

const mockBadges: Badge[] = [
  // Earned
  { id: '1', title: 'İlk Öğün', icon: '🍽️', desc: 'İlk öğününü kaydet', color: '#1A5C37', earned: true, date: '15 Oca', rarity: 'Yaygın' },
  { id: '2', title: 'Su Canavarı', icon: '🌊', desc: '7 gün su hedefini tamamla', color: '#4A90B8', earned: true, date: '22 Oca', rarity: 'Yaygın' },
  { id: '3', title: 'Hafta Savaşçısı', icon: '⚔️', desc: '7 gün üst üste kayıt tut', color: '#E8A040', earned: true, date: '1 Şub', rarity: 'Nadir' },
  { id: '4', title: 'Fotoğrafçı', icon: '📸', desc: '10 fotoğraf ile yemek analiz et', color: '#8B6BAA', earned: true, date: '14 Şub', rarity: 'Yaygın' },
  { id: '5', title: 'Erken Kuş', icon: '🌅', desc: '5 gün 08:00 öncesi kahvaltı', color: '#E8A040', earned: true, date: '5 Mar', rarity: 'Nadir' },
  // Not earned
  { id: '6', title: 'Ay Ustası', icon: '🏅', desc: '30 gün üst üste kayıt tut', color: '#C75B4A', earned: false, rarity: 'Epik' },
  { id: '7', title: 'Makro Kralı', icon: '👑', desc: '14 gün makro hedeflerini tamamla', color: '#D4A843', earned: false, rarity: 'Epik' },
  { id: '8', title: 'Dönüşüm', icon: '🦋', desc: 'Hedef kilona ulaş', color: '#4ECDC4', earned: false, rarity: 'Efsanevi' },
  { id: '9', title: 'Sosyal Kahraman', icon: '🤝', desc: '3 kişiyi davet et', color: '#8B6BAA', earned: false, rarity: 'Nadir' },
  { id: '10', title: 'Yıl Savaşçısı', icon: '🏆', desc: '365 gün üst üste kayıt tut', color: '#D4A843', earned: false, rarity: 'Efsanevi' },
]

function rarityColor(r: string) {
  if (r === 'Yaygın') return '#5A7264'
  if (r === 'Nadir') return '#4A7FB5'
  if (r === 'Epik') return '#8B6BAA'
  return '#D4A843'
}

export default function BadgesScreen() {
  const navigation = useNavigation()
  const earnedBadges = mockBadges.filter(b => b.earned)
  const lockedBadges = mockBadges.filter(b => !b.earned)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Rozetler" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View className="bg-[#1A2E23] rounded-2xl p-5 mb-4 flex-row items-center">
          <Text className="text-3xl mr-3">🎖️</Text>
          <View>
            <Text className="text-2xl font-extrabold text-white">{earnedBadges.length}/{mockBadges.length}</Text>
            <Text className="text-xs text-white/50">Rozet Kazanıldı</Text>
          </View>
        </View>

        {/* Earned */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Kazanılan</Text>
        <View className="flex-row flex-wrap mb-4">
          {earnedBadges.map((b) => (
            <View key={b.id} className="w-[48%] mx-[1%] mb-3 bg-white rounded-xl p-4 border border-[#E8F0EC] items-center">
              <Text className="text-3xl mb-2">{b.icon}</Text>
              <Text className="text-sm font-bold text-[#1A2E23] text-center">{b.title}</Text>
              <Text className="text-[10px] text-[#5A7264] text-center mt-0.5">{b.desc}</Text>
              <View className="flex-row items-center mt-2">
                <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: rarityColor(b.rarity) + '20' }}>
                  <Text className="text-[9px] font-bold" style={{ color: rarityColor(b.rarity) }}>{b.rarity}</Text>
                </View>
              </View>
              <Text className="text-[9px] text-[#A8BFB2] mt-1">{b.date}</Text>
            </View>
          ))}
        </View>

        {/* Locked */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Kilitli</Text>
        <View className="flex-row flex-wrap mb-8">
          {lockedBadges.map((b) => (
            <View key={b.id} className="w-[48%] mx-[1%] mb-3 bg-white rounded-xl p-4 border border-[#E8F0EC] items-center opacity-50">
              <Text className="text-3xl mb-2">{b.icon}</Text>
              <Text className="text-sm font-bold text-[#1A2E23] text-center">{b.title}</Text>
              <Text className="text-[10px] text-[#5A7264] text-center mt-0.5">{b.desc}</Text>
              <View className="rounded-full px-2 py-0.5 mt-2" style={{ backgroundColor: rarityColor(b.rarity) + '20' }}>
                <Text className="text-[9px] font-bold" style={{ color: rarityColor(b.rarity) }}>{b.rarity}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}
