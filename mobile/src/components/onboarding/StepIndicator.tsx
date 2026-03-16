import React from 'react'
import { View, ViewStyle } from 'react-native'

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
  activeColor = '#1A5C37',
  inactiveColor = '#D4E2DA',
  style,
}) => {
  return (
    <View className="flex-row items-center justify-center gap-2" style={style}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index <= currentStep
        const isCurrent = index === currentStep
        return (
          <View
            key={index}
            style={{
              width: isCurrent ? 28 : 8,
              height: 8,
              borderRadius: 99,
              backgroundColor: isActive ? activeColor : inactiveColor,
            }}
          />
        )
      })}
    </View>
  )
}
