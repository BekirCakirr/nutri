import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Challenge = {
  id: string
  title: string
  desc: string
  icon: string
  duration: string
  participants: number
  progress?: number
  status: 'active' | 'upcoming' | 'completed'
  reward: string
}

const mockChallenges: Challenge[] = [
  { id: '1', title: '7 Gün Su Challenge', icon: '💧', desc: '7 gün boyunca 2.5L su iç', duration: '17-23 Mar', participants: 234, progress: 57, status: 'active', reward: '🏅 Su Ustası rozeti' },
  { id: '2', title: 'Protein Hafta', icon: '💪', desc: '7 gün protein hedefini tamamla', duration: '17-23 Mar', participants: 189, progress: 29, status: 'active', reward: '🥇 Protein Şampiyonu' },
  { id: '3', title: '10K Adım Challenge', icon: '🚶', desc: '5 gün 10.000 adım at', duration: '24-28 Mar', participants: 312, status: 'upcoming', reward: '🎖️ Yürüyüş Kralı' },
  { id: '4', title: 'Sebze Festivali', icon: '🥗', desc: 'Her öğünde en az 2 porsiyon sebze', duration: '24-30 Mar', participants: 156, status: 'upcoming', reward: '🌿 Yeşil Savaşçı' },
  { id: '5', title: 'Erken Kahvaltı', icon: '🌅', desc: '5 gün 08:00 öncesi kahvaltı yap', duration: '10-14 Mar', participants: 198, progress: 100, status: 'completed', reward: '⭐ Erken Kuş' },
]

function statusLabel(s: string) {
  if (s === 'active') return { text: 'Aktif', color: '#1A5C37', bg: '#E8F5EC' }
  if (s === 'upcoming') return { text: 'Yakında', color: '#E8A040', bg: '#FEF3C7' }
  return { text: 'Tamamlandı', color: '#4A7FB5', bg: '#DBEAFE' }
}

export default function ChallengesScreen() {
  const navigation = useNavigation()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Meydan Okumalar" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Active */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>🔥 Aktif Meydan Okumalar</Text>
        {mockChallenges.filter(c => c.status === 'active').map((c) => (
          <View key={c.id} style={{ borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 24, marginRight: 12 }}>{c.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23' }}>{c.title}</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>{c.desc}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="calendar-outline" size={12} color="#5A7264" />
              <Text style={{ fontSize: 12, color: '#5A7264', marginLeft: 4, marginRight: 12 }}>{c.duration}</Text>
              <Ionicons name="people-outline" size={12} color="#5A7264" />
              <Text style={{ fontSize: 12, color: '#5A7264', marginLeft: 4 }}>{c.participants} katılımcı</Text>
            </View>
            {c.progress !== undefined && (
              <>
                <View style={{ backgroundColor: '#E8F0EC', borderRadius: 9999, overflow: 'hidden', marginBottom: 4 }} /* TODO: h-2.5 */>
                  <View style={{ height: '100%', backgroundColor: '#1A5C37', borderRadius: 9999, width: `${c.progress}%` }} />
                </View>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>%{c.progress} tamamlandı</Text>
              </>
            )}
            <Text style={{ fontSize: 12, color: '#E8A040', marginTop: 8 }}>🎁 Ödül: {c.reward}</Text>
          </View>
        ))}

        {/* Upcoming */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12, marginTop: 8 }}>📅 Yaklaşan</Text>
        {mockChallenges.filter(c => c.status === 'upcoming').map((c) => {
          const st = statusLabel(c.status)
          return (
            <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
              <Text style={{ fontSize: 24, marginRight: 12 }}>{c.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23' }}>{c.title}</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>{c.duration} · {c.participants} kişi</Text>
              </View>
              <TouchableOpacity style={{ backgroundColor: '#E8F5EC', borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 6 }}activeOpacity={0.7}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#1A5C37' }}>Katıl</Text>
              </TouchableOpacity>
            </View>
          )
        })}

        {/* Completed */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12, marginTop: 8 }}>✅ Tamamlanan</Text>
        {mockChallenges.filter(c => c.status === 'completed').map((c) => (
          <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
            <Text style={{ fontSize: 24, marginRight: 12 }}>{c.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23' }}>{c.title}</Text>
              <Text style={{ fontSize: 12, color: '#1A5C37' }}>{c.reward}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#1A5C37" />
          </View>
        ))}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
