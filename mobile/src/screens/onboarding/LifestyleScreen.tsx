import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { LifestyleSelector } from '../../components/onboarding/LifestyleSelector'
import { Button } from '../../components/ui/Button'
import { useOnboardingStore, type OnboardingData } from '../../stores/onboardingStore'
import { colors } from '../../theme/colors'

type Nav = StackNavigationProp<OnboardingStackParamList, 'Lifestyle'>

export default function LifestyleScreen() {
  const navigation = useNavigation<Nav>()
  const storedLevel = useOnboardingStore((s) => s.activityLevel)
  const setActivityLevel = useOnboardingStore((s) => s.setActivityLevel)

  const [selectedId, setSelectedId] = useState<string>(storedLevel)

  const handleContinue = () => {
    setActivityLevel(selectedId as OnboardingData['activityLevel'])
    navigation.navigate('DietitianCode')
  }

  return (
    <ScreenWrapper padded={false}>
      <OnboardingStep title="Yaşam Tarzı" description="Günlük aktivite seviyeniz kalori hedefinizi belirlemede önemlidir." currentStep={5} totalSteps={7}>
        <LifestyleSelector selectedId={selectedId} onSelect={setSelectedId} title="" style={{ padding: 0 }} />
        <View style={s.spacer} />
        <Button title="Devam Et" onPress={handleContinue} disabled={!selectedId} fullWidth size="lg" style={s.btn} />
      </OnboardingStep>
    </ScreenWrapper>
  )
}
const s = StyleSheet.create({ spacer: { flex: 1, minHeight: 16 }, btn: { shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 } })
