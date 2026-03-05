import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { LifestyleSelector } from '../../components/onboarding/LifestyleSelector'
import { Button } from '../../components/ui/Button'
import { spacing } from '../../theme/spacing'

type Nav = StackNavigationProp<OnboardingStackParamList, 'Lifestyle'>

export default function LifestyleScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedId, setSelectedId] = useState('')

  return (
    <ScreenWrapper>
      <OnboardingStep
        title="Yasam Tarzi"
        description="Gunluk aktivite seviyeniz kalori hedefinizi belirlemede onemlidir."
        currentStep={5}
        totalSteps={7}
      >
        <LifestyleSelector
          selectedId={selectedId}
          onSelect={setSelectedId}
          title=""
          style={{ padding: 0 }}
        />
        <View style={styles.spacer} />
        <Button
          title="Devam Et"
          onPress={() => navigation.navigate('DietitianCode')}
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
