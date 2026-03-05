import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<OnboardingStackParamList, 'BasicInfo'>

const genders = [
  { id: 'female', label: 'Kadin' },
  { id: 'male', label: 'Erkek' },
  { id: 'other', label: 'Diger' },
]

export default function BasicInfoScreen() {
  const navigation = useNavigation<Nav>()
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  const canContinue = birthDate.trim() && gender && height.trim() && weight.trim()

  return (
    <ScreenWrapper keyboardAvoiding>
      <OnboardingStep
        title="Temel Bilgiler"
        description="Size ozel beslenme plani olusturabilmemiz icin bazi bilgilere ihtiyacimiz var."
        currentStep={1}
        totalSteps={7}
      >
        <Input
          label="Dogum Tarihi"
          placeholder="GG/AA/YYYY"
          value={birthDate}
          onChangeText={setBirthDate}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Cinsiyet</Text>
        <View style={styles.segmentRow}>
          {genders.map((g) => (
            <TouchableOpacity
              key={g.id}
              onPress={() => setGender(g.id)}
              style={[styles.segment, gender === g.id && styles.segmentActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.segmentText, gender === g.id && styles.segmentTextActive]}>
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label="Boy (cm)"
              placeholder="165"
              value={height}
              onChangeText={setHeight}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="Kilo (kg)"
              placeholder="68"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.spacer} />
        <Button
          title="Devam Et"
          onPress={() => navigation.navigate('Goal')}
          disabled={!canContinue}
          fullWidth
          size="lg"
        />
      </OnboardingStep>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  segmentActive: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary[50],
  },
  segmentText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
  segmentTextActive: {
    color: colors.primary.main,
    fontWeight: fontWeights.semibold,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
})
