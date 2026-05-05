import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

const CODE_LENGTH = 6
const AUTO_PASS_MS = 3000

/**
 * Mock e-mail verification screen. Real verification is not part of the demo —
 * we either auto-pass after 3 seconds, accept any 6-digit code, or let the
 * user skip with the "Atla" button. Either way we end up on the onboarding
 * stack via the auth store flag.
 */
export default function EmailVerificationScreen() {
  const navigation = useNavigation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [autoPassed, setAutoPassed] = useState(false)
  const inputRef = useRef<TextInput>(null)

  // Auto-pass mock — gives the demo a couple of seconds of "verifying" feel
  // and then flips the auth flag so RootNavigator routes us to onboarding.
  useEffect(() => {
    if (!isAuthenticated) return
    const t = setTimeout(() => {
      setAutoPassed(true)
    }, AUTO_PASS_MS)
    return () => clearTimeout(t)
  }, [isAuthenticated])

  // No-op: registration already set isAuthenticated=true + isOnboarded=false,
  // so RootNavigator has already swapped to OnboardingStack. We just keep the
  // visual feedback here. If the user is somehow not authenticated yet (e.g.
  // they navigated here directly from a deep link), we just go back.
  useEffect(() => {
    if (autoPassed && !isAuthenticated) {
      navigation.goBack()
    }
  }, [autoPassed, isAuthenticated, navigation])

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '')
    if (cleaned.length <= CODE_LENGTH) {
      setCode(cleaned)
      setError('')
    }
  }

  const handleVerify = async () => {
    if (code.length !== CODE_LENGTH) {
      setError('Lutfen 6 haneli kodu eksiksiz girin.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setAutoPassed(true)
  }

  const handleSkip = () => {
    setAutoPassed(true)
  }

  const handleResend = async () => {
    await new Promise((r) => setTimeout(r, 400))
  }

  return (
    <ScreenWrapper keyboardAvoiding>
      <AppHeader title="E-posta Dogrulama" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>Dogrulama Kodu</Text>
        <Text style={styles.description}>
          E-posta adresinize gonderilen 6 haneli dogrulama kodunu girin.
          {'\n'}(Demo modu: 3 saniye sonra otomatik gecilir.)
        </Text>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
          style={styles.codeRow}
        >
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.codeBox,
                i < code.length && styles.codeBoxFilled,
                error ? styles.codeBoxError : undefined,
              ]}
            >
              <Text style={styles.codeChar}>{code[i] || ''}</Text>
            </View>
          ))}
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={code}
          onChangeText={handleChange}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          autoFocus
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Dogrula"
          onPress={handleVerify}
          loading={loading}
          disabled={code.length !== CODE_LENGTH}
          fullWidth
          size="lg"
        />

        <View style={{ height: spacing.md }} />

        <Button
          title="Atla (Demo)"
          onPress={handleSkip}
          variant="ghost"
          fullWidth
        />

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Kod gelmedi mi? </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Tekrar Gonder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSizes.lg,
    color: colors.text.secondary,
    lineHeight: fontSizes.lg * 1.6,
    marginBottom: spacing.xl,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  codeBox: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.paper,
  },
  codeBoxFilled: {
    borderColor: colors.primary.main,
  },
  codeBoxError: {
    borderColor: colors.error,
  },
  codeChar: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  errorText: {
    fontSize: fontSizes.sm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  resendText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
  resendLink: {
    fontSize: fontSizes.md,
    color: colors.primary.main,
    fontWeight: fontWeights.semibold,
  },
})
