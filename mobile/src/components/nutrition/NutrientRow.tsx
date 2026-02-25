import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface NutrientRowProps {
  name: string
  amount: string
  dailyValuePercent?: number
  color?: string
  style?: ViewStyle
}

export const NutrientRow: React.FC<NutrientRowProps> = ({
  name,
  amount,
  dailyValuePercent,
  color = colors.primary.main,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.amount}>{amount}</Text>
      </View>
      {dailyValuePercent !== undefined && (
        <View style={styles.dvContainer}>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.min(dailyValuePercent, 100)}%`,
                  backgroundColor: color,
                },
              ]}
            />
          </View>
          <Text style={styles.dvText}>{dailyValuePercent}%</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  amount: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 1,
  },
  dvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  dvText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    width: 36,
    textAlign: 'right',
  },
})
