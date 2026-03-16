import React, { useState } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { DietPreferenceSelector } from '../../components/onboarding/DietPreferenceSelector'
import { Button } from '../../components/ui/Button'

type Nav = StackNavigationProp<OnboardingStackParamList, 'DietPreference'>

export default function DietPreferenceScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedId, setSelectedId] = useState('')

  return (
    <ScreenWrapper padded={false}>
      <OnboardingStep
        title="Diyet Tercihi"
        description="Beslenme tercihinizi seçin. Tarifler ve planlar buna göre uyarlanacak."
        currentStep={4}
        totalSteps={7}
      >
        <DietPreferenceSelector
          selectedId={selectedId}
          onSelect={setSelectedId}
          title=""
          style={{ padding: 0 }}
        />
        <View className="flex-1 min-h-[16px]" />
        <Button
          title="Devam Et"
          onPress={() => navigation.navigate('Lifestyle')}
          disabled={!selectedId}
          fullWidth
          size="lg"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
        />
      </OnboardingStep>
    </ScreenWrapper>
  )
}
