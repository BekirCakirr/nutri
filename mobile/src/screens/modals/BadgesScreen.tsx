import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
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
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={{ backgroundColor: '#1A2E23', borderRadius: 16, padding: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 30, marginRight: 12 }}>🎖️</Text>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF' }}>{earnedBadges.length}/{mockBadges.length}</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Rozet Kazanıldı</Text>
          </View>
        </View>

        {/* Earned */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Kazanılan</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
          {earnedBadges.map((b) => (
            <View key={b.id} style={{ width: '48%', marginBottom: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: mx-[1%] bg-white */>
              <Text style={{ fontSize: 30, marginBottom: 8 }}>{b.icon}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A2E23', textAlign: 'center' }}>{b.title}</Text>
              <Text style={{ fontSize: 10, color: '#5A7264', textAlign: 'center', marginTop: 2 }}>{b.desc}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <View style={{ borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: rarityColor(b.rarity) + '20' }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: rarityColor(b.rarity) }}>{b.rarity}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 9, color: '#A8BFB2', marginTop: 4 }}>{b.date}</Text>
            </View>
          ))}
        </View>

        {/* Locked */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Kilitli</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 32 }}>
          {lockedBadges.map((b) => (
            <View key={b.id} style={{ width: '48%', marginBottom: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center', opacity: 0.5 }} /* TODO: mx-[1%] bg-white */>
              <Text style={{ fontSize: 30, marginBottom: 8 }}>{b.icon}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A2E23', textAlign: 'center' }}>{b.title}</Text>
              <Text style={{ fontSize: 10, color: '#5A7264', textAlign: 'center', marginTop: 2 }}>{b.desc}</Text>
              <View style={{ borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2, marginTop: 8, backgroundColor: rarityColor(b.rarity) + '20' }}>
                <Text style={{ fontSize: 9, fontWeight: '700', color: rarityColor(b.rarity) }}>{b.rarity}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}
