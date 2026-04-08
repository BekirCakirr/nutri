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

type Goal = {
  id: string
  title: string
  category: string
  value: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
  editable: boolean
}

const mockGoals: Goal[] = [
  { id: '1', title: 'Hedef Kilo', category: 'Vücut', value: '70 kg', icon: 'scale-outline', color: '#1A5C37', editable: true },
  { id: '2', title: 'Günlük Kalori', category: 'Beslenme', value: '2.200 kcal', icon: 'flame-outline', color: '#E8A040', editable: true },
  { id: '3', title: 'Protein Hedefi', category: 'Beslenme', value: '120g / gün', icon: 'nutrition-outline', color: '#C75B4A', editable: true },
  { id: '4', title: 'Karbonhidrat Hedefi', category: 'Beslenme', value: '275g / gün', icon: 'leaf-outline', color: '#4A7FB5', editable: true },
  { id: '5', title: 'Yağ Hedefi', category: 'Beslenme', value: '73g / gün', icon: 'water-outline', color: '#D4A843', editable: true },
  { id: '6', title: 'Su Hedefi', category: 'Sağlık', value: '2.5L / gün', icon: 'water', color: '#4A90B8', editable: true },
  { id: '7', title: 'Adım Hedefi', category: 'Aktivite', value: '10.000 / gün', icon: 'footsteps-outline', color: '#8B6BAA', editable: true },
  { id: '8', title: 'Uyku Hedefi', category: 'Sağlık', value: '7-8 saat', icon: 'moon-outline', color: '#4A7FB5', editable: true },
  { id: '9', title: 'Egzersiz Hedefi', category: 'Aktivite', value: '4 gün / hafta', icon: 'barbell-outline', color: '#C75B4A', editable: true },
]

const grouped: Record<string, Goal[]> = {}
mockGoals.forEach(g => {
  if (!grouped[g.category]) grouped[g.category] = []
  grouped[g.category].push(g)
})

export default function GoalsScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Hedeflerim" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Info */}
        <View style={st.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary.main} />
          <Text style={st.infoText}>
            Hedefleriniz yapay zeka önerilerine göre otomatik hesaplanır. Dilediğiniz zaman düzenleyebilirsiniz.
          </Text>
        </View>

        {/* Grouped goals */}
        {Object.entries(grouped).map(([category, goals]) => (
          <View key={category} style={st.section}>
            <Text style={st.sectionTitle}>{category}</Text>
            <View style={st.sectionCard}>
              {goals.map((goal, i) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[st.menuItem, i < goals.length - 1 && st.menuItemBorder]}
                  activeOpacity={0.6}
                >
                  <View style={[st.menuIcon, { backgroundColor: goal.color + '18' }]}>
                    <Ionicons name={goal.icon} size={18} color={goal.color} />
                  </View>
                  <View style={st.menuTextArea}>
                    <Text style={st.menuTitle}>{goal.title}</Text>
                  </View>
                  <View style={st.valueRow}>
                    <Text style={st.valueText}>{goal.value}</Text>
                    <Ionicons name="pencil-outline" size={14} color={colors.border} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* AI recalculate */}
        <TouchableOpacity style={st.outlineBtn} activeOpacity={0.8}>
          <Text style={st.outlineBtnText}>🤖 AI ile Yeniden Hesapla</Text>
        </TouchableOpacity>

        <TouchableOpacity style={st.primaryBtn} activeOpacity={0.8}>
          <Text style={st.primaryBtnText}>+ Özel Hedef Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  infoCard: { backgroundColor: colors.primary[50], borderRadius: 16, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: `${colors.primary[100]}66` },
  infoText: { flex: 1, fontSize: 12, color: colors.text.secondary, marginLeft: 8 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: fontWeights.bold, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E8F0EC', overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#E8F0EC' },
  menuIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuTextArea: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: fontWeights.semibold, color: colors.text.primary },
  valueRow: { flexDirection: 'row', alignItems: 'center' },
  valueText: { fontSize: 14, fontWeight: fontWeights.bold, color: colors.text.primary, marginRight: 4 },
  outlineBtn: { backgroundColor: '#fff', borderWidth: 2, borderColor: colors.primary.main, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  outlineBtnText: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.primary.main },
  primaryBtn: { backgroundColor: colors.primary.main, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 32, shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { fontSize: 16, fontWeight: fontWeights.semibold, color: '#fff' },
})
