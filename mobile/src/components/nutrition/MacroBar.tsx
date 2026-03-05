import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface MacroBarProps {
  protein: number
  carbs: number
  fat: number
  height?: number
  showLabels?: boolean
  style?: ViewStyle
}

const macroColors = {
  protein: '#E53935',
  carbs: '#1E88E5',
  fat: '#FDD835',
}

export const MacroBar: React.FC<MacroBarProps> = ({
  protein,
  carbs,
  fat,
  height = 12,
  showLabels = true,
  style,
}) => {
  const total = protein + carbs + fat
  const proteinPct = total > 0 ? (protein / total) * 100 : 0
  const carbsPct = total > 0 ? (carbs / total) * 100 : 0
  const fatPct = total > 0 ? (fat / total) * 100 : 0

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.bar, { height }]}>
        <View
          style={[styles.segment, { width: `${proteinPct}%`, backgroundColor: macroColors.protein }]}
        />
        <View
          style={[styles.segment, { width: `${carbsPct}%`, backgroundColor: macroColors.carbs }]}
        />
        <View
          style={[styles.segment, { width: `${fatPct}%`, backgroundColor: macroColors.fat }]}
        />
      </View>
      {showLabels && (
        <View style={styles.labels}>
          <View style={styles.labelItem}>
            <View style={[styles.dot, { backgroundColor: macroColors.protein }]} />
            <Text style={styles.labelText}>Protein {Math.round(proteinPct)}%</Text>
          </View>
          <View style={styles.labelItem}>
            <View style={[styles.dot, { backgroundColor: macroColors.carbs }]} />
            <Text style={styles.labelText}>Karb. {Math.round(carbsPct)}%</Text>
          </View>
          <View style={styles.labelItem}>
            <View style={[styles.dot, { backgroundColor: macroColors.fat }]} />
            <Text style={styles.labelText}>Yag {Math.round(fatPct)}%</Text>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  bar: {
    flexDirection: 'row',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  segment: {
    height: '100%',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  labelText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
})
