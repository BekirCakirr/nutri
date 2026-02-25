import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface CalorieSummaryProps {
  consumed: number
  target: number
  burned?: number
  style?: ViewStyle
}

export const CalorieSummary: React.FC<CalorieSummaryProps> = ({
  consumed,
  target,
  burned = 0,
  style,
}) => {
  const remaining = target - consumed + burned
  const progress = Math.min(consumed / target, 1)

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.value}>{consumed}</Text>
          <Text style={styles.label}>Eaten</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <Text style={[styles.value, { color: colors.primary.main }]}>{remaining}</Text>
          <Text style={styles.label}>Remaining</Text>
        </View>
        {burned > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.item}>
              <Text style={[styles.value, { color: colors.secondary.main }]}>{burned}</Text>
              <Text style={styles.label}>Burned</Text>
            </View>
          </>
        )}
      </View>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${progress * 100}%`,
              backgroundColor:
                progress >= 1 ? colors.warning : colors.primary.main,
            },
          ]}
        />
      </View>
      <Text style={styles.targetText}>
        Daily Target: {target} kcal
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  value: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  label: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  barTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  targetText: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
})
