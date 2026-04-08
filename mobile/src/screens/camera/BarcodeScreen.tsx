import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function BarcodeScreen() {
  const navigation = useNavigation()
  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Barkod Tara" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 256, height: 192, borderWidth: 2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }} /* TODO: border-white/30 */>
          <Ionicons name="barcode-outline" size={64} color="rgba(255,255,255,0.4)" />
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 12 }}>Barkodu çerçeveye alın</Text>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 32, paddingHorizontal: 48, textAlign: 'center' }}>
          Ürün barkodunu tarayarak besin değerlerini otomatik olarak ekleyin
        </Text>
      </View>
    </ScreenWrapper>
  )
}
