import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { AllergySelector } from '../../components/onboarding/AllergySelector'
import { Button } from '../../components/ui/Button'
import { spacing } from '../../theme/spacing'

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
    <ScreenWrapper>
      <OnboardingStep
        title="Alerjiler"
        description="Varsa besin alerjilerinizi secin. Bu bilgi guvenliginiz icin onemlidir."
        currentStep={3}
        totalSteps={7}
      >
        <AllergySelector
          allergies={undefined as any}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          title=""
          subtitle=""
          style={{ padding: 0 }}
        />
        <View style={styles.spacer} />
        <Button
          title="Devam Et"
          onPress={() => navigation.navigate('DietPreference')}
          fullWidth
          size="lg"
        />
      </OnboardingStep>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
})
