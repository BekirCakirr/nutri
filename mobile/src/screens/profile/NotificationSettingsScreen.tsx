import React, { useState } from 'react'
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProfileStackParamList>
type NotifSetting = { title: string; desc: string; icon: keyof typeof Ionicons.glyphMap; key: string; default: boolean }

const notifSettings: NotifSetting[] = [
  { title: 'Öğün Hatırlatıcı', desc: 'Kahvaltı, öğle ve akşam yemeği hatırlatmaları', icon: 'restaurant-outline', key: 'meals', default: true },
  { title: 'Su Hatırlatıcı', desc: 'Saatte bir su içme hatırlatması', icon: 'water-outline', key: 'water', default: true },
  { title: 'Egzersiz Hatırlatıcı', desc: 'Günlük egzersiz motivasyonu', icon: 'barbell-outline', key: 'exercise', default: false },
  { title: 'Kilo Kaydı', desc: 'Haftalık kilo kayıt hatırlatması', icon: 'scale-outline', key: 'weight', default: true },
  { title: 'Hedef Güncellemeleri', desc: 'Hedeflere ulaştığınızda bildirim', icon: 'trophy-outline', key: 'goals', default: true },
  { title: 'Diyetisyen Mesajları', desc: 'Diyetisyeninizden gelen mesajlar', icon: 'chatbubble-outline', key: 'dietitian', default: true },
  { title: 'Haftalık Rapor', desc: 'Her Pazar haftalık rapor özeti', icon: 'stats-chart-outline', key: 'weekly', default: true },
  { title: 'Promosyonlar', desc: 'İndirim ve kampanya bildirimleri', icon: 'pricetag-outline', key: 'promo', default: false },
]

export default function NotificationSettingsScreen() {
  const navigation = useNavigation<Nav>()
  const [settings, setSettings] = useState<Record<string, boolean>>(Object.fromEntries(notifSettings.map(s => [s.key, s.default])))
  const toggle = (key: string) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Bildirim Ayarları" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        <View style={st.masterCard}>
          <View style={st.masterIcon}><Ionicons name="notifications" size={20} color="#FFFFFF" /></View>
          <View style={st.masterContent}>
            <Text style={st.masterTitle}>Bildirimleri Aktif Et</Text>
            <Text style={st.masterDesc}>Tüm bildirimleri aç/kapat</Text>
          </View>
          <Switch value={Object.values(settings).some(v => v)} trackColor={{ false: colors.border, true: colors.primary.main }} thumbColor="#FFFFFF" />
        </View>

        {notifSettings.map((s) => (
          <View key={s.key} style={st.card}>
            <View style={st.cardIcon}><Ionicons name={s.icon} size={18} color={colors.primary.main} /></View>
            <View style={st.cardContent}>
              <Text style={st.cardTitle}>{s.title}</Text>
              <Text style={st.cardDesc}>{s.desc}</Text>
            </View>
            <Switch value={settings[s.key]} onValueChange={() => toggle(s.key)} trackColor={{ false: colors.border, true: colors.primary.main }} thumbColor="#FFFFFF" />
          </View>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  masterCard: { backgroundColor: colors.primary[50], borderRadius: 16, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: `${colors.primary[100]}66` },
  masterIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary.main, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  masterContent: { flex: 1 },
  masterTitle: { fontSize: 14, fontWeight: fontWeights.bold, color: colors.text.primary },
  masterDesc: { fontSize: 12, color: colors.text.secondary },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' },
  cardIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.primary },
  cardDesc: { fontSize: 12, color: colors.text.secondary },
})
