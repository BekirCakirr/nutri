import React, { useEffect, useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { useAuthStore } from '../../stores/authStore'
import { useGamification } from '../../hooks'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProfileStackParamList>

type MenuItem = { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle?: string; screen: keyof ProfileStackParamList; color: string }

const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Hesap',
    items: [
      { icon: 'person-outline', title: 'Profili Düzenle', screen: 'EditProfile', color: '#10B981' },
      { icon: 'body-outline', title: 'Kişisel Veriler', subtitle: 'Boy, kilo, yaş', screen: 'PersonalData', color: '#3B82F6' },
      { icon: 'flag-outline', title: 'Hedeflerim', screen: 'Goals', color: '#F59E0B' },
    ],
  },
  {
    title: 'Sağlık',
    items: [
      { icon: 'medical-outline', title: 'Alerji Yönetimi', screen: 'AllergyManagement', color: '#EF4444' },
      { icon: 'people-outline', title: 'Aile Modu', screen: 'FamilyMode', color: '#8B5CF6' },
      { icon: 'fitness-outline', title: 'Diyetisyen Bağlantısı', screen: 'DietitianConnection', color: '#14B8A6' },
    ],
  },
  {
    title: 'Uygulama',
    items: [
      { icon: 'settings-outline', title: 'Ayarlar', screen: 'Settings', color: '#64748B' },
      { icon: 'notifications-outline', title: 'Bildirimler', screen: 'NotificationSettings', color: '#EAB308' },
      { icon: 'alarm-outline', title: 'Hatırlatıcılar', screen: 'Reminders', color: '#F43F5E' },
      { icon: 'color-palette-outline', title: 'Tema', screen: 'Theme', color: '#A855F7' },
      { icon: 'language-outline', title: 'Dil', screen: 'Language', color: '#0EA5E9' },
    ],
  },
  {
    title: 'Premium',
    items: [
      { icon: 'diamond-outline', title: 'Abonelik', subtitle: 'Premium Plan', screen: 'Subscription', color: '#F59E0B' },
      { icon: 'trophy-outline', title: 'Başarılar', screen: 'Achievements', color: '#10B981' },
      { icon: 'watch-outline', title: 'Bağlı Cihazlar', screen: 'ConnectedDevices', color: '#14B8A6' },
    ],
  },
  {
    title: 'Destek & Bilgi',
    items: [
      { icon: 'download-outline', title: 'Veri Dışa Aktarma', screen: 'DataExport', color: '#475569' },
      { icon: 'help-circle-outline', title: 'Yardım & Destek', screen: 'HelpSupport', color: '#3B82F6' },
      { icon: 'information-circle-outline', title: 'Hakkında', screen: 'About', color: '#10B981' },
      { icon: 'shield-checkmark-outline', title: 'Gizlilik Politikası', screen: 'PrivacyPolicy', color: '#64748B' },
      { icon: 'document-text-outline', title: 'Kullanım Şartları', screen: 'TermsOfService', color: '#64748B' },
    ],
  },
]

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { streak, xp, level, loadAll } = useGamification()

  useEffect(() => {
    loadAll().catch(() => {})
  }, [loadAll])

  // Extract profile data (handles both flat and nested profile from backend)
  const profileData = useMemo(() => {
    const p = user?.profile
    const firstName = p?.first_name || user?.firstName || user?.first_name || ''
    const lastName = p?.last_name || user?.lastName || user?.last_name || ''
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : user?.name || 'Kullanıcı'
    const currentWeight = Number(p?.current_weight_kg || user?.current_weight_kg || user?.weight) || 0
    const targetWeight = Number(p?.target_weight_kg || user?.target_weight_kg || user?.targetWeight) || 0
    const weightLost = currentWeight > 0 && targetWeight > 0
      ? Math.max(0, currentWeight - targetWeight).toFixed(1)
      : '0'
    const userStreak = Number(p?.current_streak || user?.current_streak) || streak || 0
    const userXP = Number(p?.xp_points || user?.xp_points) || xp || 0
    return { fullName, currentWeight, weightLost, userStreak, userXP }
  }, [user, streak, xp])

  const displayName = profileData.fullName
  const displayEmail = user?.email || ''
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase()

  // Dynamic stats from real data
  const stats = [
    { value: String(profileData.userStreak), label: 'Gün Serisi' },
    { value: String(profileData.userXP), label: 'Toplam XP' },
    { value: profileData.weightLost, label: 'Kg Verildi', highlight: true },
  ]

  return (
    <ScreenWrapper scrollable={false} padded={false} contentStyle={{ backgroundColor: colors.background.default }}>
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={st.headerPad}>
          <View style={st.headerCard}>
            <View style={st.glowGreen} />
            <View style={st.glowBlue} />
            <View style={st.headerRow}>
              <View style={st.avatar}>
                <Text style={st.avatarText}>{initials}</Text>
              </View>
              <View style={st.headerInfo}>
                <Text style={st.headerName}>{displayName}</Text>
                <Text style={st.headerEmail}>{displayEmail}</Text>
                <View style={st.badgeRow}>
                  <View style={st.premiumBadge}>
                    <Ionicons name="star" size={12} color="#10B981" />
                    <Text style={st.premiumText}>PREMIUM</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={st.editBtn} activeOpacity={0.7}>
                <Ionicons name="pencil" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={st.statsRow}>
              {stats.map((stat, i) => (
                <View key={i} style={st.statCard}>
                  <Text style={[st.statValue, stat.highlight && st.statHighlight]}>{stat.value}</Text>
                  <Text style={st.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={st.menuArea}>
          {menuSections.map((section, si) => (
            <View key={si} style={st.menuSection}>
              <Text style={st.sectionTitle}>{section.title}</Text>
              <View style={st.menuGroup}>
                {section.items.map((item, ii) => (
                  <TouchableOpacity
                    key={ii}
                    style={[st.menuItem, ii < section.items.length - 1 && st.menuItemBorder]}
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View style={[st.menuIcon, { backgroundColor: item.color + '15' }]}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <View style={st.menuTextArea}>
                      <Text style={st.menuTitle}>{item.title}</Text>
                      {item.subtitle && <Text style={st.menuSub}>{item.subtitle}</Text>}
                    </View>
                    <View style={st.chevronWrap}>
                      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={st.logoutBtn} activeOpacity={0.7} onPress={() => logout()}>
          <Text style={st.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default },
  headerPad: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  headerCard: { backgroundColor: '#111827', borderRadius: 32, padding: 24, overflow: 'hidden' },
  glowGreen: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, backgroundColor: '#10B981', opacity: 0.2, borderRadius: 80 },
  glowBlue: { position: 'absolute', bottom: -40, left: -40, width: 128, height: 128, backgroundColor: '#3B82F6', opacity: 0.2, borderRadius: 64 },
  headerRow: { flexDirection: 'row', alignItems: 'center', zIndex: 10 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  avatarText: { fontSize: 24, fontWeight: fontWeights.bold, color: '#fff' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 22, fontWeight: fontWeights.bold, color: '#fff', marginBottom: 2 },
  headerEmail: { fontSize: 14, fontWeight: fontWeights.medium, color: '#9CA3AF' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16,185,129,0.2)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)', borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 },
  premiumText: { fontSize: 12, fontWeight: fontWeights.bold, color: '#10B981', marginLeft: 4 },
  editBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statsRow: { flexDirection: 'row', marginTop: 24, gap: 12, zIndex: 10 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: fontWeights.bold, color: '#fff' },
  statHighlight: { color: '#10B981' },
  statLabel: { fontSize: 10, fontWeight: fontWeights.medium, color: '#9CA3AF', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  menuArea: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  menuSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: fontWeights.bold, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12, marginLeft: 8 },
  menuGroup: { backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuTextArea: { flex: 1, justifyContent: 'center' },
  menuTitle: { fontSize: 16, fontWeight: fontWeights.semibold, color: '#1F2937' },
  menuSub: { fontSize: 13, fontWeight: fontWeights.medium, color: '#6B7280', marginTop: 2 },
  chevronWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { marginHorizontal: 20, marginBottom: 40, backgroundColor: '#FEF2F2', borderRadius: 24, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FECACA' },
  logoutText: { fontSize: 16, fontWeight: fontWeights.bold, color: '#EF4444' },
})
