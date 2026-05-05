import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { AuthStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<AuthStackParamList, 'Register'>

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>()
  const register = useAuthStore((s) => s.register)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Lütfen tüm alanları doldurun.')
      return
    }
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.')
      return
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
      return
    }
    setError('')
    try {
      await register(name, email, password)
      // After successful registration the auth store flips isAuthenticated=true
      // with isOnboarded=false, which causes RootNavigator to swap us into the
      // OnboardingStack automatically. The EmailVerification screen is mock-only
      // and is no longer part of the happy path — we skip straight to onboarding.
    } catch (err: any) {
      const msg = err?.message || err?.response?.data?.message || 'Kayit basarisiz.'
      // Show real backend error verbatim — easier to debug during the demo.
      if (/zaten|already|exists/i.test(msg)) {
        setError('Bu e-posta zaten kayitli. Lutfen giris yapin.')
      } else {
        setError(msg)
      }
    }
  }

  return (
    <ScreenWrapper keyboardAvoiding padded={false}>
      <AppHeader title="" onBack={() => navigation.goBack()} transparent />
      <View style={styles.content}>
        <Text style={styles.title}>Hesap Oluşturun</Text>
        <Text style={styles.subtitle}>Sağlıklı yaşama ilk adımınızı atın</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Input label="Ad Soyad" placeholder="Adınız ve soyadınız" value={name} onChangeText={setName} autoCapitalize="words" />
          <Input label="E-posta" placeholder="ornek@nutriai.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          <Input label="Şifre" placeholder="En az 6 karakter" value={password} onChangeText={setPassword} secureTextEntry />
          <Input label="Şifre Tekrar" placeholder="Şifrenizi tekrar girin" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        </View>

        <Button
          title="Kayıt Ol"
          onPress={handleRegister}
          loading={isLoading}
          fullWidth
          size="lg"
          style={styles.registerBtn}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    backgroundColor: colors.background.default,
  },
  title: {
    fontSize: 30,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  inputGroup: {
    gap: 16,
    marginBottom: 32,
  },
  registerBtn: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: colors.background.default,
  },
  footerText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  footerLink: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    color: colors.primary.main,
  },
})
