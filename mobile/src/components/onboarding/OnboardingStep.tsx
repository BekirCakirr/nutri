import React from 'react'
import { View, Text, ViewStyle } from 'react-native'
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
    <View className="flex-1 px-6 pt-4 pb-6 bg-[#F8FAF9]" style={style}>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      <Text className="text-3xl font-bold text-[#1A2E23] mt-6 mb-2">{title}</Text>
      {description && (
        <Text className="text-base text-[#5A7264] leading-relaxed mb-6">{description}</Text>
      )}
      <View className="flex-1">{children}</View>
    </View>
  )
}
