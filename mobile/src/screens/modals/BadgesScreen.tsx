import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { useGamification } from '../../hooks'
import { colors } from '../../theme/colors'

const iconMap: Record<string, string> = {
  flame: '🔥', beef: '🥩', scale: '⚖️', camera: '📸', target: '🎯',
  droplets: '💧', waves: '🌊', weight: '⚖️', trophy: '🏆', crown: '👑',
  users: '👥', star: '⭐', default: '🏅',
}

const mockBadges = [
  { id: 'm1', name: 'İlk Adım', description: 'İlk öğününü kaydet', icon: 'flame', xp_reward: 25, earned: true, earned_at: '2026-04-01' },
  { id: 'm2', name: 'Su Ustası', description: '7 gün su hedefini tuttur', icon: 'droplets', xp_reward: 50, earned: true, earned_at: '2026-04-05' },
  { id: 'm3', name: 'Fotoğrafçı', description: '10 yemek fotoğrafı çek', icon: 'camera', xp_reward: 75, earned: true, earned_at: '2026-04-10' },
  { id: 'm4', name: 'Kalori Avcısı', description: '7 gün kalori hedefinde kal', icon: 'target', xp_reward: 100, earned: true, earned_at: '2026-04-12' },
  { id: 'm5', name: 'Protein Şampiyonu', description: '7 gün protein hedefini tuttur', icon: 'beef', xp_reward: 75, earned: false },
  { id: 'm6', name: 'Denge Ustası', description: '7 gün makro dengesini koru', icon: 'scale', xp_reward: 100, earned: false },
  { id: 'm7', name: 'Sosyal Kelebek', description: 'Aile moduna 3 kişi ekle', icon: 'users', xp_reward: 50, earned: false },
  { id: 'm8', name: 'Okyanus', description: '30 gün su hedefini tuttur', icon: 'waves', xp_reward: 150, earned: false },
  { id: 'm9', name: 'Şampiyon', description: '30 gün streak yap', icon: 'trophy', xp_reward: 200, earned: false },
  { id: 'm10', name: 'Efsane', description: 'Tüm rozetleri topla', icon: 'crown', xp_reward: 500, earned: false },
]

export default function BadgesScreen() {
  const navigation = useNavigation()
  const { badges, loadBadges } = useGamification()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBadges().catch(() => {}).finally(() => setLoading(false))
  }, [])

  const backendBadges = badges || []
  const allBadges = backendBadges.length > 0 ? backendBadges : mockBadges
  const earned = allBadges.filter((b: any) => b.earned || b.earned_at)
  const locked = allBadges.filter((b: any) => !b.earned && !b.earned_at)

  if (loading) {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <AppHeader title="Rozetler" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Rozetler" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={{ backgroundColor: '#1A2E23', borderRadius: 16, padding: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 30, marginRight: 12 }}>🎖️</Text>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF' }}>{earned.length}/{allBadges.length}</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Rozet Kazanıldı</Text>
          </View>
        </View>

        {/* Earned */}
        {earned.length > 0 && (
          <>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Kazanılan</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
              {earned.map((b: any) => (
                <View key={b.id} style={{ width: '48%', marginHorizontal: '1%', marginBottom: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ fontSize: 30, marginBottom: 8 }}>{iconMap[b.icon] || iconMap.default}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A2E23', textAlign: 'center' }}>{b.name}</Text>
                  <Text style={{ fontSize: 10, color: '#5A7264', textAlign: 'center', marginTop: 2 }}>{b.description}</Text>
                  <Text style={{ fontSize: 10, color: colors.primary.main, marginTop: 6 }}>+{b.xp_reward || b.xpReward || 0} XP</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Kilitli</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 32 }}>
              {locked.map((b: any) => (
                <View key={b.id} style={{ width: '48%', marginHorizontal: '1%', marginBottom: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center', backgroundColor: '#FFFFFF', opacity: 0.5 }}>
                  <Text style={{ fontSize: 30, marginBottom: 8 }}>{iconMap[b.icon] || iconMap.default}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A2E23', textAlign: 'center' }}>{b.name}</Text>
                  <Text style={{ fontSize: 10, color: '#5A7264', textAlign: 'center', marginTop: 2 }}>{b.description}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {allBadges.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 16, color: '#5A7264' }}>Henüz rozet tanımlanmamış.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  )
}
