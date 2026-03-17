import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type ThemeOption = {
  id: string
  name: string
  desc: string
  colors: string[]
  icon: keyof typeof Ionicons.glyphMap
}

const themes: ThemeOption[] = [
  {
    id: 'light',
    name: 'Açık Tema',
    desc: 'Varsayılan beyaz arka plan',
    colors: ['#F8FAF9', '#FFFFFF', '#1A5C37', '#1A2E23'],
    icon: 'sunny-outline',
  },
  {
    id: 'dark',
    name: 'Koyu Tema',
    desc: 'Göz dostu karanlık mod',
    colors: ['#0F1A14', '#1A2E23', '#4ECDC4', '#F0F7F3'],
    icon: 'moon-outline',
  },
  {
    id: 'auto',
    name: 'Sistem Ayarı',
    desc: 'Cihaz ayarını takip et',
    colors: ['#F8FAF9', '#0F1A14', '#1A5C37', '#4ECDC4'],
    icon: 'phone-portrait-outline',
  },
]

const accentColors = [
  { name: 'Yeşil', color: '#1A5C37' },
  { name: 'Turkuaz', color: '#4ECDC4' },
  { name: 'Mavi', color: '#4A7FB5' },
  { name: 'Turuncu', color: '#E8A040' },
  { name: 'Kırmızı', color: '#C75B4A' },
  { name: 'Mor', color: '#8B6BAA' },
]

export default function ThemeScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedTheme, setSelectedTheme] = useState('light')
  const [selectedAccent, setSelectedAccent] = useState('#1A5C37')

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Tema Ayarları" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Theme selection */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Tema Modu</Text>
        {themes.map((theme) => (
          <TouchableOpacity
            key={theme.id}
            className="flex-row items-center bg-white rounded-xl px-4 py-4 mb-2.5 border-2"
            style={{ borderColor: selectedTheme === theme.id ? '#1A5C37' : '#E8F0EC' }}
            activeOpacity={0.7}
            onPress={() => setSelectedTheme(theme.id)}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: selectedTheme === theme.id ? '#E8F5EC' : '#F8FAF9' }}
            >
              <Ionicons name={theme.icon} size={20} color={selectedTheme === theme.id ? '#1A5C37' : '#5A7264'} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{theme.name}</Text>
              <Text className="text-xs text-[#5A7264]">{theme.desc}</Text>
            </View>
            {/* Color preview */}
            <View className="flex-row mr-2">
              {theme.colors.map((c, i) => (
                <View
                  key={i}
                  className="w-4 h-4 rounded-full -ml-1 border border-white"
                  style={{ backgroundColor: c }}
                />
              ))}
            </View>
            <View
              className="w-5 h-5 rounded-full border-2 items-center justify-center"
              style={{ borderColor: selectedTheme === theme.id ? '#1A5C37' : '#D4E2DA' }}
            >
              {selectedTheme === theme.id && <View className="w-2.5 h-2.5 rounded-full bg-[#1A5C37]" />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Accent color */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3 mt-4">Vurgu Rengi</Text>
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <View className="flex-row justify-between">
            {accentColors.map((ac) => (
              <TouchableOpacity
                key={ac.color}
                className="items-center"
                activeOpacity={0.7}
                onPress={() => setSelectedAccent(ac.color)}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mb-1.5"
                  style={{
                    backgroundColor: ac.color,
                    borderWidth: selectedAccent === ac.color ? 3 : 0,
                    borderColor: '#FFFFFF',
                    shadowColor: ac.color,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: selectedAccent === ac.color ? 0.4 : 0,
                    shadowRadius: 4,
                    elevation: selectedAccent === ac.color ? 4 : 0,
                  }}
                >
                  {selectedAccent === ac.color && (
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  )}
                </View>
                <Text className="text-[10px] text-[#5A7264]">{ac.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview card */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Önizleme</Text>
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-8">
          <View className="flex-row items-center mb-3">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: selectedAccent + '20' }}
            >
              <Ionicons name="heart" size={18} color={selectedAccent} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">Örnek Kart</Text>
              <Text className="text-xs text-[#5A7264]">Seçilen renk böyle görünecek</Text>
            </View>
          </View>
          <View className="h-2 bg-[#E8F0EC] rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{ width: '65%', backgroundColor: selectedAccent }}
            />
          </View>
          <TouchableOpacity
            className="rounded-xl py-3 items-center mt-3"
            style={{ backgroundColor: selectedAccent }}
          >
            <Text className="text-sm font-semibold text-white">Örnek Buton</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}
