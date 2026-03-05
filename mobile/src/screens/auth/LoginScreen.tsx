import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
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

type Nav = StackNavigationProp<AuthStackParamList, 'Login'>

export default function LoginScreen() {
  const navigation = useNavigation<Nav>()
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Lutfen tum alanlari doldurun.')
      return
    }
    setError('')
    try {
      await login(email, password)
    } catch {
      setError('Giris basarisiz. Lutfen bilgilerinizi kontrol edin.')
    }
  }

  return (
    <ScreenWrapper keyboardAvoiding>
      <AppHeader title="" onBack={() => navigation.goBack()} transparent />
      <View style={styles.form}>
        <Image
          source={require('../../../assets/logo-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Tekrar Hos Geldiniz</Text>
        <Text style={styles.subtitle}>Hesabiniza giris yapin</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

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
          placeholder="Sifrenizi girin"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotLink}
        >
          <Text style={styles.forgotText}>Sifremi Unuttum</Text>
        </TouchableOpacity>

        <Button
          title="Giris Yap"
          onPress={handleLogin}
          loading={isLoading}
          fullWidth
          size="lg"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Hesabiniz yok mu? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerLink}>Kayit Ol</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 48,
    height: 48,
    marginBottom: spacing.lg,
  },
  form: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  forgotText: {
    fontSize: fontSizes.md,
    color: colors.primary.main,
    fontWeight: fontWeights.medium,
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
