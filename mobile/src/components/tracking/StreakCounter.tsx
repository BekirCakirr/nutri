import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
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
  label = 'Day Streak',
  bestStreak,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.flameContainer}>
        <Text style={styles.flame}>{'*'}</Text>
      </View>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
      {bestStreak !== undefined && (
        <Text style={styles.best}>Best: {bestStreak} days</Text>
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
  },
  flameContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  flame: {
    fontSize: fontSizes.h2,
    color: '#FF9800',
    fontWeight: fontWeights.bold,
  },
  count: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.extrabold,
    color: colors.text.primary,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  best: {
    fontSize: fontSizes.sm,
    color: colors.text.disabled,
    marginTop: spacing.xs,
  },
})
