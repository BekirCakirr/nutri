import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Svg, Circle } from 'react-native-svg'
import { colors } from '../../theme/colors'
import { fontSizes, fontWeights } from '../../theme/typography'

interface CalorieRingProps {
  consumed: number
  target: number
  size?: number
  strokeWidth?: number
  color?: string
  style?: ViewStyle
}

export const CalorieRing: React.FC<CalorieRingProps> = ({
  consumed,
  target,
  size = 160,
  strokeWidth = 14,
  color = colors.primary.main,
  style,
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(consumed / target, 1)
  const strokeDashoffset = circumference * (1 - progress)
  const remaining = Math.max(target - consumed, 0)

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary[50]}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.centerText}>
        <Text style={styles.remaining}>{remaining}</Text>
        <Text style={styles.label}>kcal kaldi</Text>
        <View style={styles.consumedRow}>
          <Text style={styles.consumed}>{consumed}</Text>
          <Text style={styles.consumedLabel}> tuketildi</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  remaining: {
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  label: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontWeight: fontWeights.medium,
  },
  consumedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  consumed: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.primary.main,
  },
  consumedLabel: {
    fontSize: fontSizes.xs,
    color: colors.text.disabled,
  },
})
