import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface MacroCircleProps {
  label: string
  current: number
  target: number
  unit?: string
  color: string
  size?: number
  style?: ViewStyle
}

export const MacroCircle: React.FC<MacroCircleProps> = ({
  label,
  current,
  target,
  unit = 'g',
  color,
  size = 64,
  style,
}) => {
  const progress = Math.min(current / target, 1)

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.border,
            borderWidth: 3,
          },
        ]}
      >
        <View
          style={[
            styles.progressOverlay,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: color,
              borderWidth: 3,
              borderTopColor: progress > 0.25 ? color : 'transparent',
              borderRightColor: progress > 0.5 ? color : 'transparent',
              borderBottomColor: progress > 0.75 ? color : 'transparent',
              borderLeftColor: progress > 0 ? color : 'transparent',
            },
          ]}
        />
        <Text style={[styles.value, { color }]}>
          {current}
          <Text style={styles.unit}>{unit}</Text>
        </Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.target}>
        of {target}
        {unit}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  progressOverlay: {
    position: 'absolute',
  },
  value: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
  unit: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  target: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
  },
})
