import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProfileStackParamList>

const mockDietitian = {
  name: 'Dr. Elif Özkan',
  specialty: 'Sporcu Beslenmesi & Kilo Yönetimi',
  rating: 4.9,
  reviews: 128,
  experience: '12 yıl',
  nextAppointment: '20 Mar 2026, 14:00',
  connected: true,
}

const upcomingAppointments = [
  { date: '20 Mar', time: '14:00', type: 'Video Görüşme', status: 'Onaylandı' },
  { date: '3 Nis', time: '10:30', type: 'Kontrol', status: 'Bekliyor' },
]

const features = [
  { title: 'Mesaj Gönder', icon: 'chatbubble-outline' as const, desc: 'Diyetisyeninize yazın' },
  { title: 'Randevu Al', icon: 'calendar-outline' as const, desc: 'Online randevu oluşturun' },
  { title: 'Plan İste', icon: 'document-text-outline' as const, desc: 'Kişisel beslenme planı' },
  { title: 'Rapor Paylaş', icon: 'share-outline' as const, desc: 'Verilerinizi paylaşın' },
]

export default function DietitianConnectionScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Diyetisyen Bağlantısı" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Dietitian card */}
        <View style={st.dietitianCard}>
          <View style={st.dietitianRow}>
            <View style={st.dietitianAvatar}>
              <Text style={{ fontSize: 24 }}>👩‍⚕️</Text>
            </View>
            <View style={st.dietitianInfo}>
              <Text style={st.dietitianName}>{mockDietitian.name}</Text>
              <Text style={st.dietitianSpec}>{mockDietitian.specialty}</Text>
              <View style={st.ratingRow}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={st.ratingVal}>{mockDietitian.rating}</Text>
                <Text style={st.ratingCount}>({mockDietitian.reviews} değerlendirme)</Text>
                <Text style={st.ratingCount}> · {mockDietitian.experience}</Text>
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
          {features.map((f, i) => (
            <TouchableOpacity key={i} style={st.actionCard} activeOpacity={0.7}>
              <View style={st.actionIcon}>
                <Ionicons name={f.icon} size={20} color={colors.primary.main} />
              </View>
              <Text style={st.actionTitle}>{f.title}</Text>
              <Text style={st.actionDesc}>{f.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming appointments */}
        <Text style={st.sectionTitle}>Yaklaşan Randevular</Text>
        {upcomingAppointments.map((apt, i) => (
          <View key={i} style={st.aptCard}>
            <View style={st.aptIcon}>
              <Ionicons name="calendar-outline" size={18} color="#4A7FB5" />
            </View>
            <View style={st.aptContent}>
              <Text style={st.aptDate}>{apt.date} — {apt.time}</Text>
              <Text style={st.aptType}>{apt.type}</Text>
            </View>
            <View style={[st.statusBadge, { backgroundColor: apt.status === 'Onaylandı' ? '#E8F5EC' : '#FEF3C7' }]}>
              <Text style={[st.statusText, { color: apt.status === 'Onaylandı' ? colors.primary.main : '#E8A040' }]}>{apt.status}</Text>
            </View>
          </View>
        ))}

        {/* Change dietitian */}
        <TouchableOpacity style={st.changeDietitian} activeOpacity={0.6}>
          <Text style={st.changeDietitianText}>Diyetisyen Değiştir</Text>
        </TouchableOpacity>
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
  statusBadge: { borderRadius: 100, paddingHorizontal: 10, paddingVertical: 2 },
  statusText: { fontSize: 12, fontWeight: fontWeights.bold },
  changeDietitian: { alignItems: 'center', marginTop: 16, marginBottom: 32 },
  changeDietitianText: { fontSize: 14, color: colors.text.secondary },
})
