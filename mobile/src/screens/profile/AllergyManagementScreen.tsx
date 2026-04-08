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

type Allergy = { id: string; name: string; severity: 'Yüksek' | 'Orta' | 'Düşük'; icon: string }

const mockAllergies: Allergy[] = [
  { id: '1', name: 'Fıstık', severity: 'Yüksek', icon: '🥜' },
  { id: '2', name: 'Süt Ürünleri', severity: 'Orta', icon: '🥛' },
  { id: '3', name: 'Glüten', severity: 'Düşük', icon: '🌾' },
  { id: '4', name: 'Yumurta', severity: 'Orta', icon: '🥚' },
]

const commonAllergens = [
  { name: 'Kabuklu Deniz Ürünleri', icon: '🦐' },
  { name: 'Soya', icon: '🫘' },
  { name: 'Balık', icon: '🐟' },
  { name: 'Buğday', icon: '🌾' },
  { name: 'Susam', icon: '🫘' },
  { name: 'Hardal', icon: '🟡' },
]

function severityColor(s: string) {
  if (s === 'Yüksek') return { color: '#EF4444', bg: '#FEE2E2' }
  if (s === 'Orta') return { color: '#E8A040', bg: '#FEF3C7' }
  return { color: '#1A5C37', bg: '#E8F5EC' }
}

export default function AllergyManagementScreen() {
  const navigation = useNavigation<Nav>()
  const [allergies] = useState(mockAllergies)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Alerji Yönetimi" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Info card */}
        <View style={st.warningCard}>
          <Ionicons name="warning-outline" size={22} color="#E8A040" />
          <View style={st.warningTextArea}>
            <Text style={st.warningTitle}>Alerji Uyarısı Aktif</Text>
            <Text style={st.warningDesc}>Yemek eklerken alerjen içeren besinler işaretlenecek.</Text>
          </View>
        </View>

        {/* Current allergies */}
        <Text style={st.sectionTitle}>Alerjilerim ({allergies.length})</Text>
        {allergies.map((a) => {
          const sc = severityColor(a.severity)
          return (
            <View key={a.id} style={st.allergyCard}>
              <Text style={st.allergyEmoji}>{a.icon}</Text>
              <View style={st.allergyContent}>
                <Text style={st.allergyName}>{a.name}</Text>
                <View style={st.severityRow}>
                  <View style={[st.severityBadge, { backgroundColor: sc.bg }]}>
                    <Text style={[st.severityText, { color: sc.color }]}>{a.severity}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={st.deleteBtn}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )
        })}

        {/* Common allergens to add */}
        <Text style={[st.sectionTitle, { marginTop: 16 }]}>Yaygın Alerjenler</Text>
        <View style={st.chipWrap}>
          {commonAllergens.map((a, i) => (
            <TouchableOpacity key={i} style={st.chip} activeOpacity={0.7}>
              <Text style={st.chipEmoji}>{a.icon}</Text>
              <Text style={st.chipText}>{a.name}</Text>
              <Ionicons name="add" size={16} color={colors.primary.main} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Add custom */}
        <TouchableOpacity style={st.primaryBtn} activeOpacity={0.8}>
          <Text style={st.primaryBtnText}>+ Özel Alerjen Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  warningCard: { backgroundColor: '#FEF3C7', borderRadius: 16, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  warningTextArea: { flex: 1, marginLeft: 12 },
  warningTitle: { fontSize: 14, fontWeight: fontWeights.bold, color: colors.text.primary },
  warningDesc: { fontSize: 12, color: colors.text.secondary },
  sectionTitle: { fontSize: 16, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 12 },
  allergyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' },
  allergyEmoji: { fontSize: 20, marginRight: 12 },
  allergyContent: { flex: 1 },
  allergyName: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary },
  severityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  severityBadge: { borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2 },
  severityText: { fontSize: 10, fontWeight: fontWeights.bold },
  deleteBtn: { padding: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC', flexDirection: 'row', alignItems: 'center' },
  chipEmoji: { marginRight: 6 },
  chipText: { fontSize: 14, color: colors.text.primary },
  primaryBtn: { backgroundColor: colors.primary.main, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 32, shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { fontSize: 16, fontWeight: fontWeights.semibold, color: '#fff' },
})
