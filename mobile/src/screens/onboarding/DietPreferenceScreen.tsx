import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { DietPreferenceSelector } from '../../components/onboarding/DietPreferenceSelector'
import { Button } from '../../components/ui/Button'
import { useOnboardingStore } from '../../stores/onboardingStore'
import { colors } from '../../theme/colors'

type Nav = StackNavigationProp<OnboardingStackParamList, 'DietPreference'>

export default function DietPreferenceScreen() {
  const navigation = useNavigation<Nav>()
  const storedPref = useOnboardingStore((s) => s.dietPreference)
  const setDietPreference = useOnboardingStore((s) => s.setDietPreference)

  const [selectedId, setSelectedId] = useState<string>(storedPref)

  const handleContinue = () => {
    setDietPreference(selectedId)
    navigation.navigate('Lifestyle')
  }

  return (
    <ScreenWrapper padded={false}>
      <OnboardingStep title="Diyet Tercihi" description="Beslenme tercihinizi seçin. Tarifler ve planlar buna göre uyarlanacak." currentStep={4} totalSteps={7}>
        <DietPreferenceSelector selectedId={selectedId} onSelect={setSelectedId} title="" style={{ padding: 0 }} />
        <View style={s.spacer} />
        <Button title="Devam Et" onPress={handleContinue} disabled={!selectedId} fullWidth size="lg" style={s.btn} />
      </OnboardingStep>
    </ScreenWrapper>
  )
}
const s = StyleSheet.create({ spacer: { flex: 1, minHeight: 16 }, btn: { shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 } })
