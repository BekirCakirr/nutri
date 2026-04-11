import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { ProgressChart } from '../../components/tracking/ProgressChart'
import { DailyChecklist } from '../../components/tracking/DailyChecklist'
import { useMeals, useTracking, useProgress } from '../../hooks'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

export default function WeeklyReportScreen() {
  const navigation = useNavigation()
  const { todayMeals, fetchTodayMeals } = useMeals()
  const { todayCalories, waterGlasses, exerciseMinutes, loadToday } = useTracking()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchTodayMeals(), loadToday()])
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Build weekly data from today's real data + estimates
  const todayCal = todayCalories || 0
  const weeklyCalories = days.map((_, i) => {
    if (i === new Date().getDay() - 1 || (new Date().getDay() === 0 && i === 6)) return todayCal
    return 0 // No historical data for other days without API
  })

  const hasData = todayCal > 0
  const avgCalories = hasData ? todayCal : 0
  const avgWater = (waterGlasses || 0) * 200 // glasses to ml
  const avgExercise = exerciseMinutes || 0

  const checklistItems = [
    { id: '1', label: 'Günlük kalori hedefini tuttur', completed: todayCal > 1000 },
    { id: '2', label: 'En az 8 bardak su iç', completed: (waterGlasses || 0) >= 8 },
    { id: '3', label: 'En az 30dk egzersiz yap', completed: avgExercise >= 30 },
    { id: '4', label: '3 ana öğün kaydet', completed: (todayMeals?.length || 0) >= 3 },
    { id: '5', label: 'Sebze tüketimini artır', completed: false },
  ]

  if (loading) {
    return (
      <ScreenWrapper>
        <AppHeader title="Haftalık Rapor" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Haftalık Rapor" onBack={() => navigation.goBack()} />

      {/* Calorie trend */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bugünkü Kalori Durumu</Text>
        {hasData ? (
          <>
            <ProgressChart
              title=""
              data={weeklyCalories.filter(v => v > 0).map((val, i) => ({ label: days[i], value: val }))}
              color={colors.primary.main}
            />
            <View style={styles.avgRow}>
              <Text style={styles.avgLabel}>Bugün:</Text>
              <Text style={styles.avgValue}>{todayCal} kcal</Text>
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>Henüz öğün kaydı yok. Öğün ekleyerek başlayın.</Text>
        )}
      </View>

      {/* Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Günlük Özet</Text>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgCalories}</Text>
            <Text style={styles.statUnit}>kcal</Text>
            <Text style={styles.statLabel}>Kalori</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgWater}</Text>
            <Text style={styles.statUnit}>ml</Text>
            <Text style={styles.statLabel}>Su</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgExercise}</Text>
            <Text style={styles.statUnit}>dk</Text>
            <Text style={styles.statLabel}>Egzersiz</Text>
          </View>
        </View>
      </View>

      {/* Checklist */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Günlük Kontrol Listesi</Text>
        <DailyChecklist items={checklistItems} onToggle={() => {}} />
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
  noDataText: {
    fontSize: fontSizes.md,
    color: colors.text.disabled,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
})
