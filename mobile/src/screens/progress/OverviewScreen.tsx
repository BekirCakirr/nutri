import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProgressStackParamList>

const summaryData = {
  weight: { current: 74.5, target: 70, unit: 'kg' },
  water: { current: 1750, target: 2500, unit: 'ml' },
  calories: { consumed: 1680, target: 2200 },
  steps: { current: 6420, target: 10000 },
  sleep: { hours: 7.2, quality: 85 },
  exercise: { minutes: 35, calories: 280 },
}

type CardItem = { title: string; icon: keyof typeof Ionicons.glyphMap; value: string; sub: string; color: string; bgColor: string; screen: keyof ProgressStackParamList }

const cards: CardItem[] = [
  { title: 'Kilo', icon: 'scale-outline', value: `${summaryData.weight.current} kg`, sub: `Hedef: ${summaryData.weight.target} kg`, color: '#1A5C37', bgColor: '#E8F5EC', screen: 'Weight' },
  { title: 'Su', icon: 'water-outline', value: `${(summaryData.water.current / 1000).toFixed(1)} L`, sub: `Hedef: ${(summaryData.water.target / 1000).toFixed(1)} L`, color: '#4A90B8', bgColor: '#E4F0F7', screen: 'Water' },
  { title: 'Kalori', icon: 'flame-outline', value: `${summaryData.calories.consumed}`, sub: `/ ${summaryData.calories.target} kcal`, color: '#E8A040', bgColor: '#FEF3C7', screen: 'CalorieHistory' },
  { title: 'Adımlar', icon: 'footsteps-outline', value: `${summaryData.steps.current.toLocaleString('tr-TR')}`, sub: `/ ${summaryData.steps.target.toLocaleString('tr-TR')}`, color: '#8B6BAA', bgColor: '#F3E8FF', screen: 'Steps' },
  { title: 'Uyku', icon: 'moon-outline', value: `${summaryData.sleep.hours} saat`, sub: `Kalite: %${summaryData.sleep.quality}`, color: '#4A7FB5', bgColor: '#DBEAFE', screen: 'Sleep' },
  { title: 'Egzersiz', icon: 'barbell-outline', value: `${summaryData.exercise.minutes} dk`, sub: `${summaryData.exercise.calories} kcal yakıldı`, color: '#C75B4A', bgColor: '#FEE2E2', screen: 'Exercise' },
  { title: 'Ruh Hali', icon: 'happy-outline', value: '😊', sub: 'Bugün: İyi', color: '#F59E0B', bgColor: '#FEF3C7', screen: 'Mood' },
  { title: 'Makrolar', icon: 'pie-chart-outline', value: 'P/K/Y', sub: '92g / 210g / 58g', color: '#1A5C37', bgColor: '#E8F5EC', screen: 'MacroTracking' },
]

const secondaryCards: { title: string; icon: keyof typeof Ionicons.glyphMap; screen: keyof ProgressStackParamList }[] = [
  { title: 'Kan Değerleri', icon: 'water', screen: 'BloodValues' },
  { title: 'Vitaminler', icon: 'leaf-outline', screen: 'Vitamins' },
  { title: 'Fotoğraflar', icon: 'camera-outline', screen: 'ProgressPhotos' },
  { title: 'Aralıklı Oruç', icon: 'timer-outline', screen: 'IntermittentFasting' },
  { title: 'Hedefler', icon: 'flag-outline', screen: 'CustomGoals' },
  { title: 'Ölçüler', icon: 'resize-outline', screen: 'Measurements' },
  { title: 'Besin Detayı', icon: 'nutrition-outline', screen: 'NutrientBreakdown' },
  { title: 'Kalp Hızı', icon: 'heart-outline', screen: 'HeartRate' },
  { title: 'Stres', icon: 'pulse-outline', screen: 'Stress' },
]

export default function OverviewScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        <View style={st.headerArea}>
          <Text style={st.headerTitle}>İlerleme</Text>
          <Text style={st.headerSub}>Sağlık verilerinizin özeti</Text>
        </View>

        <View style={st.grid}>
          {cards.map((card, idx) => (
            <TouchableOpacity key={idx} style={st.card} activeOpacity={0.7} onPress={() => navigation.navigate(card.screen)}>
              <View style={st.cardHeader}>
                <View style={[st.cardIcon, { backgroundColor: card.bgColor }]}>
                  <Ionicons name={card.icon} size={18} color={card.color} />
                </View>
                <Text style={st.cardTitle}>{card.title}</Text>
              </View>
              <Text style={st.cardValue}>{card.value}</Text>
              <Text style={st.cardSub}>{card.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={st.divider} />

        <View style={st.secondaryArea}>
          <Text style={st.sectionTitle}>Diğer Takipler</Text>
          {secondaryCards.map((item, idx) => (
            <TouchableOpacity key={idx} style={st.secondaryCard} activeOpacity={0.7} onPress={() => navigation.navigate(item.screen)}>
              <View style={st.secondaryIcon}>
                <Ionicons name={item.icon} size={20} color={colors.primary.main} />
              </View>
              <Text style={st.secondaryLabel}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default },
  headerArea: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: fontWeights.bold, color: colors.text.primary },
  headerSub: { fontSize: 14, color: colors.text.secondary, marginTop: 4 },
  grid: { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap' },
  card: { width: '48%', marginHorizontal: '1%', marginBottom: 12, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cardTitle: { fontSize: 12, fontWeight: fontWeights.semibold, color: colors.text.secondary },
  cardValue: { fontSize: 20, fontWeight: fontWeights.bold, color: colors.text.primary },
  cardSub: { fontSize: 12, color: colors.text.secondary, marginTop: 2 },
  divider: { marginHorizontal: 20, marginVertical: 8, height: 1, backgroundColor: colors.border },
  secondaryArea: { paddingHorizontal: 20, paddingVertical: 12 },
  sectionTitle: { fontSize: 18, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 12 },
  secondaryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' },
  secondaryIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  secondaryLabel: { flex: 1, fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary },
})
