import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { GoalSelector } from '../../components/onboarding/GoalSelector'
import { Button } from '../../components/ui/Button'
import { colors } from '../../theme/colors'

type Nav = StackNavigationProp<OnboardingStackParamList, 'Goal'>

const goals = [
  { id: 'lose', title: 'Kilo Vermek', description: 'Sağlıklı bir şekilde kilo verme hedefi' },
  { id: 'gain', title: 'Kilo Almak', description: 'Kas kütlesi ve kilo kazanma hedefi' },
  { id: 'maintain', title: 'Kilo Korumak', description: 'Mevcut kilonuzu koruma hedefi' },
  { id: 'health', title: 'Sağlıklı Beslenmek', description: 'Genel sağlık ve dengeli beslenme' },
  { id: 'muscle', title: 'Kas Geliştirmek', description: 'Kas kütlesi artırma ve şeklini koruma' },
]

export default function GoalScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedGoal, setSelectedGoal] = useState('')

  return (
    <ScreenWrapper padded={false}>
      <OnboardingStep title="Hedefiniz" description="Beslenme hedefinizi seçin. Planlarınız buna göre oluşturulacak." currentStep={2} totalSteps={7}>
        <GoalSelector goals={goals} selectedGoalId={selectedGoal} onSelect={setSelectedGoal} title="" style={{ padding: 0 }} />
        <View style={styles.spacer} />
        <Button title="Devam Et" onPress={() => navigation.navigate('Allergy')} disabled={!selectedGoal} fullWidth size="lg" style={styles.btn} />
      </OnboardingStep>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  spacer: { flex: 1, minHeight: 16 },
  btn: { shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
})
