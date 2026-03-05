import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { ProgressChart } from '../../components/tracking/ProgressChart'
import { DailyChecklist } from '../../components/tracking/DailyChecklist'
import { mockWaterHistory, mockExerciseHistory } from '../../mock/tracking'
import { mockMeals } from '../../mock/meals'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

// Build 7-day calorie data
const days = ['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz']
const weeklyCalories = [1580, 1620, 1450, 1700, 1650, 1550, totalForToday()]

function totalForToday() {
  return mockMeals
    .filter((m) => m.date === '2026-02-25')
    .reduce((s, m) => s + m.totalNutrition.calories, 0)
}

// Averages
const avgCalories = Math.round(weeklyCalories.reduce((a, b) => a + b, 0) / 7)
const avgWater = Math.round(
  mockWaterHistory.reduce((a, b) => a + b.value, 0) / mockWaterHistory.length
)
const avgExercise = Math.round(
  mockExerciseHistory.reduce((a, b) => a + b.minutes, 0) / mockExerciseHistory.length
)

const checklistItems = [
  { id: '1', label: 'Gunluk kalori hedefini tuttur', completed: avgCalories <= 1700 },
  { id: '2', label: 'En az 2L su ic', completed: avgWater >= 2000 },
  { id: '3', label: 'En az 30dk egzersiz yap', completed: avgExercise >= 30 },
  { id: '4', label: '3 ana ogun kaydet', completed: true },
  { id: '5', label: 'Sebze tuketimini artir', completed: false },
]

export default function WeeklyReportScreen() {
  const navigation = useNavigation()

  return (
    <ScreenWrapper>
      <AppHeader title="Haftalik Rapor" onBack={() => navigation.goBack()} />

      {/* Calorie trend */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>7 Gunluk Kalori Trendi</Text>
        <ProgressChart
          title=""
          data={weeklyCalories.map((val, i) => ({ label: days[i], value: val }))}
          color={colors.primary.main}
        />
        <View style={styles.avgRow}>
          <Text style={styles.avgLabel}>Ortalama:</Text>
          <Text style={styles.avgValue}>{avgCalories} kcal/gun</Text>
        </View>
      </View>

      {/* Macro averages */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Haftalik Ortalamalar</Text>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgCalories}</Text>
            <Text style={styles.statUnit}>kcal/gun</Text>
            <Text style={styles.statLabel}>Kalori</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgWater}</Text>
            <Text style={styles.statUnit}>ml/gun</Text>
            <Text style={styles.statLabel}>Su</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgExercise}</Text>
            <Text style={styles.statUnit}>dk/gun</Text>
            <Text style={styles.statLabel}>Egzersiz</Text>
          </View>
        </View>
      </View>

      {/* Checklist */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Haftalik Kontrol Listesi</Text>
        <DailyChecklist
          items={checklistItems}
          onToggle={() => {}}
        />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  avgRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  avgLabel: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
  avgValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.primary.main,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  statValue: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  statUnit: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
})
