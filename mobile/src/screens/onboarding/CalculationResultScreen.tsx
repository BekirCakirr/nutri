import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { BMIResult } from '../../components/onboarding/BMIResult'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

const mockBMI = 25.0
const mockHeight = 165
const mockWeight = 68
const mockDailyCalories = 1650
const mockMacros = { protein: 82, carbs: 206, fat: 55 }

export default function CalculationResultScreen() {
  const navigation = useNavigation()
  const setOnboarded = useAuthStore((s) => s.setOnboarded)
  const handleComplete = () => setOnboarded(true)

  return (
    <ScreenWrapper padded={false}>
      <OnboardingStep title="Sonuçlarınız" description="Bilgilerinize göre hesaplanan beslenme hedefleriniz." currentStep={7} totalSteps={7}>
        <BMIResult bmi={mockBMI} height={mockHeight} weight={mockWeight} style={{ marginBottom: 16 }} />

        <View style={s.calorieCard}>
          <Text style={s.calorieLabel}>Günlük Kalori Hedefi</Text>
          <Text style={s.calorieValue}>{mockDailyCalories}</Text>
          <Text style={s.calorieUnit}>kcal</Text>
        </View>

        <View style={s.macroRow}>
          {[
            { label: 'Protein', value: mockMacros.protein, color: '#EF4444' },
            { label: 'Karbonhidrat', value: mockMacros.carbs, color: '#3B82F6' },
            { label: 'Yağ', value: mockMacros.fat, color: '#F59E0B' },
          ].map((m) => (
            <View key={m.label} style={s.macroCard}>
              <View style={[s.macroDot, { backgroundColor: m.color }]} />
              <Text style={s.macroLabel}>{m.label}</Text>
              <Text style={s.macroValue}>{m.value}g</Text>
            </View>
          ))}
        </View>

        <View style={s.spacer} />
        <Button title="Başla 🎉" onPress={handleComplete} fullWidth size="lg" style={s.btn} />
      </OnboardingStep>
    </ScreenWrapper>
  )
}

const s = StyleSheet.create({
  calorieCard: { backgroundColor: colors.primary[50], borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: `${colors.primary[100]}80` },
  calorieLabel: { fontSize: 14, fontWeight: fontWeights.medium, color: colors.text.secondary, marginBottom: 4 },
  calorieValue: { fontSize: 48, fontWeight: fontWeights.bold, color: colors.primary.main },
  calorieUnit: { fontSize: 16, color: colors.text.secondary, marginTop: -4 },
  macroRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  macroCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  macroDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 8 },
  macroLabel: { fontSize: 12, color: colors.text.secondary, marginBottom: 4 },
  macroValue: { fontSize: 20, fontWeight: fontWeights.bold, color: colors.text.primary },
  spacer: { flex: 1, minHeight: 16 },
  btn: { shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
})
