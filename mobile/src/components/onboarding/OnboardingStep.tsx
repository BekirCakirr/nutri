import React from 'react'
import { View, Text, ViewStyle, StyleSheet } from 'react-native'
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
    <View style={[{ flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, backgroundColor: '#F8FAF9' }, style]}>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      <Text style={{ fontSize: 30, fontWeight: '700', color: '#1A2E23', marginTop: 24, marginBottom: 8 }}>{title}</Text>
      {description && (
        <Text style={{ fontSize: 16, color: '#5A7264', marginBottom: 24 }} /* TODO: leading-relaxed */>{description}</Text>
      )}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  )
}
