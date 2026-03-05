import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { ProgressChart } from '../../components/tracking/ProgressChart'
import { BadgeIcon } from '../../components/gamification/BadgeIcon'
import { mockWeightHistory } from '../../mock/tracking'
import { mockBadges } from '../../mock/gamification'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

// Monthly weight data
const weightData = mockWeightHistory.map((w) => ({
  label: new Date(w.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
  value: w.value,
}))

// Monthly calorie averages (mock)
const monthlyCalories = [
  { label: 'Hf 1', value: 1580 },
  { label: 'Hf 2', value: 1620 },
  { label: 'Hf 3', value: 1550 },
  { label: 'Hf 4', value: 1640 },
]

const earnedBadges = mockBadges.filter((b) => b.unlockedAt)

export default function MonthlyReportScreen() {
  const navigation = useNavigation()

  const startWeight = mockWeightHistory[0]?.value || 0
  const currentWeight = mockWeightHistory[mockWeightHistory.length - 1]?.value || 0
  const weightChange = currentWeight - startWeight

  return (
    <ScreenWrapper>
      <AppHeader title="Aylik Rapor" onBack={() => navigation.goBack()} />

      {/* Summary stats */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{currentWeight}</Text>
          <Text style={styles.summaryUnit}>kg</Text>
          <Text style={styles.summaryLabel}>Mevcut Kilo</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: weightChange < 0 ? colors.success : colors.error }]}>
            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
          </Text>
          <Text style={styles.summaryUnit}>kg</Text>
          <Text style={styles.summaryLabel}>Degisim</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{earnedBadges.length}</Text>
          <Text style={styles.summaryUnit}>adet</Text>
          <Text style={styles.summaryLabel}>Rozet</Text>
        </View>
      </View>

      {/* Weight trend */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Kilo Trendi</Text>
        <ProgressChart
          title=""
          data={weightData}
          color={colors.primary.main}
        />
      </View>

      {/* Calorie trend */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Haftalik Kalori Ortalamasi</Text>
        <ProgressChart
          title=""
          data={monthlyCalories}
          color={colors.secondary.main}
        />
      </View>

      {/* Earned badges */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Kazanilan Rozetler</Text>
        <View style={styles.badgeRow}>
          {earnedBadges.map((badge) => (
            <View key={badge.id} style={styles.badgeItem}>
              <BadgeIcon
                icon={<Ionicons name={badge.icon === 'star' ? 'star' : badge.icon === 'flame' ? 'flame' : badge.icon === 'water' ? 'water' : 'trophy'} size={22} color={colors.primary.main} />}
                name={badge.name}
                rarity="common"
                size={48}
              />
              <Text style={styles.badgeName}>{badge.name}</Text>
            </View>
          ))}
        </View>
        {earnedBadges.length === 0 && (
          <Text style={styles.noBadgeText}>Henuz rozet kazanilmadi.</Text>
        )}
      </View>

      {/* Monthly highlights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bu Ayin Ozeti</Text>
        <View style={styles.highlightItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primary.main} style={{ marginTop: 2 }} />
          <Text style={styles.highlightText}>
            {Math.abs(weightChange).toFixed(1)} kg {weightChange < 0 ? 'verdiniz' : 'aldiniz'}
          </Text>
        </View>
        <View style={styles.highlightItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primary.main} style={{ marginTop: 2 }} />
          <Text style={styles.highlightText}>
            Ortalama 1600 kcal/gun tuketim
          </Text>
        </View>
        <View style={styles.highlightItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primary.main} style={{ marginTop: 2 }} />
          <Text style={styles.highlightText}>
            7 gunluk en uzun seri
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryValue: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  summaryUnit: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginTop: 1,
  },
  summaryLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontWeight: fontWeights.medium,
    marginTop: spacing.xs,
  },
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
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  badgeItem: {
    alignItems: 'center',
    width: 72,
  },
  badgeName: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  noBadgeText: {
    fontSize: fontSizes.md,
    color: colors.text.disabled,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  highlightText: {
    fontSize: fontSizes.md,
    color: colors.text.primary,
    flex: 1,
    lineHeight: fontSizes.md * 1.5,
  },
})
