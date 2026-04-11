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

export default function BadgesScreen() {
  const navigation = useNavigation()
  const { badges, loadBadges } = useGamification()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBadges().catch(() => {}).finally(() => setLoading(false))
  }, [])

  const allBadges = badges || []
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
