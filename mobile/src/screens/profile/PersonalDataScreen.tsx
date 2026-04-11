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
type DataField = { label: string; value: string; icon: keyof typeof Ionicons.glyphMap; editable: boolean }

const personalData: { category: string; fields: DataField[] }[] = [
  { category: 'Fiziksel Bilgiler', fields: [
    { label: 'Boy', value: '178 cm', icon: 'resize-outline', editable: true },
    { label: 'Kilo', value: '74.5 kg', icon: 'scale-outline', editable: true },
    { label: 'Yaş', value: '30', icon: 'calendar-outline', editable: false },
    { label: 'Cinsiyet', value: 'Erkek', icon: 'person-outline', editable: true },
    { label: 'Vücut Kitle İndeksi', value: '23.5 (Normal)', icon: 'body-outline', editable: false },
  ]},
  { category: 'Aktivite & Yaşam Tarzı', fields: [
    { label: 'Aktivite Seviyesi', value: 'Orta Aktif', icon: 'walk-outline', editable: true },
    { label: 'Meslek Türü', value: 'Ofis / Masa Başı', icon: 'briefcase-outline', editable: true },
    { label: 'Uyku Düzeni', value: '23:00 - 07:00', icon: 'moon-outline', editable: true },
  ]},
  { category: 'Beslenme Tercihleri', fields: [
    { label: 'Diyet Türü', value: 'Standart', icon: 'restaurant-outline', editable: true },
    { label: 'Öğün Sayısı', value: '3 Ana + 2 Ara', icon: 'time-outline', editable: true },
    { label: 'Hedef', value: 'Kilo Verme', icon: 'trending-down-outline', editable: true },
  ]},
  { category: 'Metabolik Bilgiler', fields: [
    { label: 'Bazal Metabolizma (BMR)', value: '1.720 kcal', icon: 'flash-outline', editable: false },
    { label: 'Günlük Kalori İhtiyacı (TDEE)', value: '2.200 kcal', icon: 'flame-outline', editable: false },
  ]},
]

export default function PersonalDataScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Kişisel Veriler" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {personalData.map((section, si) => (
          <View key={si} style={st.section}>
            <Text style={st.sectionTitle}>{section.category}</Text>
            <View style={st.sectionCard}>
              {section.fields.map((field, fi) => (
                <TouchableOpacity key={fi} style={[st.menuItem, fi < section.fields.length - 1 && st.menuItemBorder]} activeOpacity={field.editable ? 0.6 : 1} disabled={!field.editable}>
                  <View style={st.menuIcon}><Ionicons name={field.icon} size={16} color={colors.primary.main} /></View>
                  <Text style={st.menuLabel}>{field.label}</Text>
                  <Text style={st.menuValue}>{field.value}</Text>
                  {field.editable && <Ionicons name="pencil-outline" size={14} color={colors.border} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <TouchableOpacity style={st.outlineBtn} activeOpacity={0.8}>
          <Text style={st.outlineBtnText}>🤖 Metabolizmayı Yeniden Hesapla</Text>
        </TouchableOpacity>
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
  menuLabel: { flex: 1, fontSize: 15, color: colors.text.secondary },
  menuValue: { fontSize: 15, fontWeight: fontWeights.semibold, color: colors.text.primary, marginRight: 4 },
  outlineBtn: { backgroundColor: '#fff', borderWidth: 2, borderColor: colors.primary.main, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 32 },
  outlineBtnText: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.primary.main },
})
