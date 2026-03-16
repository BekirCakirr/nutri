import React from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { BMIResult } from '../../components/onboarding/BMIResult'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'

// Mock calculation values
const mockBMI = 25.0
const mockHeight = 165
const mockWeight = 68
const mockDailyCalories = 1650
const mockMacros = { protein: 82, carbs: 206, fat: 55 }

export default function CalculationResultScreen() {
  const navigation = useNavigation()
  const setOnboarded = useAuthStore((s) => s.setOnboarded)

  const handleComplete = () => {
    setOnboarded(true)
  }

  return (
    <ScreenWrapper padded={false}>
      <OnboardingStep
        title="Sonuçlarınız"
        description="Bilgilerinize göre hesaplanan beslenme hedefleriniz."
        currentStep={7}
        totalSteps={7}
      >
        <BMIResult
          bmi={mockBMI}
          height={mockHeight}
          weight={mockWeight}
          style={{ marginBottom: 16 }}
        />

        {/* Daily calorie target */}
        <View className="bg-[#E8F5EC] rounded-2xl p-6 items-center mb-4 border border-[#C8E6CF]/50">
          <Text className="text-sm font-medium text-[#5A7264] mb-1">Günlük Kalori Hedefi</Text>
          <Text className="text-5xl font-extrabold text-[#1A5C37]">{mockDailyCalories}</Text>
          <Text className="text-base text-[#5A7264] -mt-1">kcal</Text>
        </View>

        {/* Macro distribution */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-white rounded-xl p-4 items-center border border-[#D4E2DA]">
            <View className="w-3 h-3 rounded-full bg-[#EF4444] mb-2" />
            <Text className="text-xs text-[#5A7264] mb-1">Protein</Text>
            <Text className="text-xl font-bold text-[#1A2E23]">{mockMacros.protein}g</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 items-center border border-[#D4E2DA]">
            <View className="w-3 h-3 rounded-full bg-[#3B82F6] mb-2" />
            <Text className="text-xs text-[#5A7264] mb-1">Karbonhidrat</Text>
            <Text className="text-xl font-bold text-[#1A2E23]">{mockMacros.carbs}g</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 items-center border border-[#D4E2DA]">
            <View className="w-3 h-3 rounded-full bg-[#F59E0B] mb-2" />
            <Text className="text-xs text-[#5A7264] mb-1">Yağ</Text>
            <Text className="text-xl font-bold text-[#1A2E23]">{mockMacros.fat}g</Text>
          </View>
        </View>

        <View className="flex-1 min-h-[16px]" />

        <Button
          title="Başla 🎉"
          onPress={handleComplete}
          fullWidth
          size="lg"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
        />
      </OnboardingStep>
    </ScreenWrapper>
  )
}
