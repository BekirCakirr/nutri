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
import { fontWeights } from '../../theme/typography'

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
    <ScreenWrapper keyboardAvoiding padded={false}>
      <OnboardingStep title="Diyetisyen Eşleştirme" description="Diyetisyeninizin size verdiği kodu girin veya QR kodu okutun." currentStep={6} totalSteps={7}>
        <View style={s.modeRow}>
          <TouchableOpacity onPress={() => setMode('code')} style={[s.modeCard, mode === 'code' && s.modeCardActive]} activeOpacity={0.7}>
            <Text style={[s.modeLabel, mode === 'code' && s.modeLabelActive]}>📝 Kod Gir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('qr')} style={[s.modeCard, mode === 'qr' && s.modeCardActive]} activeOpacity={0.7}>
            <Text style={[s.modeLabel, mode === 'qr' && s.modeLabelActive]}>📷 QR Tara</Text>
          </TouchableOpacity>
        </View>

        {mode === 'code' ? (
          <PairCodeInput onSubmit={handleCodeSubmit} loading={loading} style={{ padding: 0 }} />
        ) : (
          <View style={s.qrArea}>
            <View style={s.qrBox}>
              <Text style={s.qrEmoji}>📷</Text>
              <Text style={s.qrText}>Kamera ile QR kodu tarayın</Text>
            </View>
          </View>
        )}

        <View style={s.spacer} />
        <Button title="Şimdilik Atla" onPress={() => navigation.navigate('CalculationResult')} variant="ghost" fullWidth size="lg" />
      </OnboardingStep>
    </ScreenWrapper>
  )
}

const s = StyleSheet.create({
  modeRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  modeCard: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.border, backgroundColor: '#fff', alignItems: 'center' },
  modeCardActive: { borderColor: colors.primary.main, backgroundColor: colors.primary[50] },
  modeLabel: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.secondary },
  modeLabelActive: { color: colors.primary.main },
  qrArea: { alignItems: 'center', paddingVertical: 40 },
  qrBox: { width: 224, height: 224, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  qrEmoji: { fontSize: 48, marginBottom: 12 },
  qrText: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', paddingHorizontal: 24 },
  spacer: { flex: 1, minHeight: 16 },
})
