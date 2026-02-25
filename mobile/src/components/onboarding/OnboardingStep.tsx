import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { StepIndicator } from './StepIndicator'

interface OnboardingStepProps {
  title: string
  description?: string
  currentStep: number
  totalSteps: number
  children: React.ReactNode
  style?: ViewStyle
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  description,
  currentStep,
  totalSteps,
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSizes.lg,
    color: colors.text.secondary,
    lineHeight: fontSizes.lg * 1.5,
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
  },
})
