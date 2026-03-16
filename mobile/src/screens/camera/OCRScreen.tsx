import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function OCRScreen() {
  const navigation = useNavigation()
  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Etiket Oku (OCR)" onBack={() => navigation.goBack()} />
      <View className="flex-1 bg-[#0A0A0A] items-center justify-center">
        <View className="w-72 h-44 border-2 border-white/30 rounded-2xl items-center justify-center">
          <Ionicons name="document-text-outline" size={56} color="rgba(255,255,255,0.4)" />
          <Text className="text-white/50 text-sm mt-3">Besin etiketi çerçeveye alın</Text>
        </View>
        <Text className="text-white/30 text-xs mt-8 px-12 text-center">
          Ürün üzerindeki besin değerleri tablosunu okuyarak otomatik olarak tanımlayın
        </Text>
      </View>
    </ScreenWrapper>
  )
}
