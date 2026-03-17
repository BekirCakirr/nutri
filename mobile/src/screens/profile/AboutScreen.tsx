import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

const appInfo = {
  version: '1.0.0',
  build: '2026.03.17',
  developer: 'NutriAI Team',
}

const links = [
  { title: 'Web Sitemiz', icon: 'globe-outline' as const, url: '#' },
  { title: 'Twitter / X', icon: 'logo-twitter' as const, url: '#' },
  { title: 'Instagram', icon: 'logo-instagram' as const, url: '#' },
]

const legalItems = [
  { title: 'Gizlilik Politikası', screen: 'PrivacyPolicy' as const },
  { title: 'Kullanım Şartları', screen: 'TermsOfService' as const },
]

export default function AboutScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Hakkında" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Logo & version */}
        <View className="items-center mb-6 mt-4">
          <View className="w-20 h-20 rounded-2xl bg-[#1A5C37] items-center justify-center mb-3">
            <Text className="text-3xl">🥗</Text>
          </View>
          <Text className="text-2xl font-extrabold text-[#1A2E23]">NutriAI</Text>
          <Text className="text-sm text-[#5A7264] mt-1">Akıllı Beslenme Asistanı</Text>
          <Text className="text-xs text-[#A8BFB2] mt-0.5">v{appInfo.version} ({appInfo.build})</Text>
        </View>

        {/* Description */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-sm text-[#5A7264] leading-5">
            NutriAI, yapay zeka destekli akıllı beslenme uygulamasıdır. Fotoğraf çekerek yemekleri analiz edebilir,
            kişiselleştirilmiş beslenme planları oluşturabilir ve sağlık hedeflerinizi takip edebilirsiniz.
          </Text>
        </View>

        {/* Team */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-2">Geliştirici</Text>
          <Text className="text-sm text-[#5A7264]">{appInfo.developer}</Text>
          <Text className="text-xs text-[#A8BFB2] mt-1">Powered by Google Gemini AI</Text>
        </View>

        {/* Social links */}
        <Text className="text-xs font-bold text-[#5A7264] uppercase tracking-wide mb-2 ml-1">Bizi Takip Edin</Text>
        <View className="bg-white rounded-2xl border border-[#E8F0EC] overflow-hidden mb-4">
          {links.map((link, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center px-4 py-3.5 border-b border-[#E8F0EC]"
              style={i === links.length - 1 ? { borderBottomWidth: 0 } : {}}
              activeOpacity={0.6}
            >
              <View className="w-9 h-9 rounded-full bg-[#E8F5EC] items-center justify-center mr-3">
                <Ionicons name={link.icon} size={18} color="#1A5C37" />
              </View>
              <Text className="flex-1 text-[15px] font-semibold text-[#1A2E23]">{link.title}</Text>
              <Ionicons name="open-outline" size={16} color="#D4E2DA" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Legal */}
        <Text className="text-xs font-bold text-[#5A7264] uppercase tracking-wide mb-2 ml-1">Yasal</Text>
        <View className="bg-white rounded-2xl border border-[#E8F0EC] overflow-hidden mb-4">
          {legalItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center px-4 py-3.5 border-b border-[#E8F0EC]"
              style={i === legalItems.length - 1 ? { borderBottomWidth: 0 } : {}}
              activeOpacity={0.6}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text className="flex-1 text-[15px] font-semibold text-[#1A2E23]">{item.title}</Text>
              <Ionicons name="chevron-forward" size={16} color="#D4E2DA" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View className="items-center mb-8">
          <Text className="text-xs text-[#A8BFB2]">© 2026 NutriAI. Tüm hakları saklıdır.</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}
