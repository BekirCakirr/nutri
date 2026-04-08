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

type ExportFormat = { label: string; icon: keyof typeof Ionicons.glyphMap; desc: string }

const formats: ExportFormat[] = [
  { label: 'PDF Rapor', icon: 'document-text-outline', desc: 'Detaylı beslenme raporu' },
  { label: 'CSV Verileri', icon: 'grid-outline', desc: 'Excel uyumlu ham veri' },
  { label: 'JSON', icon: 'code-outline', desc: 'Geliştirici dostu format' },
]

const dataCategories = [
  { name: 'Öğün Kayıtları', count: 245, icon: 'restaurant-outline' as const },
  { name: 'Kilo Geçmişi', count: 90, icon: 'scale-outline' as const },
  { name: 'Su Takibi', count: 180, icon: 'water-outline' as const },
  { name: 'Egzersiz', count: 65, icon: 'barbell-outline' as const },
  { name: 'Uyku', count: 90, icon: 'moon-outline' as const },
  { name: 'İlerleme Fotoğrafları', count: 8, icon: 'camera-outline' as const },
]

export default function DataExportScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedFormat, setSelectedFormat] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5]))

  const toggleCategory = (idx: number) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Veri Dışa Aktarma" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Format selection */}
        <Text style={st.sectionTitle}>Format Seçin</Text>
        {formats.map((f, i) => (
          <TouchableOpacity key={i} style={[st.formatCard, { borderColor: selectedFormat === i ? colors.primary.main : '#E8F0EC' }]} activeOpacity={0.7} onPress={() => setSelectedFormat(i)}>
            <View style={[st.formatIcon, { backgroundColor: selectedFormat === i ? colors.primary[50] : colors.background.default }]}>
              <Ionicons name={f.icon} size={20} color={selectedFormat === i ? colors.primary.main : colors.text.secondary} />
            </View>
            <View style={st.formatContent}>
              <Text style={st.formatLabel}>{f.label}</Text>
              <Text style={st.formatDesc}>{f.desc}</Text>
            </View>
            <View style={[st.radio, { borderColor: selectedFormat === i ? colors.primary.main : colors.border }]}>
              {selectedFormat === i && <View style={st.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Data categories */}
        <Text style={[st.sectionTitle, { marginTop: 16 }]}>Verileri Seçin</Text>
        {dataCategories.map((cat, i) => (
          <TouchableOpacity key={i} style={st.catCard} activeOpacity={0.7} onPress={() => toggleCategory(i)}>
            <View style={st.catIcon}>
              <Ionicons name={cat.icon} size={18} color={colors.primary.main} />
            </View>
            <View style={st.catContent}>
              <Text style={st.catName}>{cat.name}</Text>
              <Text style={st.catCount}>{cat.count} kayıt</Text>
            </View>
            <View style={[st.checkbox, { backgroundColor: selectedCategories.has(i) ? colors.primary.main : '#fff', borderColor: selectedCategories.has(i) ? colors.primary.main : colors.border }]}>
              {selectedCategories.has(i) && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Export button */}
        <TouchableOpacity style={st.primaryBtn} activeOpacity={0.8}>
          <Text style={st.primaryBtnText}>📥 Dışa Aktar</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 12 },
  formatCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1 },
  formatIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  formatContent: { flex: 1 },
  formatLabel: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary },
  formatDesc: { fontSize: 12, color: colors.text.secondary },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary.main },
  catCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC' },
  catIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  catContent: { flex: 1 },
  catName: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.primary },
  catCount: { fontSize: 12, color: colors.text.secondary },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { backgroundColor: colors.primary.main, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 32, shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { fontSize: 16, fontWeight: fontWeights.semibold, color: '#fff' },
})
