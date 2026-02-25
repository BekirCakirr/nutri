import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  activeColor?: string
  inactiveColor?: string
  style?: ViewStyle
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  activeColor = colors.primary.main,
  inactiveColor = colors.border,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index <= currentStep
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive
                ? { backgroundColor: activeColor }
                : { backgroundColor: inactiveColor },
              index === currentStep && styles.activeDot,
            ]}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    borderRadius: borderRadius.full,
  },
})
