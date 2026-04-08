import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function MenuScanScreen() {
  const navigation = useNavigation()
  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Menü Tara" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 288, height: 384, borderWidth: 2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }} /* TODO: border-white/30 */>
          <Ionicons name="reader-outline" size={56} color="rgba(255,255,255,0.4)" />
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 12, textAlign: 'center', paddingHorizontal: 24 }}>
            Restoran menüsünü çerçeveye alın
          </Text>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 24, paddingHorizontal: 48, textAlign: 'center' }}>
          AI menüdeki yemekleri tanımlayıp besin değerlerini hesaplayacak
        </Text>
      </View>
    </ScreenWrapper>
  )
}
