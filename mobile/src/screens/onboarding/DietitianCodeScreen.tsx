import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { PairCodeInput } from '../../components/dietitian/PairCodeInput'
import { Button } from '../../components/ui/Button'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<OnboardingStackParamList, 'DietitianCode'>

export default function DietitianCodeScreen() {
  const navigation = useNavigation<Nav>()
  const [mode, setMode] = useState<'code' | 'qr'>('code')
  const [loading, setLoading] = useState(false)

  const handleCodeSubmit = async (_code: string) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    navigation.navigate('CalculationResult')
  }

  return (
    <ScreenWrapper keyboardAvoiding>
      <OnboardingStep
        title="Diyetisyen Eslestirme"
        description="Diyetisyeninizin size verdigi kodu girin veya QR kodu okutun."
        currentStep={6}
        totalSteps={7}
      >
        {/* Mode selector */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            onPress={() => setMode('code')}
            style={[styles.modeTab, mode === 'code' && styles.modeTabActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.modeText, mode === 'code' && styles.modeTextActive]}>
              Kod Gir
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode('qr')}
            style={[styles.modeTab, mode === 'qr' && styles.modeTabActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.modeText, mode === 'qr' && styles.modeTextActive]}>
              QR Tara
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'code' ? (
          <PairCodeInput
            onSubmit={handleCodeSubmit}
            loading={loading}
            style={{ padding: 0 }}
          />
        ) : (
          <View style={styles.qrPlaceholder}>
            <View style={styles.qrFrame}>
              <Text style={styles.qrText}>Kamera ile QR kodu tarayin</Text>
            </View>
          </View>
        )}

        <View style={styles.spacer} />

        <Button
          title="Simdilik Atla"
          onPress={() => navigation.navigate('CalculationResult')}
          variant="ghost"
          fullWidth
          size="lg"
        />
      </OnboardingStep>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  modeTab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  modeTabActive: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary[50],
  },
  modeText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
  modeTextActive: {
    color: colors.primary.main,
    fontWeight: fontWeights.semibold,
  },
  qrPlaceholder: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  qrFrame: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.paper,
  },
  qrText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
})
