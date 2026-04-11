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

type Device = { id: string; name: string; type: string; icon: keyof typeof Ionicons.glyphMap; connected: boolean; lastSync?: string }

const mockDevices: Device[] = [
  { id: '1', name: 'Apple Watch SE', type: 'Akıllı Saat', icon: 'watch-outline', connected: true, lastSync: '5 dk önce' },
  { id: '2', name: 'Xiaomi Mi Band 8', type: 'Fitness Bileklik', icon: 'fitness-outline', connected: false, lastSync: '3 gün önce' },
]

const availableDevices = [
  { name: 'Fitbit', icon: 'watch-outline' as const },
  { name: 'Samsung Health', icon: 'phone-portrait-outline' as const },
  { name: 'Google Fit', icon: 'logo-google' as const },
  { name: 'Garmin', icon: 'navigate-outline' as const },
  { name: 'Apple Health', icon: 'heart-outline' as const },
  { name: 'Withings', icon: 'scale-outline' as const },
]

export default function ConnectedDevicesScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Bağlı Cihazlar" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Connected devices */}
        <Text style={st.sectionTitle}>Bağlı ({mockDevices.filter(d => d.connected).length})</Text>
        {mockDevices.map((d) => (
          <View key={d.id} style={st.deviceCard}>
            <View style={[st.deviceIcon, { backgroundColor: d.connected ? colors.primary[50] : colors.background.default }]}>
              <Ionicons name={d.icon} size={20} color={d.connected ? colors.primary.main : colors.text.disabled} />
            </View>
            <View style={st.deviceContent}>
              <Text style={st.deviceName}>{d.name}</Text>
              <Text style={st.deviceType}>{d.type}</Text>
              {d.lastSync && <Text style={st.lastSync}>Son senkronizasyon: {d.lastSync}</Text>}
            </View>
            <View style={[st.statusBadge, { backgroundColor: d.connected ? colors.primary[50] : '#FEE2E2' }]}>
              <Text style={[st.statusText, { color: d.connected ? colors.primary.main : '#EF4444' }]}>
                {d.connected ? 'Bağlı' : 'Bağlı Değil'}
              </Text>
            </View>
          </View>
        ))}

        {/* Available to connect */}
        <Text style={[st.sectionTitle, { marginTop: 16 }]}>Bağlanabilir Cihazlar</Text>
        <View style={st.availableGrid}>
          {availableDevices.map((d, i) => (
            <TouchableOpacity key={i} style={st.availableCard} activeOpacity={0.7}>
              <View style={st.availableIcon}>
                <Ionicons name={d.icon} size={22} color={colors.primary.main} />
              </View>
              <Text style={st.availableName}>{d.name}</Text>
              <Text style={st.connectLink}>Bağlan</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 12 },
  deviceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' },
  deviceIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  deviceContent: { flex: 1 },
  deviceName: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary },
  deviceType: { fontSize: 12, color: colors.text.secondary },
  lastSync: { fontSize: 10, color: colors.text.disabled },
  statusBadge: { borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: fontWeights.bold },
  availableGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  availableCard: { width: '48%', marginHorizontal: '1%', marginBottom: 10, backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' },
  availableIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  availableName: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.primary },
  connectLink: { fontSize: 12, color: colors.primary.main, marginTop: 4 },
})
