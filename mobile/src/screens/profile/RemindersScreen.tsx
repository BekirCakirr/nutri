import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProfileStackParamList>
type Reminder = { id: string; title: string; time: string; days: string; icon: keyof typeof Ionicons.glyphMap; enabled: boolean; color: string }

const mockReminders: Reminder[] = [
  { id: '1', title: 'Kahvaltı', time: '08:00', days: 'Her gün', icon: 'sunny-outline', enabled: true, color: '#E8A040' },
  { id: '2', title: 'Öğle Yemeği', time: '12:30', days: 'Hafta içi', icon: 'restaurant-outline', enabled: true, color: '#1A5C37' },
  { id: '3', title: 'Akşam Yemeği', time: '19:00', days: 'Her gün', icon: 'moon-outline', enabled: true, color: '#4A7FB5' },
  { id: '4', title: 'Su İç', time: 'Her saat', days: 'Her gün', icon: 'water-outline', enabled: true, color: '#4A90B8' },
  { id: '5', title: 'Kilo Kaydı', time: '07:30', days: 'Pazartesi', icon: 'scale-outline', enabled: false, color: '#8B6BAA' },
  { id: '6', title: 'Egzersiz', time: '17:30', days: 'Pzt, Çar, Cum', icon: 'barbell-outline', enabled: true, color: '#C75B4A' },
  { id: '7', title: 'Uyku', time: '22:30', days: 'Her gün', icon: 'bed-outline', enabled: false, color: '#5A7264' },
  { id: '8', title: 'Vitamin', time: '09:00', days: 'Her gün', icon: 'medical-outline', enabled: true, color: '#4ECDC4' },
]

export default function RemindersScreen() {
  const navigation = useNavigation<Nav>()
  const [reminders, setReminders] = useState(mockReminders)
  const toggleReminder = (id: string) => setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  const activeCount = reminders.filter(r => r.enabled).length

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Hatırlatıcılar" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        <View style={st.summaryCard}>
          <View style={st.summaryIcon}><Ionicons name="alarm" size={20} color="#E8A040" /></View>
          <View style={st.summaryContent}>
            <Text style={st.summaryTitle}>{activeCount} Aktif Hatırlatıcı</Text>
            <Text style={st.summaryDesc}>{reminders.length} toplam</Text>
          </View>
        </View>

        {reminders.map((r) => (
          <View key={r.id} style={st.card}>
            <View style={[st.cardIcon, { backgroundColor: r.color + '18' }]}>
              <Ionicons name={r.icon} size={18} color={r.color} />
            </View>
            <View style={st.cardContent}>
              <Text style={st.cardTitle}>{r.title}</Text>
              <Text style={st.cardDesc}>{r.time} · {r.days}</Text>
            </View>
            <Switch value={r.enabled} onValueChange={() => toggleReminder(r.id)} trackColor={{ false: colors.border, true: colors.primary.main }} thumbColor="#FFFFFF" />
          </View>
        ))}

        <TouchableOpacity style={st.primaryBtn} activeOpacity={0.8}>
          <Text style={st.primaryBtnText}>+ Yeni Hatırlatıcı Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E8F0EC', flexDirection: 'row', alignItems: 'center' },
  summaryIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  summaryContent: { flex: 1 },
  summaryTitle: { fontSize: 16, fontWeight: fontWeights.bold, color: colors.text.primary },
  summaryDesc: { fontSize: 12, color: colors.text.secondary },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' },
  cardIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary },
  cardDesc: { fontSize: 12, color: colors.text.secondary },
  primaryBtn: { backgroundColor: colors.primary.main, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 32, shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { fontSize: 16, fontWeight: fontWeights.semibold, color: '#fff' },
})
