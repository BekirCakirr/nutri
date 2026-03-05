import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { BMIResult } from '../../components/onboarding/BMIResult'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

// Mock calculation values
const mockBMI = 25.0
const mockHeight = 165
const mockWeight = 68
const mockDailyCalories = 1650
const mockMacros = { protein: 82, carbs: 206, fat: 55 }

export default function CalculationResultScreen() {
  const navigation = useNavigation()
  const setOnboarded = useAuthStore((s) => s.setOnboarded)

  const handleComplete = () => {
    setOnboarded(true)
  }

  return (
    <ScreenWrapper>
      <OnboardingStep
        title="Sonuclariniz"
        description="Bilgilerinize gore hesaplanan beslenme hedefleriniz."
        currentStep={7}
        totalSteps={7}
      >
        <BMIResult
          bmi={mockBMI}
          height={mockHeight}
          weight={mockWeight}
          style={{ marginBottom: spacing.lg }}
        />

        {/* Daily calorie target */}
        <View style={styles.calorieCard}>
          <Text style={styles.calorieLabel}>Gunluk Kalori Hedefi</Text>
          <Text style={styles.calorieValue}>{mockDailyCalories}</Text>
          <Text style={styles.calorieUnit}>kcal</Text>
        </View>

        {/* Macro distribution */}
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <View style={[styles.macroIndicator, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{mockMacros.protein}g</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroIndicator, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.macroLabel}>Karbonhidrat</Text>
            <Text style={styles.macroValue}>{mockMacros.carbs}g</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroIndicator, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.macroLabel}>Yag</Text>
            <Text style={styles.macroValue}>{mockMacros.fat}g</Text>
          </View>
        </View>

        <View style={styles.spacer} />

        <Button
          title="Basla"
          onPress={handleComplete}
          fullWidth
          size="lg"
        />
      </OnboardingStep>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  calorieCard: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  calorieLabel: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  calorieValue: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.extrabold,
    color: colors.primary.main,
  },
  calorieUnit: {
    fontSize: fontSizes.lg,
    color: colors.text.secondary,
    marginTop: -spacing.xs,
  },
  macroRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  macroItem: {
    flex: 1,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  macroIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  macroLabel: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  macroValue: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
})
