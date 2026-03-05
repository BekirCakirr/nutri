import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface StreakCounterProps {
  count: number
  label?: string
  bestStreak?: number
  style?: ViewStyle
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  count,
  label = 'Gunluk Seri',
  bestStreak,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.topRow}>
        <View style={styles.flameContainer}>
          <Ionicons name="flame" size={20} color="#FF6D00" />
        </View>
        <Text style={styles.count}>{count}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      {bestStreak !== undefined && (
        <Text style={styles.best}>En iyi: {bestStreak} gun</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flameContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.extrabold,
    color: colors.text.primary,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  best: {
    fontSize: fontSizes.xs,
    color: colors.text.disabled,
    marginTop: 2,
  },
})
