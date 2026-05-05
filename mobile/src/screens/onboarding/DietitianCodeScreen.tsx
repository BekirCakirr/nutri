import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useOnboardingStore } from '../../stores/onboardingStore'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<OnboardingStackParamList, 'DietitianCode'>

/**
 * Step 6 — optional invite code from a dietitian.
 *
 * Backend invite codes are formatted like "DYT-AYSE-X7K9" (variable length,
 * alphanumeric + hyphens), so we accept any non-empty string. The actual
 * pairing API call happens at the end of onboarding (CalculationResultScreen)
 * so the user only sees one consolidated network operation.
 */
export default function DietitianCodeScreen() {
  const navigation = useNavigation<Nav>()
  const storedCode = useOnboardingStore((s) => s.inviteCode)
  const setInviteCode = useOnboardingStore((s) => s.setInviteCode)

  const [mode, setMode] = useState<'code' | 'qr'>('code')
  const [code, setCode] = useState(storedCode || '')

  const handleSubmit = () => {
    const trimmed = code.trim().toUpperCase()
    setInviteCode(trimmed)
    navigation.navigate('CalculationResult')
  }

  const handleSkip = () => {
    setInviteCode('')
    navigation.navigate('CalculationResult')
  }

  return (
    <ScreenWrapper keyboardAvoiding padded={false}>
      <OnboardingStep title="Diyetisyen Eşleştirme" description="Diyetisyeninizin size verdiği kodu girin veya boş bırakıp ilerleyin." currentStep={6} totalSteps={7}>
        <View style={s.modeRow}>
          <TouchableOpacity onPress={() => setMode('code')} style={[s.modeCard, mode === 'code' && s.modeCardActive]} activeOpacity={0.7}>
            <Text style={[s.modeLabel, mode === 'code' && s.modeLabelActive]}>📝 Kod Gir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('qr')} style={[s.modeCard, mode === 'qr' && s.modeCardActive]} activeOpacity={0.7}>
            <Text style={[s.modeLabel, mode === 'qr' && s.modeLabelActive]}>📷 QR Tara</Text>
          </TouchableOpacity>
        </View>

        {mode === 'code' ? (
          <View style={{ gap: 12 }}>
            <Input
              label="Davet Kodu"
              placeholder="DYT-AYSE-X7K9"
              value={code}
              onChangeText={(t) => setCode(t.toUpperCase())}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Text style={s.hint}>Diyetisyeninizden aldigniz kodu olduğu gibi girin (büyük/küçük harf farketmez).</Text>
            <Button
              title="Diyetisyeni Eşle"
              onPress={handleSubmit}
              disabled={code.trim().length < 4}
              fullWidth
              size="lg"
              style={s.btn}
            />
          </View>
        ) : (
          <View style={s.qrArea}>
            <View style={s.qrBox}>
              <Text style={s.qrEmoji}>📷</Text>
              <Text style={s.qrText}>Kamera ile QR kodu tarayın</Text>
            </View>
          </View>
        )}

        <View style={s.spacer} />
        <Button title="Şimdilik Atla" onPress={handleSkip} variant="ghost" fullWidth size="lg" />
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
  hint: { fontSize: 12, color: colors.text.secondary, lineHeight: 18 },
  spacer: { flex: 1, minHeight: 16 },
  btn: { shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
})
