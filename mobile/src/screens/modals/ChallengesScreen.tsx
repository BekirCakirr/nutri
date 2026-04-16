import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { useGamification } from '../../hooks'
import { colors } from '../../theme/colors'

const mockChallenges = [
  { id: 'm1', title: '7 Gün Su Hedefi', description: '7 gün boyunca günlük su hedefini tuttur', challenge_type: 'water_goal', target_value: 7, current_progress: 5, xp_reward: 75, is_completed: false },
  { id: 'm2', title: 'Protein Şampiyonu', description: '5 gün üst üste protein hedefine ulaş', challenge_type: 'protein_goal', target_value: 5, current_progress: 3, xp_reward: 100, is_completed: false },
  { id: 'm3', title: 'Kalori Takipçisi', description: '10 gün boyunca tüm öğünlerini kaydet', challenge_type: 'meal_log', target_value: 10, current_progress: 10, xp_reward: 120, is_completed: true },
  { id: 'm4', title: 'Fotoğraf Ustası', description: '5 farklı yemeğin fotoğrafını çek ve analiz et', challenge_type: 'photo_scan', target_value: 5, current_progress: 2, xp_reward: 80, is_completed: false },
  { id: 'm5', title: 'Erken Kuş', description: '7 gün üst üste kahvaltı kaydı gir', challenge_type: 'breakfast_log', target_value: 7, current_progress: 7, xp_reward: 90, is_completed: true },
  { id: 'm6', title: 'Dengeli Beslenme', description: '3 gün boyunca makro hedeflerinin hepsini tuttur', challenge_type: 'macro_balance', target_value: 3, current_progress: 1, xp_reward: 150, is_completed: false },
]

export default function ChallengesScreen() {
  const navigation = useNavigation()
  const { activeChallenges: challenges, loadChallenges } = useGamification()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChallenges().catch(() => {}).finally(() => setLoading(false))
  }, [])

  const backendChallenges = challenges || []
  const allChallenges = backendChallenges.length > 0 ? backendChallenges : mockChallenges

  if (loading) {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <AppHeader title="Görevler" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Görevler" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {allChallenges.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Ionicons name="flag-outline" size={56} color="#D4E2DA" />
            <Text style={{ fontSize: 16, color: '#5A7264', marginTop: 16 }}>Henüz aktif görev yok.</Text>
          </View>
        ) : (
          allChallenges.map((ch: any) => {
            const progress = ch.current_progress || ch.currentProgress || 0
            const target = ch.target_value || ch.targetValue || 1
            const pct = Math.min(Math.round((progress / target) * 100), 100)
            const completed = ch.is_completed || ch.isCompleted || false

            return (
              <View key={ch.id} style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E8F0EC' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: completed ? '#E8F5EC' : '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Ionicons name={completed ? 'checkmark-circle' : 'flag'} size={20} color={completed ? colors.primary.main : '#E8A040'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23' }}>{ch.title}</Text>
                    <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{ch.description}</Text>
                  </View>
                  <View style={{ backgroundColor: completed ? '#E8F5EC' : '#FEF3C7', borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: completed ? colors.primary.main : '#E8A040' }}>{completed ? 'Tamamlandı' : 'Aktif'}</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={{ height: 8, backgroundColor: '#E8F0EC', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                  <View style={{ height: '100%', backgroundColor: completed ? colors.primary.main : '#E8A040', borderRadius: 4, width: `${pct}%` }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: '#5A7264' }}>{progress}/{target}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary.main }}>+{ch.xp_reward || ch.xpReward || 0} XP</Text>
                </View>
              </View>
            )
          })
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  )
}
