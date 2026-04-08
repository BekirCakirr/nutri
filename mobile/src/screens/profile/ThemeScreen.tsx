import React, { useState } from 'react'
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
type ThemeOption = { id: string; name: string; desc: string; colors: string[]; icon: keyof typeof Ionicons.glyphMap }

const themes: ThemeOption[] = [
  { id: 'light', name: 'Açık Tema', desc: 'Varsayılan beyaz arka plan', colors: ['#F8FAF9', '#FFFFFF', '#1A5C37', '#1A2E23'], icon: 'sunny-outline' },
  { id: 'dark', name: 'Koyu Tema', desc: 'Göz dostu karanlık mod', colors: ['#0F1A14', '#1A2E23', '#4ECDC4', '#F0F7F3'], icon: 'moon-outline' },
  { id: 'auto', name: 'Sistem Ayarı', desc: 'Cihaz ayarını takip et', colors: ['#F8FAF9', '#0F1A14', '#1A5C37', '#4ECDC4'], icon: 'phone-portrait-outline' },
]

const accentColors = [
  { name: 'Yeşil', color: '#1A5C37' }, { name: 'Turkuaz', color: '#4ECDC4' }, { name: 'Mavi', color: '#4A7FB5' },
  { name: 'Turuncu', color: '#E8A040' }, { name: 'Kırmızı', color: '#C75B4A' }, { name: 'Mor', color: '#8B6BAA' },
]

export default function ThemeScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedTheme, setSelectedTheme] = useState('light')
  const [selectedAccent, setSelectedAccent] = useState('#1A5C37')

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Tema Ayarları" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        <Text style={st.sectionTitle}>Tema Modu</Text>
        {themes.map((theme) => (
          <TouchableOpacity key={theme.id} style={[st.themeCard, { borderColor: selectedTheme === theme.id ? colors.primary.main : '#E8F0EC', borderWidth: 2 }]} activeOpacity={0.7} onPress={() => setSelectedTheme(theme.id)}>
            <View style={[st.themeIcon, { backgroundColor: selectedTheme === theme.id ? colors.primary[50] : colors.background.default }]}>
              <Ionicons name={theme.icon} size={20} color={selectedTheme === theme.id ? colors.primary.main : colors.text.secondary} />
            </View>
            <View style={st.themeContent}>
              <Text style={st.themeName}>{theme.name}</Text>
              <Text style={st.themeDesc}>{theme.desc}</Text>
            </View>
            <View style={st.colorPreviewRow}>
              {theme.colors.map((c, i) => (
                <View key={i} style={[st.colorDot, { backgroundColor: c, marginLeft: i > 0 ? -4 : 0 }]} />
              ))}
            </View>
            <View style={[st.radio, { borderColor: selectedTheme === theme.id ? colors.primary.main : colors.border }]}>
              {selectedTheme === theme.id && <View style={st.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[st.sectionTitle, { marginTop: 16 }]}>Vurgu Rengi</Text>
        <View style={st.accentCard}>
          <View style={st.accentRow}>
            {accentColors.map((ac) => (
              <TouchableOpacity key={ac.color} style={st.accentItem} activeOpacity={0.7} onPress={() => setSelectedAccent(ac.color)}>
                <View style={[st.accentCircle, { backgroundColor: ac.color, borderWidth: selectedAccent === ac.color ? 3 : 0, borderColor: '#FFFFFF', shadowColor: ac.color, shadowOpacity: selectedAccent === ac.color ? 0.4 : 0, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: selectedAccent === ac.color ? 4 : 0 }]}>
                  {selectedAccent === ac.color && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
                </View>
                <Text style={st.accentName}>{ac.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={[st.sectionTitle]}>Önizleme</Text>
        <View style={st.previewCard}>
          <View style={st.previewHeader}>
            <View style={[st.previewIcon, { backgroundColor: selectedAccent + '20' }]}>
              <Ionicons name="heart" size={18} color={selectedAccent} />
            </View>
            <View style={st.previewContent}>
              <Text style={st.previewTitle}>Örnek Kart</Text>
              <Text style={st.previewDesc}>Seçilen renk böyle görünecek</Text>
            </View>
          </View>
          <View style={st.progressBg}>
            <View style={[st.progressFill, { width: '65%', backgroundColor: selectedAccent }]} />
          </View>
          <TouchableOpacity style={[st.previewBtn, { backgroundColor: selectedAccent }]}>
            <Text style={st.previewBtnText}>Örnek Buton</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 12 },
  themeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, marginBottom: 10 },
  themeIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  themeContent: { flex: 1 },
  themeName: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary },
  themeDesc: { fontSize: 12, color: colors.text.secondary },
  colorPreviewRow: { flexDirection: 'row', marginRight: 8 },
  colorDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#fff' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary.main },
  accentCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 },
  accentRow: { flexDirection: 'row', justifyContent: 'space-between' },
  accentItem: { alignItems: 'center' },
  accentCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  accentName: { fontSize: 10, color: colors.text.secondary },
  previewCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 32 },
  previewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  previewIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  previewContent: { flex: 1 },
  previewTitle: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary },
  previewDesc: { fontSize: 12, color: colors.text.secondary },
  progressBg: { height: 8, backgroundColor: '#E8F0EC', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  previewBtn: { borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  previewBtnText: { fontSize: 14, fontWeight: fontWeights.semibold, color: '#fff' },
})
