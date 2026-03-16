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
    <ScreenWrapper keyboardAvoiding padded={false}>
      <AppHeader title="" onBack={() => navigation.goBack()} transparent />
      <View className="flex-1 px-6 pt-2 bg-[#F8FAF9]">
        <Text className="text-3xl font-bold text-[#1A2E23] mb-2">Hesap Oluşturun</Text>
        <Text className="text-base text-[#5A7264] mb-6">Sağlıklı yaşama ilk adımınızı atın</Text>

        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <Text className="text-base text-red-500">{error}</Text>
          </View>
        ) : null}

        <View className="gap-4 mb-8">
          <Input
            label="Ad Soyad"
            placeholder="Adınız ve soyadınız"
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
            label="Şifre"
            placeholder="En az 6 karakter"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Input
            label="Şifre Tekrar"
            placeholder="Şifrenizi tekrar girin"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <Button
          title="Kayıt Ol"
          onPress={handleRegister}
          loading={isLoading}
          fullWidth
          size="lg"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
        />
      </View>

      <View className="flex-row justify-center py-8 bg-[#F8FAF9]">
        <Text className="text-base text-[#5A7264]">Zaten hesabınız var mı? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="text-base font-semibold text-[#1A5C37]">Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}

// Stylesheet replaced with Tailwind CSS classes
