import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProfileStackParamList>

type Achievement = {
  id: string; title: string; desc: string; icon: string; earned: boolean; date?: string
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
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Başarılar" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={st.summaryCard}>
          <Text style={st.summaryEmoji}>🏆</Text>
          <Text style={st.summaryValue}>{earned}/{mockAchievements.length}</Text>
          <Text style={st.summaryLabel}>Başarı Kazanıldı</Text>
        </View>

        {/* Earned */}
        <Text style={st.sectionTitle}>Kazanılan ✅</Text>
        {mockAchievements.filter(a => a.earned).map((a) => (
          <View key={a.id} style={st.earnedCard}>
            <Text style={st.cardEmoji}>{a.icon}</Text>
            <View style={st.cardContent}>
              <Text style={st.cardTitle}>{a.title}</Text>
              <Text style={st.cardDesc}>{a.desc}</Text>
            </View>
            <Text style={st.earnedDate}>{a.date}</Text>
          </View>
        ))}

        {/* In progress */}
        <Text style={[st.sectionTitle, { marginTop: 16 }]}>Devam Eden 🔄</Text>
        {mockAchievements.filter(a => !a.earned).map((a) => (
          <View key={a.id} style={st.progressCard}>
            <View style={st.progressCardTop}>
              <Text style={[st.cardEmoji, { opacity: 0.5 }]}>{a.icon}</Text>
              <View style={st.cardContent}>
                <Text style={st.cardTitle}>{a.title}</Text>
                <Text style={st.cardDesc}>{a.desc}</Text>
              </View>
            </View>
            {a.progress && (
              <>
                <View style={st.progressBarBg}>
                  <View style={[st.progressBarFill, { width: `${(a.progress.current / a.progress.total) * 100}%` }]} />
                </View>
                <Text style={st.progressText}>{a.progress.current}/{a.progress.total}</Text>
              </>
            )}
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  summaryCard: { backgroundColor: '#1A2E23', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  summaryEmoji: { fontSize: 40, marginBottom: 8 },
  summaryValue: { fontSize: 28, fontWeight: fontWeights.extrabold, color: '#fff' },
  summaryLabel: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  sectionTitle: { fontSize: 16, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 12 },
  earnedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' },
  cardEmoji: { fontSize: 24, marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary },
  cardDesc: { fontSize: 12, color: colors.text.secondary },
  earnedDate: { fontSize: 12, fontWeight: fontWeights.bold, color: colors.primary.main },
  progressCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' },
  progressCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  progressBarBg: { height: 8, backgroundColor: '#E8F0EC', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#E8A040', borderRadius: 4 },
  progressText: { fontSize: 12, color: colors.text.secondary, marginTop: 4 },
})
