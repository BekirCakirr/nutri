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
type Plan = { id: string; name: string; price: string; period: string; features: string[]; popular?: boolean }

const plans: Plan[] = [
  { id: 'free', name: 'Ücretsiz', price: '₺0', period: 'Süresiz', features: ['Temel besin takibi', 'Günde 3 AI analiz', 'Su takibi', 'Kilo kaydı'] },
  { id: 'premium', name: 'Premium', price: '₺79', period: '/ay', popular: true, features: ['Sınırsız AI analiz', 'Kişisel beslenme planı', 'Diyetisyen bağlantısı', 'Aralıklı oruç takibi', 'Detaylı raporlar', 'Aile modu (3 kişiye kadar)', 'Reklamsız deneyim'] },
  { id: 'annual', name: 'Yıllık Premium', price: '₺599', period: '/yıl', features: ['Tüm Premium özellikler', '%37 indirim', 'Öncelikli destek', 'Aile modu (5 kişiye kadar)', 'Veri dışa aktarma'] },
]

export default function SubscriptionScreen() {
  const navigation = useNavigation<Nav>()
  const [currentPlan] = useState('premium')

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Abonelik" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        <View style={st.currentBadge}>
          <View style={st.currentIcon}><Ionicons name="diamond" size={20} color="#FFFFFF" /></View>
          <View style={st.currentContent}>
            <Text style={st.currentTitle}>Mevcut Plan: Premium</Text>
            <Text style={st.currentDesc}>Yenileme: 1 Nisan 2026</Text>
          </View>
        </View>

        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan
          return (
            <View key={plan.id} style={[st.planCard, { borderColor: plan.popular ? colors.primary.main : '#E8F0EC' }]}>
              {plan.popular && (
                <View style={st.popularBadge}><Text style={st.popularText}>⭐ En Popüler</Text></View>
              )}
              <Text style={st.planName}>{plan.name}</Text>
              <View style={st.priceRow}>
                <Text style={st.planPrice}>{plan.price}</Text>
                <Text style={st.planPeriod}>{plan.period}</Text>
              </View>
              {plan.features.map((f, i) => (
                <View key={i} style={st.featureRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary.main} />
                  <Text style={st.featureText}>{f}</Text>
                </View>
              ))}
              <TouchableOpacity style={[st.planBtn, { backgroundColor: isCurrent ? colors.primary[50] : colors.primary.main }]} activeOpacity={0.8} disabled={isCurrent}>
                <Text style={[st.planBtnText, { color: isCurrent ? colors.primary.main : '#fff' }]}>{isCurrent ? '✓ Aktif Plan' : 'Bu Plana Geç'}</Text>
              </TouchableOpacity>
            </View>
          )
        })}

        <TouchableOpacity style={st.cancelBtn} activeOpacity={0.6}>
          <Text style={st.cancelText}>Aboneliği İptal Et</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  currentBadge: { backgroundColor: colors.primary[50], borderRadius: 16, padding: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: `${colors.primary[100]}66` },
  currentIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary.main, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  currentContent: { flex: 1 },
  currentTitle: { fontSize: 14, fontWeight: fontWeights.bold, color: colors.text.primary },
  currentDesc: { fontSize: 12, color: colors.text.secondary },
  planCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, overflow: 'hidden' },
  popularBadge: { backgroundColor: colors.primary.main, borderRadius: 100, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 12 },
  popularText: { fontSize: 12, fontWeight: fontWeights.bold, color: '#fff' },
  planName: { fontSize: 18, fontWeight: fontWeights.bold, color: colors.text.primary },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 4, marginBottom: 12 },
  planPrice: { fontSize: 30, fontWeight: fontWeights.extrabold, color: colors.text.primary },
  planPeriod: { fontSize: 14, color: colors.text.secondary, marginLeft: 4, marginBottom: 4 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  featureText: { fontSize: 14, color: colors.text.secondary, marginLeft: 8 },
  planBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  planBtnText: { fontSize: 16, fontWeight: fontWeights.semibold },
  cancelBtn: { alignItems: 'center', marginBottom: 32 },
  cancelText: { fontSize: 14, color: '#EF4444' },
})
