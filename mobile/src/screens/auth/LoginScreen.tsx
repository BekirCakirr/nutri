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
    <ScreenWrapper keyboardAvoiding padded={false}>
      <AppHeader title="" onBack={() => navigation.goBack()} transparent />
      <View className="flex-1 px-6 pt-4 bg-[#F8FAF9]">
        <View className="w-16 h-16 rounded-2xl bg-[#E8F5EC] items-center justify-center mb-6 shadow-sm border border-[#C8E6CF]/30">
          <Image
            source={require('../../../assets/logo-icon.png')}
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>
        <Text className="text-3xl font-bold text-[#1A2E23] mb-2">Tekrar Hoş Geldiniz</Text>
        <Text className="text-base text-[#5A7264] mb-8">Hesabınıza giriş yapın</Text>

        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <Text className="text-base text-red-500">{error}</Text>
          </View>
        ) : null}

        <View className="gap-5">
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
            placeholder="Şifrenizi girin"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          className="self-end mt-2 mb-8"
        >
          <Text className="text-base font-medium text-[#1A5C37]">Şifremi Unuttum</Text>
        </TouchableOpacity>

        <Button
          title="Giriş Yap"
          onPress={handleLogin}
          loading={isLoading}
          fullWidth
          size="lg"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
        />
      </View>

      <View className="flex-row justify-center py-8 bg-[#F8FAF9]">
        <Text className="text-base text-[#5A7264]">Hesabınız yok mu? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="text-base font-semibold text-[#1A5C37]">Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}

// Stylesheet replaced with Tailwind CSS classes
