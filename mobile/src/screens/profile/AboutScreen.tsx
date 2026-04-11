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

const appInfo = { version: '1.0.0', build: '2026.03.17', developer: 'NutriAI Team' }
const links = [
  { title: 'Web Sitemiz', icon: 'globe-outline' as const, url: '#' },
  { title: 'Twitter / X', icon: 'logo-twitter' as const, url: '#' },
  { title: 'Instagram', icon: 'logo-instagram' as const, url: '#' },
]
const legalItems = [
  { title: 'Gizlilik Politikası', screen: 'PrivacyPolicy' as const },
  { title: 'Kullanım Şartları', screen: 'TermsOfService' as const },
]

export default function AboutScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Hakkında" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        <View style={st.logoArea}>
          <View style={st.logoBox}><Text style={{ fontSize: 30 }}>🥗</Text></View>
          <Text style={st.appName}>NutriAI</Text>
          <Text style={st.appDesc}>Akıllı Beslenme Asistanı</Text>
          <Text style={st.appVersion}>v{appInfo.version} ({appInfo.build})</Text>
        </View>

        <View style={st.infoCard}>
          <Text style={st.infoText}>NutriAI, yapay zeka destekli akıllı beslenme uygulamasıdır. Fotoğraf çekerek yemekleri analiz edebilir, kişiselleştirilmiş beslenme planları oluşturabilir ve sağlık hedeflerinizi takip edebilirsiniz.</Text>
        </View>

        <View style={st.infoCard}>
          <Text style={st.cardTitle}>Geliştirici</Text>
          <Text style={st.cardDesc}>{appInfo.developer}</Text>
          <Text style={st.cardMeta}>Powered by Google Gemini AI</Text>
        </View>

        <Text style={st.sectionLabel}>Bizi Takip Edin</Text>
        <View style={st.sectionCard}>
          {links.map((link, i) => (
            <TouchableOpacity key={i} style={[st.menuItem, i < links.length - 1 && st.menuItemBorder]} activeOpacity={0.6}>
              <View style={st.menuIcon}><Ionicons name={link.icon} size={18} color={colors.primary.main} /></View>
              <Text style={st.menuTitle}>{link.title}</Text>
              <Ionicons name="open-outline" size={16} color={colors.border} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={st.sectionLabel}>Yasal</Text>
        <View style={st.sectionCard}>
          {legalItems.map((item, i) => (
            <TouchableOpacity key={i} style={[st.menuItem, i < legalItems.length - 1 && st.menuItemBorder]} activeOpacity={0.6} onPress={() => navigation.navigate(item.screen)}>
              <Text style={st.menuTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.border} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={st.footer}><Text style={st.footerText}>© 2026 NutriAI. Tüm hakları saklıdır.</Text></View>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  logoArea: { alignItems: 'center', marginBottom: 24, marginTop: 16 },
  logoBox: { width: 80, height: 80, borderRadius: 16, backgroundColor: colors.primary.main, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  appName: { fontSize: 24, fontWeight: fontWeights.extrabold, color: colors.text.primary },
  appDesc: { fontSize: 14, color: colors.text.secondary, marginTop: 4 },
  appVersion: { fontSize: 12, color: colors.text.disabled, marginTop: 2 },
  infoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 },
  infoText: { fontSize: 14, color: colors.text.secondary, lineHeight: 20 },
  cardTitle: { fontSize: 16, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 8 },
  cardDesc: { fontSize: 14, color: colors.text.secondary },
  cardMeta: { fontSize: 12, color: colors.text.disabled, marginTop: 4 },
  sectionLabel: { fontSize: 12, fontWeight: fontWeights.bold, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E8F0EC', overflow: 'hidden', marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#E8F0EC' },
  menuIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuTitle: { flex: 1, fontSize: 15, fontWeight: fontWeights.semibold, color: colors.text.primary },
  footer: { alignItems: 'center', marginBottom: 32 },
  footerText: { fontSize: 12, color: colors.text.disabled },
})
