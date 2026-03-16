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
    <ScreenWrapper keyboardAvoiding padded={false}>
      <AppHeader title="Şifremi Unuttum" onBack={() => navigation.goBack()} />
      <View className="flex-1 px-6 pt-8 bg-[#F8FAF9]">
        {sent ? (
          <View className="flex-1 justify-center items-center px-4">
            <View className="w-20 h-20 rounded-full bg-[#E8F5EC] items-center justify-center mb-6">
              <Text className="text-4xl">💌</Text>
            </View>
            <Text className="text-2xl font-bold text-[#1A2E23] mb-2">E-posta Gönderildi</Text>
            <Text className="text-base text-[#5A7264] text-center leading-relaxed">
              Şifre sıfırlama bağlantısı {email} adresine gönderildi.
              Lütfen e-postanızı kontrol edin.
            </Text>
            <Button
              title="Giriş Sayfasına Dön"
              onPress={() => navigation.goBack()}
              fullWidth
              size="lg"
              style={{ marginTop: 32 }}
            />
          </View>
        ) : (
          <>
            <Text className="text-3xl font-bold text-[#1A2E23] mb-3">Şifrenizi mi unuttunuz?</Text>
            <Text className="text-lg text-[#5A7264] leading-relaxed mb-8">
              Kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı göndereceğiz.
            </Text>
            
            <View className="mb-6">
              <Input
                label="E-posta"
                placeholder="ornek@nutriai.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <Button
              title="Sıfırlama Linki Gönder"
              onPress={handleSend}
              loading={loading}
              disabled={!email.trim()}
              fullWidth
              size="lg"
              style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
            />
          </>
        )}
      </View>
    </ScreenWrapper>
  )
}

// Stylesheet replaced with Tailwind CSS classes
