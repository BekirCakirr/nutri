import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { PairCodeInput } from '../../components/dietitian/PairCodeInput'
import { Button } from '../../components/ui/Button'

type Nav = StackNavigationProp<OnboardingStackParamList, 'DietitianCode'>

export default function DietitianCodeScreen() {
  const navigation = useNavigation<Nav>()
  const [mode, setMode] = useState<'code' | 'qr'>('code')
  const [loading, setLoading] = useState(false)

  const handleCodeSubmit = async (_code: string) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    navigation.navigate('CalculationResult')
  }

  return (
    <ScreenWrapper keyboardAvoiding padded={false}>
      <OnboardingStep
        title="Diyetisyen Eşleştirme"
        description="Diyetisyeninizin size verdiği kodu girin veya QR kodu okutun."
        currentStep={6}
        totalSteps={7}
      >
        {/* Mode selector */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => setMode('code')}
            className={`flex-1 py-3.5 rounded-xl border-2 items-center ${
              mode === 'code'
                ? 'border-[#1A5C37] bg-[#E8F5EC]'
                : 'border-[#D4E2DA] bg-white'
            }`}
            activeOpacity={0.7}
          >
            <Text className={`text-sm font-semibold ${mode === 'code' ? 'text-[#1A5C37]' : 'text-[#5A7264]'}`}>
              📝 Kod Gir
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode('qr')}
            className={`flex-1 py-3.5 rounded-xl border-2 items-center ${
              mode === 'qr'
                ? 'border-[#1A5C37] bg-[#E8F5EC]'
                : 'border-[#D4E2DA] bg-white'
            }`}
            activeOpacity={0.7}
          >
            <Text className={`text-sm font-semibold ${mode === 'qr' ? 'text-[#1A5C37]' : 'text-[#5A7264]'}`}>
              📷 QR Tara
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'code' ? (
          <PairCodeInput
            onSubmit={handleCodeSubmit}
            loading={loading}
            style={{ padding: 0 }}
          />
        ) : (
          <View className="items-center py-10">
            <View className="w-56 h-56 border-2 border-dashed border-[#D4E2DA] rounded-2xl items-center justify-center bg-white">
              <Text className="text-5xl mb-3">📷</Text>
              <Text className="text-sm text-[#5A7264] text-center px-6">
                Kamera ile QR kodu tarayın
              </Text>
            </View>
          </View>
        )}

        <View className="flex-1 min-h-[16px]" />

        <Button
          title="Şimdilik Atla"
          onPress={() => navigation.navigate('CalculationResult')}
          variant="ghost"
          fullWidth
          size="lg"
        />
      </OnboardingStep>
    </ScreenWrapper>
  )
}
