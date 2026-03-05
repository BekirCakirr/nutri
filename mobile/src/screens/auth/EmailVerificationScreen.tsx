import React, { useState, useRef } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { Button } from '../../components/ui/Button'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

const CODE_LENGTH = 6

export default function EmailVerificationScreen() {
  const navigation = useNavigation()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<TextInput>(null)

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
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    // On success, auth store would handle navigation
  }

  const handleResend = async () => {
    // Simulate resend
    await new Promise((r) => setTimeout(r, 500))
  }

  return (
    <ScreenWrapper keyboardAvoiding>
      <AppHeader title="E-posta Dogrulama" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>Dogrulama Kodu</Text>
        <Text style={styles.description}>
          E-posta adresinize gonderilen 6 haneli dogrulama kodunu girin.
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
