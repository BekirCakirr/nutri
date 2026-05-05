import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { BMIResult } from '../../components/onboarding/BMIResult'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'
import {
  useOnboardingStore,
  birthDateToISO,
  calculateBMI,
  calculateDailyCalories,
} from '../../stores/onboardingStore'
import * as patientApi from '../../services/api/patient'
import { pairWithDietitian } from '../../services/api/dietitian'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

/**
 * Final onboarding step — shows computed BMI / calorie target / macros and
 * persists the entire collected profile to the backend on "Basla 🎉":
 *   1. PUT /patients/me with snake_case fields
 *   2. POST /dietitians/pair with { inviteCode } (only if user provided a code)
 *   3. Flip auth.isOnboarded → true so RootNavigator swaps to Main
 */
export default function CalculationResultScreen() {
  const navigation = useNavigation()
  const setOnboarded = useAuthStore((s) => s.setOnboarded)
  const onboardingState = useOnboardingStore()
  const resetOnboarding = useOnboardingStore((s) => s.reset)

  const [submitting, setSubmitting] = useState(false)

  const heightCm = onboardingState.heightCm ?? 0
  const weightKg = onboardingState.currentWeightKg ?? 0

  // Compute results from real onboarding data (no more mock numbers)
  const { bmi, dailyCalories, macros } = useMemo(() => {
    const bmiVal = calculateBMI(heightCm, weightKg)
    const calories = calculateDailyCalories(onboardingState)
    // Standard macro split: 20% protein / 50% carbs / 30% fat
    return {
      bmi: bmiVal,
      dailyCalories: calories,
      macros: {
        protein: Math.round((calories * 0.2) / 4),
        carbs: Math.round((calories * 0.5) / 4),
        fat: Math.round((calories * 0.3) / 9),
      },
    }
  }, [heightCm, weightKg, onboardingState])

  const handleComplete = async () => {
    setSubmitting(true)
    try {
      // 1) Persist profile to backend (snake_case fields, undefined entries
      //    are filtered out inside patientApi.updateMyProfile)
      const profilePayload: patientApi.UpdateMyProfilePayload = {
        birth_date: birthDateToISO(onboardingState.birthDate),
        gender: onboardingState.gender || undefined,
        height_cm: onboardingState.heightCm ?? undefined,
        current_weight_kg: onboardingState.currentWeightKg ?? undefined,
        target_weight_kg: onboardingState.targetWeightKg ?? undefined,
        activity_level: onboardingState.activityLevel || undefined,
        goal_type: onboardingState.goalType || undefined,
        diet_type: onboardingState.dietPreference || undefined,
      }

      try {
        await patientApi.updateMyProfile(profilePayload)
      } catch (err: any) {
        // Show real backend message but DON'T block — user can retry from
        // profile screen if needed, the demo flow shouldn't dead-end here.
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Profil kaydedilemedi'
        console.warn('[onboarding] updateMyProfile failed:', msg)
        Alert.alert('Profil Kaydedilemedi', msg + '\n\nDevam ediliyor.')
      }

      // 2) Pair with dietitian if a code was entered
      if (onboardingState.inviteCode) {
        try {
          await pairWithDietitian(onboardingState.inviteCode)
        } catch (err: any) {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            'Esleme basarisiz'
          // Pairing failure is not fatal — the user can pair later from profile.
          Alert.alert(
            'Diyetisyen Eslemesi Basarisiz',
            `${msg}\n\nDaha sonra profilinizden tekrar deneyebilirsiniz.`,
          )
        }
      }

      // 3) Mark onboarding complete — RootNavigator switches to MainTab.
      resetOnboarding()
      setOnboarded(true)
    } finally {
      setSubmitting(false)
    }
  }

  // Safety net: if onboarding store is empty (someone navigated here directly
  // without filling the previous steps), bounce them back to step 1.
  const hasMinimalData = heightCm > 0 && weightKg > 0
  if (!hasMinimalData) {
    return (
      <ScreenWrapper padded={false}>
        <OnboardingStep title="Sonuçlarınız" description="Eksik bilgiler var. Lütfen baştan başlayın." currentStep={7} totalSteps={7}>
          <View style={s.spacer} />
          <Button
            title="Bilgileri Doldur"
            onPress={() => (navigation as any).navigate('BasicInfo')}
            fullWidth
            size="lg"
            style={s.btn}
          />
        </OnboardingStep>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper padded={false}>
      <OnboardingStep title="Sonuçlarınız" description="Bilgilerinize göre hesaplanan beslenme hedefleriniz." currentStep={7} totalSteps={7}>
        <BMIResult bmi={bmi} height={heightCm} weight={weightKg} style={{ marginBottom: 16 }} />

        <View style={s.calorieCard}>
          <Text style={s.calorieLabel}>Günlük Kalori Hedefi</Text>
          <Text style={s.calorieValue}>{dailyCalories}</Text>
          <Text style={s.calorieUnit}>kcal</Text>
        </View>

        <View style={s.macroRow}>
          {[
            { label: 'Protein', value: macros.protein, color: '#EF4444' },
            { label: 'Karbonhidrat', value: macros.carbs, color: '#3B82F6' },
            { label: 'Yağ', value: macros.fat, color: '#F59E0B' },
          ].map((m) => (
            <View key={m.label} style={s.macroCard}>
              <View style={[s.macroDot, { backgroundColor: m.color }]} />
              <Text style={s.macroLabel}>{m.label}</Text>
              <Text style={s.macroValue}>{m.value}g</Text>
            </View>
          ))}
        </View>

        <View style={s.spacer} />
        <Button title="Başla 🎉" onPress={handleComplete} loading={submitting} fullWidth size="lg" style={s.btn} />
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
