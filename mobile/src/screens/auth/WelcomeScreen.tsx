import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { AuthStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { Button } from '../../components/ui/Button'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<AuthStackParamList, 'Welcome'>

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <View className="flex-1 justify-between px-6 pt-16 pb-12 bg-[#F8FAF9]">
        {/* Top brand area */}
        <View className="items-center mt-8">
          <View className="w-28 h-28 rounded-3xl bg-[#E8F5EC] items-center justify-center mb-6 shadow-sm border border-[#C8E6CF]/30">
            <Image
              source={require('../../../assets/logo-icon.png')}
              className="w-16 h-16"
              resizeMode="contain"
            />
          </View>
          <Text className="text-4xl font-extrabold text-[#154D2E] tracking-tight">
            Nutri<Text className="text-[#4ECDC4]">AI</Text>
          </Text>
          <View className="w-10 h-1.5 rounded-full bg-[#A0D4AD] my-5" />
          <Text className="text-sm font-medium text-[#5A7264] tracking-widest uppercase">
            Akıllı Beslenme Asistanı
          </Text>
        </View>

        {/* Middle content */}
        <View className="px-2 mt-4">
          <Text className="text-3xl font-bold text-[#1A2E23] mb-4 leading-snug">
            Sağlıklı yaşam{'\n'}yolculuğunuz başlıyor
          </Text>
          <Text className="text-lg text-[#5A7264] leading-relaxed">
            Diyetisyeninizle birlikte beslenme hedeflerinize ulaşın.
            AI destekli kişisel takip artık çok kolay.
          </Text>
        </View>

        {/* Bottom actions */}
        <View className="gap-4 mt-8">
          <Button
            title="Giriş Yap"
            onPress={() => navigation.navigate('Login')}
            fullWidth
            size="lg"
            style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          />
          <Button
            title="Yeni Hesap Oluştur"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            fullWidth
            size="lg"
            style={{ backgroundColor: 'white' }}
          />
        </View>
      </View>
    </ScreenWrapper>
  )
}

// Stylesheet completely removed, refactored to Nativewind tailwind classes
