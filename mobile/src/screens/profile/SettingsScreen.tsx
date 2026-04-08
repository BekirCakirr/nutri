import React from 'react'
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

type SettingItem = {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle?: string
  type: 'navigate' | 'toggle' | 'info'
  screen?: keyof ProfileStackParamList
  value?: boolean
  info?: string
}

const settingSections: { title: string; items: SettingItem[] }[] = [
  {
    title: 'Genel',
    items: [
      { icon: 'language-outline', title: 'Dil', type: 'navigate', screen: 'Language', info: 'Türkçe' },
      { icon: 'color-palette-outline', title: 'Tema', type: 'navigate', screen: 'Theme', info: 'Açık' },
      { icon: 'notifications-outline', title: 'Bildirimler', type: 'navigate', screen: 'NotificationSettings' },
      { icon: 'alarm-outline', title: 'Hatırlatıcılar', type: 'navigate', screen: 'Reminders' },
    ],
  },
  {
    title: 'Veri & Gizlilik',
    items: [
      { icon: 'download-outline', title: 'Veri Dışa Aktarma', type: 'navigate', screen: 'DataExport' },
      { icon: 'shield-checkmark-outline', title: 'Gizlilik Politikası', type: 'navigate', screen: 'PrivacyPolicy' },
      { icon: 'document-text-outline', title: 'Kullanım Şartları', type: 'navigate', screen: 'TermsOfService' },
      { icon: 'analytics-outline', title: 'Anonim Kullanım Verisi', type: 'toggle', value: true },
    ],
  },
  {
    title: 'Bağlantılar',
    items: [
      { icon: 'watch-outline', title: 'Bağlı Cihazlar', type: 'navigate', screen: 'ConnectedDevices' },
      { icon: 'fitness-outline', title: 'Diyetisyen', type: 'navigate', screen: 'DietitianConnection' },
      { icon: 'people-outline', title: 'Aile Modu', type: 'navigate', screen: 'FamilyMode' },
    ],
  },
  {
    title: 'Hakkında',
    items: [
      { icon: 'information-circle-outline', title: 'Hakkında', type: 'navigate', screen: 'About' },
      { icon: 'help-circle-outline', title: 'Yardım & Destek', type: 'navigate', screen: 'HelpSupport' },
      { icon: 'star-outline', title: 'Uygulamayı Puanla', type: 'info' },
    ],
  },
]

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Ayarlar" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, si) => (
          <View key={si} style={st.section}>
            <Text style={st.sectionTitle}>{section.title}</Text>
            <View style={st.sectionCard}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[st.menuItem, ii < section.items.length - 1 && st.menuItemBorder]}
                  activeOpacity={item.type === 'toggle' ? 1 : 0.6}
                  onPress={() => item.screen && navigation.navigate(item.screen)}
                  disabled={item.type === 'toggle'}
                >
                  <View style={st.menuIcon}>
                    <Ionicons name={item.icon} size={18} color={colors.primary.main} />
                  </View>
                  <View style={st.menuTextArea}>
                    <Text style={st.menuTitle}>{item.title}</Text>
                    {item.subtitle && <Text style={st.menuSub}>{item.subtitle}</Text>}
                  </View>
                  {item.type === 'toggle' ? (
                    <Switch value={item.value} trackColor={{ false: colors.border, true: colors.primary.main }} thumbColor="#FFFFFF" />
                  ) : item.info ? (
                    <View style={st.infoRow}>
                      <Text style={st.infoText}>{item.info}</Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.border} />
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={colors.border} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Version info */}
        <View style={st.versionArea}>
          <Text style={st.versionText}>NutriAI v1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: fontWeights.bold, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E8F0EC', overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#E8F0EC' },
  menuIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuTextArea: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: fontWeights.semibold, color: colors.text.primary },
  menuSub: { fontSize: 12, color: colors.text.secondary },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 14, color: colors.text.secondary, marginRight: 4 },
  versionArea: { alignItems: 'center', marginBottom: 32 },
  versionText: { fontSize: 12, color: colors.text.disabled },
})
