import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProfileStackParamList>

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', native: 'Türkçe' },
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'de', name: 'Almanca', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'fr', name: 'Fransızca', flag: '🇫🇷', native: 'Français' },
  { code: 'es', name: 'İspanyolca', flag: '🇪🇸', native: 'Español' },
  { code: 'ar', name: 'Arapça', flag: '🇸🇦', native: 'العربية' },
  { code: 'ru', name: 'Rusça', flag: '🇷🇺', native: 'Русский' },
  { code: 'ja', name: 'Japonca', flag: '🇯🇵', native: '日本語' },
]

export default function LanguageScreen() {
  const navigation = useNavigation<Nav>()
  const [selected, setSelected] = useState('tr')

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Dil Seçimi" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        <Text style={st.hint}>Uygulama dilini seçin. Değişiklik hemen uygulanır.</Text>
        {languages.map((lang) => (
          <TouchableOpacity key={lang.code} style={[st.langCard, { borderColor: selected === lang.code ? colors.primary.main : '#E8F0EC' }]} activeOpacity={0.7} onPress={() => setSelected(lang.code)}>
            <Text style={st.flag}>{lang.flag}</Text>
            <View style={st.langContent}>
              <Text style={st.langName}>{lang.name}</Text>
              <Text style={st.langNative}>{lang.native}</Text>
            </View>
            {selected === lang.code && (
              <View style={st.checkCircle}><Ionicons name="checkmark" size={14} color="#FFFFFF" /></View>
            )}
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  hint: { fontSize: 14, color: colors.text.secondary, marginBottom: 16 },
  langCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1 },
  flag: { fontSize: 20, marginRight: 12 },
  langContent: { flex: 1 },
  langName: { fontSize: 16, fontWeight: fontWeights.semibold, color: colors.text.primary },
  langNative: { fontSize: 12, color: colors.text.secondary },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary.main, alignItems: 'center', justifyContent: 'center' },
})
