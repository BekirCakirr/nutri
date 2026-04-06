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
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <ScreenWrapper keyboardAvoiding padded={false}>
      <AppHeader title="Şifremi Unuttum" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        {sent ? (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successEmoji}>💌</Text>
            </View>
            <Text style={styles.successTitle}>E-posta Gönderildi</Text>
            <Text style={styles.successText}>
              Şifre sıfırlama bağlantısı {email} adresine gönderildi.
              Lütfen e-postanızı kontrol edin.
            </Text>
            <Button title="Giriş Sayfasına Dön" onPress={() => navigation.goBack()} fullWidth size="lg" style={{ marginTop: 32 }} />
          </View>
        ) : (
          <>
            <Text style={styles.title}>Şifrenizi mi unuttunuz?</Text>
            <Text style={styles.description}>
              Kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı göndereceğiz.
            </Text>
            <View style={styles.inputWrap}>
              <Input label="E-posta" placeholder="ornek@nutriai.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>
            <Button title="Sıfırlama Linki Gönder" onPress={handleSend} loading={loading} disabled={!email.trim()} fullWidth size="lg" style={styles.sendBtn} />
          </>
        )}
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    backgroundColor: colors.background.default,
  },
  title: {
    fontSize: 30,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    color: colors.text.secondary,
    lineHeight: 28,
    marginBottom: 32,
  },
  inputWrap: {
    marginBottom: 24,
  },
  sendBtn: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 36,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
})
