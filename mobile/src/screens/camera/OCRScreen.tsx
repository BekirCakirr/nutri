import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function OCRScreen() {
  const navigation = useNavigation()
  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Etiket Oku (OCR)" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 288, height: 176, borderWidth: 2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }} /* TODO: border-white/30 */>
          <Ionicons name="document-text-outline" size={56} color="rgba(255,255,255,0.4)" />
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 12 }}>Besin etiketi çerçeveye alın</Text>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 32, paddingHorizontal: 48, textAlign: 'center' }}>
          Ürün üzerindeki besin değerleri tablosunu okuyarak otomatik olarak tanımlayın
        </Text>
      </View>
    </ScreenWrapper>
  )
}
