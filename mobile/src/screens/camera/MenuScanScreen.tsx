import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function MenuScanScreen() {
  const navigation = useNavigation()
  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Menü Tara" onBack={() => navigation.goBack()} />
      <View className="flex-1 bg-[#0A0A0A] items-center justify-center">
        <View className="w-72 h-96 border-2 border-white/30 rounded-2xl items-center justify-center">
          <Ionicons name="reader-outline" size={56} color="rgba(255,255,255,0.4)" />
          <Text className="text-white/50 text-sm mt-3 text-center px-6">
            Restoran menüsünü çerçeveye alın
          </Text>
        </View>
        <Text className="text-white/30 text-xs mt-6 px-12 text-center">
          AI menüdeki yemekleri tanımlayıp besin değerlerini hesaplayacak
        </Text>
      </View>
    </ScreenWrapper>
  )
}
