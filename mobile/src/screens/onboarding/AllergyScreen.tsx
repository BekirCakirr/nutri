import React, { useState } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { AllergySelector } from '../../components/onboarding/AllergySelector'
import { Button } from '../../components/ui/Button'

type Nav = StackNavigationProp<OnboardingStackParamList, 'Allergy'>

export default function AllergyScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <ScreenWrapper padded={false}>
      <OnboardingStep
        title="Alerjiler"
        description="Varsa besin alerjilerinizi seçin. Bu bilgi güvenliğiniz için önemlidir."
        currentStep={3}
        totalSteps={7}
      >
        <AllergySelector
          allergies={[]}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          title=""
          subtitle=""
          style={{ padding: 0 }}
        />
        <View className="flex-1 min-h-[16px]" />
        <Button
          title="Devam Et"
          onPress={() => navigation.navigate('DietPreference')}
          fullWidth
          size="lg"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
        />
      </OnboardingStep>
    </ScreenWrapper>
  )
}
