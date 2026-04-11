import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { ProgressChart } from '../../components/tracking/ProgressChart'
import { useProgress, useGamification } from '../../hooks'
import { useAuthStore } from '../../stores/authStore'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

export default function MonthlyReportScreen() {
  const navigation = useNavigation()
  const user = useAuthStore((s) => s.user)
  const { weightHistory, loadWeightHistory } = useProgress()
  const { badges, streak, loadAll } = useGamification()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([loadWeightHistory(), loadAll()])
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const raw = user as any
  const currentWeight = Number(raw?.profile?.current_weight_kg || raw?.current_weight_kg) || 0
  const targetWeight = Number(raw?.profile?.target_weight_kg || raw?.target_weight_kg) || 0

  // Build weight chart from real data
  const weightData = (weightHistory || []).slice(-10).map((w: any) => ({
    label: new Date(w.date || w.measured_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    value: Number(w.weight || w.weight_kg) || 0,
  }))

  const startWeight = weightData.length > 0 ? weightData[0].value : currentWeight
  const latestWeight = weightData.length > 0 ? weightData[weightData.length - 1].value : currentWeight
  const weightChange = latestWeight - startWeight

  const earnedBadges = (badges || []).filter((b: any) => b.earned || b.earned_at)

  if (loading) {
    return (
      <ScreenWrapper>
        <AppHeader title="Aylık Rapor" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Aylık Rapor" onBack={() => navigation.goBack()} />

      {/* Summary stats */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{latestWeight || currentWeight}</Text>
          <Text style={styles.summaryUnit}>kg</Text>
          <Text style={styles.summaryLabel}>Mevcut Kilo</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: weightChange <= 0 ? colors.success : colors.error }]}>
            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
          </Text>
          <Text style={styles.summaryUnit}>kg</Text>
          <Text style={styles.summaryLabel}>Değişim</Text>
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
        {weightData.length > 0 ? (
          <ProgressChart title="" data={weightData} color={colors.primary.main} />
        ) : (
          <Text style={styles.noDataText}>Henüz kilo kaydı yok.</Text>
        )}
      </View>

      {/* Earned badges */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Kazanılan Rozetler ({earnedBadges.length})</Text>
        {earnedBadges.length > 0 ? (
          <View style={styles.badgeRow}>
            {earnedBadges.map((badge: any) => (
              <View key={badge.id} style={styles.badgeItem}>
                <View style={styles.badgeIcon}>
                  <Ionicons name="trophy" size={20} color={colors.primary.main} />
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>Henüz rozet kazanılmadı.</Text>
        )}
      </View>

      {/* Monthly highlights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bu Ayın Özeti</Text>
        <View style={styles.highlightItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primary.main} />
          <Text style={styles.highlightText}>
            {Math.abs(weightChange).toFixed(1)} kg {weightChange <= 0 ? 'verdiniz' : 'aldınız'}
          </Text>
        </View>
        <View style={styles.highlightItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primary.main} />
          <Text style={styles.highlightText}>
            {streak || 0} günlük aktif seri
          </Text>
        </View>
        <View style={styles.highlightItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primary.main} />
          <Text style={styles.highlightText}>
            Hedef kilo: {targetWeight} kg ({currentWeight > targetWeight ? `${(currentWeight - targetWeight).toFixed(1)} kg kaldı` : 'Hedefe ulaşıldı!'})
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
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  noDataText: {
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
