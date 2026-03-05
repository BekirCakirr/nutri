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
      setError('Lutfen tum alanlari doldurun.')
      return
    }
    if (password !== confirmPassword) {
      setError('Sifreler eslesmiyor.')
      return
    }
    if (password.length < 6) {
      setError('Sifre en az 6 karakter olmalidir.')
      return
    }
    setError('')
    try {
      await register(name, email, password)
      navigation.navigate('EmailVerification')
    } catch {
      setError('Kayit basarisiz. Lutfen tekrar deneyin.')
    }
  }

  return (
    <ScreenWrapper keyboardAvoiding>
      <AppHeader title="" onBack={() => navigation.goBack()} transparent />
      <View style={styles.form}>
        <Text style={styles.title}>Hesap Olusturun</Text>
        <Text style={styles.subtitle}>Saglikli yasama ilk adiminizi atin</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Input
          label="Ad Soyad"
          placeholder="Adiniz ve soyadiniz"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <Input
          label="E-posta"
          placeholder="ornek@nutriai.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          label="Sifre"
          placeholder="En az 6 karakter"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Input
          label="Sifre Tekrar"
          placeholder="Sifrenizi tekrar girin"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button
          title="Kayit Ol"
          onPress={handleRegister}
          loading={isLoading}
          fullWidth
          size="lg"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Zaten hesabiniz var mi? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Giris Yap</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: fontSizes.md,
    color: colors.error,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
  footerLink: {
    fontSize: fontSizes.md,
    color: colors.primary.main,
    fontWeight: fontWeights.semibold,
  },
})
