import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

export default function ForgotPasswordScreen() {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!email.trim()) return
    setLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <ScreenWrapper keyboardAvoiding>
      <AppHeader title="Sifremi Unuttum" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        {sent ? (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successEmoji}>{'\u2709\uFE0F'}</Text>
            </View>
            <Text style={styles.successTitle}>E-posta Gonderildi</Text>
            <Text style={styles.successText}>
              Sifre sifirlama baglantisi {email} adresine gonderildi.
              Lutfen e-postanizi kontrol edin.
            </Text>
            <Button
              title="Giris Sayfasina Don"
              onPress={() => navigation.goBack()}
              fullWidth
              size="lg"
              style={{ marginTop: spacing.xl }}
            />
          </View>
        ) : (
          <>
            <Text style={styles.title}>Sifrenizi mi unuttunuz?</Text>
            <Text style={styles.description}>
              Kayitli e-posta adresinizi girin. Sifre sifirlama baglantisi
              gonderecegiz.
            </Text>
            <Input
              label="E-posta"
              placeholder="ornek@nutriai.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Button
              title="Sifirlama Linki Gonder"
              onPress={handleSend}
              loading={loading}
              disabled={!email.trim()}
              fullWidth
              size="lg"
            />
          </>
        )}
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
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successEmoji: {
    fontSize: 32,
  },
  successTitle: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  successText: {
    fontSize: fontSizes.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: fontSizes.lg * 1.6,
  },
})
