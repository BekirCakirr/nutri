import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { useAuthStore } from '../../stores/authStore'
import { useDietitian } from '../../hooks'
import apiClient from '../../services/api/client'
import { colors } from '../../theme/colors'

const appointmentTypes = [
  { id: 'online', title: 'Video Görüşme', icon: 'videocam-outline' as const, desc: 'Online görüşme' },
  { id: 'in_person', title: 'Yüz Yüze', icon: 'people-outline' as const, desc: 'Klinikte görüşme' },
]

const dayLabels = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
const dayMap: Record<string, number> = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 }

function generateNext14Days(availableDayNames: string[]) {
  const availableSet = new Set(availableDayNames.map((d) => dayMap[d.toLowerCase()] ?? -1))
  const days: { date: Date; label: string; dayName: string; available: boolean }[] = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const jsDay = d.getDay()
    days.push({
      date: d,
      label: `${d.getDate()} ${d.toLocaleDateString('tr-TR', { month: 'short' })}`,
      dayName: dayLabels[jsDay],
      available: availableSet.has(jsDay),
    })
  }
  return days
}

function generateTimeSlots(durationMin: number): string[] {
  const slots: string[] = []
  for (let h = 9; h < 18; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    if (durationMin <= 30 && h < 17) slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots
}

export default function BookAppointmentScreen() {
  const navigation = useNavigation()
  const user = useAuthStore((s) => s.user)
  const { pairedDietitian, loadPairedDietitian } = useDietitian()

  const [selectedType, setSelectedType] = useState('online')
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPairedDietitian().catch(() => {}).finally(() => setLoading(false))
  }, [loadPairedDietitian])

  const raw = pairedDietitian as Record<string, any> | null
  const availableDays = (raw?.availableDays || raw?.available_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']) as string[]
  const sessionDuration = Number(raw?.sessionDurationMin || raw?.session_duration_min) || 45
  const sessionPrice = Number(raw?.sessionPriceTl || raw?.session_price_tl) || 0
  const dietitianName = raw?.name || `${raw?.first_name || ''} ${raw?.last_name || ''}`.trim() || 'Diyetisyen'

  const days = generateNext14Days(availableDays)
  const timeSlots = generateTimeSlots(sessionDuration)

  const handleBook = useCallback(async () => {
    if (selectedDayIdx === null || !selectedTime) {
      Alert.alert('Eksik Bilgi', 'Lütfen tarih ve saat seçin.')
      return
    }
    const sel = days[selectedDayIdx]
    const dateStr = `${sel.date.getFullYear()}-${String(sel.date.getMonth() + 1).padStart(2, '0')}-${String(sel.date.getDate()).padStart(2, '0')}`

    const [sh, sm] = selectedTime.split(':').map(Number)
    const endTotal = sh * 60 + sm + sessionDuration
    const endTime = `${String(Math.floor(endTotal / 60)).padStart(2, '0')}:${String(endTotal % 60).padStart(2, '0')}`

    setSubmitting(true)
    try {
      await apiClient.post('/appointments', {
        appointmentDate: dateStr,
        startTime: selectedTime,
        endTime,
        type: selectedType,
      })
      Alert.alert('Başarılı', 'Randevunuz oluşturuldu.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ])
    } catch {
      Alert.alert('Hata', 'Randevu oluşturulamadı. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }, [selectedDayIdx, selectedTime, selectedType, days, sessionDuration, navigation])

  if (loading) {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <AppHeader title="Randevu Al" onBack={() => navigation.goBack()} />
        <View style={st.center}><ActivityIndicator size="large" color={colors.primary.main} /></View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Randevu Al" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Dietitian info */}
        <View style={st.dietitianCard}>
          <View style={st.dietitianAvatar}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={st.dietitianName}>{dietitianName}</Text>
            <Text style={st.dietitianMeta}>{sessionDuration} dk seans{sessionPrice > 0 ? ` · ₺${sessionPrice}` : ''}</Text>
          </View>
        </View>

        {/* Type */}
        <Text style={st.sectionTitle}>Görüşme Türü</Text>
        {appointmentTypes.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[st.typeCard, selectedType === t.id && st.typeCardActive]}
            activeOpacity={0.7}
            onPress={() => setSelectedType(t.id)}
          >
            <View style={[st.typeIcon, selectedType === t.id && st.typeIconActive]}>
              <Ionicons name={t.icon} size={20} color={selectedType === t.id ? '#1A5C37' : '#5A7264'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.typeTitle}>{t.title}</Text>
              <Text style={st.typeDesc}>{t.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Date */}
        <Text style={[st.sectionTitle, { marginTop: 16 }]}>Tarih Seçin</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {days.map((d, i) => (
            <TouchableOpacity
              key={i}
              style={[st.dayChip, !d.available && st.dayChipDisabled, selectedDayIdx === i && st.dayChipActive]}
              activeOpacity={0.7}
              disabled={!d.available}
              onPress={() => setSelectedDayIdx(i)}
            >
              <Text style={[st.dayChipDay, selectedDayIdx === i && st.dayChipTextActive]}>{d.dayName}</Text>
              <Text style={[st.dayChipDate, selectedDayIdx === i && st.dayChipTextActive]}>{d.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time */}
        <Text style={st.sectionTitle}>Saat Seçin</Text>
        <View style={st.timeGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[st.timeChip, selectedTime === time && st.timeChipActive]}
              activeOpacity={0.7}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[st.timeText, selectedTime === time && st.timeTextActive]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirm */}
        <TouchableOpacity style={[st.confirmBtn, submitting && { opacity: 0.6 }]} activeOpacity={0.8} disabled={submitting} onPress={handleBook}>
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={st.confirmText}>Randevuyu Onayla</Text>}
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 },
  dietitianCard: { backgroundColor: '#E8F5EC', borderRadius: 16, padding: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  dietitianAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1A5C37', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  dietitianName: { fontSize: 16, fontWeight: '700', color: '#1A2E23' },
  dietitianMeta: { fontSize: 13, color: '#5A7264' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 },
  typeCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 2, backgroundColor: '#FFFFFF', borderColor: '#E8F0EC' },
  typeCardActive: { borderColor: '#1A5C37' },
  typeIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: '#F8FAF9' },
  typeIconActive: { backgroundColor: '#E8F5EC' },
  typeTitle: { fontSize: 16, fontWeight: '600', color: '#1A2E23' },
  typeDesc: { fontSize: 12, color: '#5A7264' },
  dayChip: { alignItems: 'center', marginRight: 10, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, backgroundColor: '#FFFFFF', borderColor: '#E8F0EC' },
  dayChipDisabled: { backgroundColor: '#F0F0F0', opacity: 0.4 },
  dayChipActive: { backgroundColor: '#1A5C37', borderColor: '#1A5C37' },
  dayChipDay: { fontSize: 12, fontWeight: '600', color: '#5A7264' },
  dayChipDate: { fontSize: 14, fontWeight: '700', marginTop: 2, color: '#1A2E23' },
  dayChipTextActive: { color: '#FFFFFF' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  timeChip: { width: '30%', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, backgroundColor: '#FFFFFF', borderColor: '#E8F0EC' },
  timeChipActive: { backgroundColor: '#1A5C37', borderColor: '#1A5C37' },
  timeText: { fontSize: 14, fontWeight: '600', color: '#1A2E23' },
  timeTextActive: { color: '#FFFFFF' },
  confirmBtn: { backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 32, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  confirmText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
})
