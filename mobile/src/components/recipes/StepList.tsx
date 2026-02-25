import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface Step {
  instruction: string
  duration?: string
}

interface StepListProps {
  steps: Step[]
  style?: ViewStyle
}

export const StepList: React.FC<StepListProps> = ({
  steps,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Instructions</Text>
      {steps.map((step, index) => (
        <View key={index} style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.instruction}>{step.instruction}</Text>
            {step.duration && (
              <Text style={styles.duration}>{step.duration}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  step: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  instruction: {
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    lineHeight: fontSizes.lg * 1.5,
  },
  duration: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
})
