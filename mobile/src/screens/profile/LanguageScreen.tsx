import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

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
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-sm text-[#5A7264] mb-4">Uygulama dilini seçin. Değişiklik hemen uygulanır.</Text>

        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border"
            style={{ borderColor: selected === lang.code ? '#1A5C37' : '#E8F0EC' }}
            activeOpacity={0.7}
            onPress={() => setSelected(lang.code)}
          >
            <Text className="text-xl mr-3">{lang.flag}</Text>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{lang.name}</Text>
              <Text className="text-xs text-[#5A7264]">{lang.native}</Text>
            </View>
            {selected === lang.code && (
              <View className="w-6 h-6 rounded-full bg-[#1A5C37] items-center justify-center">
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
