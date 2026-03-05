import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { GoalSelector } from '../../components/onboarding/GoalSelector'
import { Button } from '../../components/ui/Button'
import { spacing } from '../../theme/spacing'

type Nav = StackNavigationProp<OnboardingStackParamList, 'Goal'>

const goals = [
  { id: 'lose', title: 'Kilo Vermek', description: 'Saglikli bir sekilde kilo verme hedefi' },
  { id: 'gain', title: 'Kilo Almak', description: 'Kas kutlesi ve kilo kazanma hedefi' },
  { id: 'maintain', title: 'Kilo Korumak', description: 'Mevcut kilonuzu koruma hedefi' },
  { id: 'health', title: 'Saglikli Beslenmek', description: 'Genel saglik ve dengeli beslenme' },
  { id: 'muscle', title: 'Kas Gelistirmek', description: 'Kas kutlesi artirma ve seklini koruma' },
]

export default function GoalScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedGoal, setSelectedGoal] = useState('')

  return (
    <ScreenWrapper>
      <OnboardingStep
        title="Hedefiniz"
        description="Beslenme hedefinizi secin. Planlariniz buna gore olusturulacak."
        currentStep={2}
        totalSteps={7}
      >
        <GoalSelector
          goals={goals}
          selectedGoalId={selectedGoal}
          onSelect={setSelectedGoal}
          title=""
          style={{ padding: 0 }}
        />
        <View style={styles.spacer} />
        <Button
          title="Devam Et"
          onPress={() => navigation.navigate('Allergy')}
          disabled={!selectedGoal}
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
