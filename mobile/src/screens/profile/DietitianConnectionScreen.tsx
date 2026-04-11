import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { useDietitian, useAppointments } from '../../hooks'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProfileStackParamList>

export default function DietitianConnectionScreen() {
  const navigation = useNavigation<Nav>()
  const { pairedDietitian, loadPairedDietitian } = useDietitian()
  const { appointments, loadAppointments } = useAppointments()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([loadPairedDietitian(), loadAppointments()])
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const raw = pairedDietitian as any
  const dietitianName = raw?.name || `${raw?.first_name || ''} ${raw?.last_name || ''}`.trim() || 'Diyetisyen'
  const specialty = (raw?.specializations || []).join(', ') || raw?.title || ''
  const rating = Number(raw?.rating_avg || raw?.rating) || 0
  const ratingCount = Number(raw?.rating_count || raw?.reviewCount) || 0
  const experience = raw?.experience_years ? `${raw.experience_years} yıl` : ''

  const upcomingAppts = (appointments || []).filter((a: any) => a.status === 'scheduled').slice(0, 3)

  if (loading) {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <AppHeader title="Diyetisyen Bağlantısı" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </ScreenWrapper>
    )
  }

  if (!pairedDietitian) {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <AppHeader title="Diyetisyen Bağlantısı" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Ionicons name="people-outline" size={64} color="#D4E2DA" />
          <Text style={{ fontSize: 18, fontWeight: fontWeights.bold, color: colors.text.primary, marginTop: 16 }}>Diyetisyen Bağlı Değil</Text>
          <Text style={{ fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginTop: 8 }}>
            Diyetisyeninizin size verdiği davet kodunu kullanarak eşleşebilirsiniz.
          </Text>
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Diyetisyen Bağlantısı" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Dietitian card */}
        <View style={st.dietitianCard}>
          <View style={st.dietitianRow}>
            <View style={st.dietitianAvatar}>
              <Text style={{ fontSize: 24 }}>👩‍⚕️</Text>
            </View>
            <View style={st.dietitianInfo}>
              <Text style={st.dietitianName}>{dietitianName}</Text>
              {specialty ? <Text style={st.dietitianSpec}>{specialty}</Text> : null}
              <View style={st.ratingRow}>
                {rating > 0 && (
                  <>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={st.ratingVal}>{rating}</Text>
                    <Text style={st.ratingCount}>({ratingCount})</Text>
                  </>
                )}
                {experience ? <Text style={st.ratingCount}> · {experience}</Text> : null}
              </View>
            </View>
          </View>
          <View style={st.connectedBadge}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary.main} />
            <Text style={st.connectedText}>Bağlı</Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={st.actionsGrid}>
          {[
            { title: 'Mesaj Gönder', icon: 'chatbubble-outline' as const, desc: 'Diyetisyeninize yazın', onPress: () => { navigation.getParent()?.navigate('HomeTab', { screen: 'ConversationList' }) } },
            { title: 'Randevu Al', icon: 'calendar-outline' as const, desc: 'Online randevu', onPress: () => { navigation.getParent()?.getParent()?.navigate('BookAppointment', {}) } },
          ].map((f, i) => (
            <TouchableOpacity key={i} style={st.actionCard} activeOpacity={0.7} onPress={f.onPress}>
              <View style={st.actionIcon}>
                <Ionicons name={f.icon} size={20} color={colors.primary.main} />
              </View>
              <Text style={st.actionTitle}>{f.title}</Text>
              <Text style={st.actionDesc}>{f.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming appointments */}
        {upcomingAppts.length > 0 && (
          <>
            <Text style={st.sectionTitle}>Yaklaşan Randevular</Text>
            {upcomingAppts.map((apt: any, i: number) => (
              <View key={i} style={st.aptCard}>
                <View style={st.aptIcon}>
                  <Ionicons name="calendar-outline" size={18} color="#4A7FB5" />
                </View>
                <View style={st.aptContent}>
                  <Text style={st.aptDate}>{new Date(apt.appointment_date || apt.appointmentDate).toLocaleDateString('tr-TR')} — {apt.start_time || apt.startTime}</Text>
                  <Text style={st.aptType}>{apt.type === 'online' ? 'Video Görüşme' : 'Yüz Yüze'}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  dietitianCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 },
  dietitianRow: { flexDirection: 'row', alignItems: 'center' },
  dietitianAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(78,205,196,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  dietitianInfo: { flex: 1 },
  dietitianName: { fontSize: 18, fontWeight: fontWeights.bold, color: colors.text.primary },
  dietitianSpec: { fontSize: 12, color: colors.text.secondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingVal: { fontSize: 12, fontWeight: fontWeights.bold, color: colors.text.primary, marginLeft: 2 },
  ratingCount: { fontSize: 12, color: colors.text.secondary, marginLeft: 4 },
  connectedBadge: { backgroundColor: colors.primary[50], borderRadius: 12, padding: 12, marginTop: 16, flexDirection: 'row', alignItems: 'center' },
  connectedText: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.primary.main, marginLeft: 8 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  actionCard: { width: '48%', marginHorizontal: '1%', marginBottom: 10, backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8F0EC' },
  actionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.primary },
  actionDesc: { fontSize: 12, color: colors.text.secondary, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 12 },
  aptCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' },
  aptIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  aptContent: { flex: 1 },
  aptDate: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.primary },
  aptType: { fontSize: 12, color: colors.text.secondary },
})
