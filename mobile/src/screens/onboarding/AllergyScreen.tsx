import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { AllergySelector } from '../../components/onboarding/AllergySelector'
import { Button } from '../../components/ui/Button'
import { useOnboardingStore } from '../../stores/onboardingStore'
import { colors } from '../../theme/colors'

type Nav = StackNavigationProp<OnboardingStackParamList, 'Allergy'>

export default function AllergyScreen() {
  const navigation = useNavigation<Nav>()
  const storedAllergies = useOnboardingStore((s) => s.allergyIds)
  const setAllergies = useOnboardingStore((s) => s.setAllergies)

  const [selectedIds, setSelectedIds] = useState<string[]>(storedAllergies)
  const handleToggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const handleContinue = () => {
    setAllergies(selectedIds)
    navigation.navigate('DietPreference')
  }

  return (
    <ScreenWrapper padded={false}>
      <OnboardingStep title="Alerjiler" description="Varsa besin alerjilerinizi seçin. Bu bilgi güvenliğiniz için önemlidir." currentStep={3} totalSteps={7}>
        <AllergySelector allergies={[]} selectedIds={selectedIds} onToggle={handleToggle} title="" subtitle="" style={{ padding: 0 }} />
        <View style={s.spacer} />
        <Button title="Devam Et" onPress={handleContinue} fullWidth size="lg" style={s.btn} />
      </OnboardingStep>
    </ScreenWrapper>
  )
}

const s = StyleSheet.create({
  spacer: { flex: 1, minHeight: 16 },
  btn: { shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
})
