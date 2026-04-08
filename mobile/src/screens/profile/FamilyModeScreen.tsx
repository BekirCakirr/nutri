import React, { useState } from 'react'
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

type FamilyMember = { id: string; name: string; role: string; emoji: string; calories: number }

const mockMembers: FamilyMember[] = [
  { id: '1', name: 'Ahmet (Ben)', role: 'Admin', emoji: '👨', calories: 2200 },
  { id: '2', name: 'Ayşe', role: 'Üye', emoji: '👩', calories: 1800 },
  { id: '3', name: 'Can', role: 'Çocuk', emoji: '👦', calories: 1600 },
]

export default function FamilyModeScreen() {
  const navigation = useNavigation<Nav>()
  const [enabled, setEnabled] = useState(true)
  const [sharedMeals, setSharedMeals] = useState(true)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Aile Modu" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Toggle */}
        <View style={st.toggleCard}>
          <View style={st.toggleIcon}>
            <Ionicons name="people" size={20} color="#8B6BAA" />
          </View>
          <View style={st.toggleContent}>
            <Text style={st.toggleTitle}>Aile Modu</Text>
            <Text style={st.toggleDesc}>Ailenizle birlikte beslenme takibi yapın</Text>
          </View>
          <Switch value={enabled} onValueChange={setEnabled} trackColor={{ false: colors.border, true: colors.primary.main }} thumbColor="#FFFFFF" />
        </View>

        {/* Members */}
        <Text style={st.sectionTitle}>Aile Üyeleri ({mockMembers.length})</Text>
        {mockMembers.map((m) => (
          <View key={m.id} style={st.memberCard}>
            <Text style={st.memberEmoji}>{m.emoji}</Text>
            <View style={st.memberContent}>
              <Text style={st.memberName}>{m.name}</Text>
              <View style={st.memberMeta}>
                <View style={st.roleBadge}>
                  <Text style={st.roleText}>{m.role}</Text>
                </View>
                <Text style={st.caloriesText}>{m.calories} kcal/gün</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.border} />
          </View>
        ))}

        {/* Shared meals toggle */}
        <View style={[st.toggleCard, { marginTop: 16 }]}>
          <View style={st.toggleContent}>
            <Text style={st.toggleTitleSm}>Ortak Öğün Paylaşımı</Text>
            <Text style={st.toggleDesc}>Aynı yemekler otomatik herkese eklensin</Text>
          </View>
          <Switch value={sharedMeals} onValueChange={setSharedMeals} trackColor={{ false: colors.border, true: colors.primary.main }} thumbColor="#FFFFFF" />
        </View>

        {/* Add member */}
        <TouchableOpacity style={st.primaryBtn} activeOpacity={0.8}>
          <Text style={st.primaryBtnText}>+ Aile Üyesi Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  toggleCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E8F0EC', flexDirection: 'row', alignItems: 'center' },
  toggleIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  toggleContent: { flex: 1 },
  toggleTitle: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary },
  toggleTitleSm: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.primary },
  toggleDesc: { fontSize: 12, color: colors.text.secondary },
  sectionTitle: { fontSize: 16, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 12 },
  memberCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' },
  memberEmoji: { fontSize: 24, marginRight: 12 },
  memberContent: { flex: 1 },
  memberName: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary },
  memberMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  roleBadge: { backgroundColor: colors.primary[50], borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  roleText: { fontSize: 10, fontWeight: fontWeights.bold, color: colors.primary.main },
  caloriesText: { fontSize: 12, color: colors.text.secondary },
  primaryBtn: { backgroundColor: colors.primary.main, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 32, marginTop: 8, shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { fontSize: 16, fontWeight: fontWeights.semibold, color: '#fff' },
})
