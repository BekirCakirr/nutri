import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { DietPreferenceSelector } from '../../components/onboarding/DietPreferenceSelector'
import { Button } from '../../components/ui/Button'
import { spacing } from '../../theme/spacing'

type Nav = StackNavigationProp<OnboardingStackParamList, 'DietPreference'>

export default function DietPreferenceScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedId, setSelectedId] = useState('')

  return (
    <ScreenWrapper>
      <OnboardingStep
        title="Diyet Tercihi"
        description="Beslenme tercihinizi secin. Tarifler ve planlar buna gore uyarlanacak."
        currentStep={4}
        totalSteps={7}
      >
        <DietPreferenceSelector
          selectedId={selectedId}
          onSelect={setSelectedId}
          title=""
          style={{ padding: 0 }}
        />
        <View style={styles.spacer} />
        <Button
          title="Devam Et"
          onPress={() => navigation.navigate('Lifestyle')}
          disabled={!selectedId}
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
