import React, { useState } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { LifestyleSelector } from '../../components/onboarding/LifestyleSelector'
import { Button } from '../../components/ui/Button'

type Nav = StackNavigationProp<OnboardingStackParamList, 'Lifestyle'>

export default function LifestyleScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedId, setSelectedId] = useState('')

  return (
    <ScreenWrapper padded={false}>
      <OnboardingStep
        title="Yaşam Tarzı"
        description="Günlük aktivite seviyeniz kalori hedefinizi belirlemede önemlidir."
        currentStep={5}
        totalSteps={7}
      >
        <LifestyleSelector
          selectedId={selectedId}
          onSelect={setSelectedId}
          title=""
          style={{ padding: 0 }}
        />
        <View className="flex-1 min-h-[16px]" />
        <Button
          title="Devam Et"
          onPress={() => navigation.navigate('DietitianCode')}
          disabled={!selectedId}
          fullWidth
          size="lg"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
        />
      </OnboardingStep>
    </ScreenWrapper>
  )
}
