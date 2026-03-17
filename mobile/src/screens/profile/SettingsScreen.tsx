import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type SettingItem = {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle?: string
  type: 'navigate' | 'toggle' | 'info'
  screen?: keyof ProfileStackParamList
  value?: boolean
  info?: string
}

const settingSections: { title: string; items: SettingItem[] }[] = [
  {
    title: 'Genel',
    items: [
      { icon: 'language-outline', title: 'Dil', type: 'navigate', screen: 'Language', info: 'Türkçe' },
      { icon: 'color-palette-outline', title: 'Tema', type: 'navigate', screen: 'Theme', info: 'Açık' },
      { icon: 'notifications-outline', title: 'Bildirimler', type: 'navigate', screen: 'NotificationSettings' },
      { icon: 'alarm-outline', title: 'Hatırlatıcılar', type: 'navigate', screen: 'Reminders' },
    ],
  },
  {
    title: 'Veri & Gizlilik',
    items: [
      { icon: 'download-outline', title: 'Veri Dışa Aktarma', type: 'navigate', screen: 'DataExport' },
      { icon: 'shield-checkmark-outline', title: 'Gizlilik Politikası', type: 'navigate', screen: 'PrivacyPolicy' },
      { icon: 'document-text-outline', title: 'Kullanım Şartları', type: 'navigate', screen: 'TermsOfService' },
      { icon: 'analytics-outline', title: 'Anonim Kullanım Verisi', type: 'toggle', value: true },
    ],
  },
  {
    title: 'Bağlantılar',
    items: [
      { icon: 'watch-outline', title: 'Bağlı Cihazlar', type: 'navigate', screen: 'ConnectedDevices' },
      { icon: 'fitness-outline', title: 'Diyetisyen', type: 'navigate', screen: 'DietitianConnection' },
      { icon: 'people-outline', title: 'Aile Modu', type: 'navigate', screen: 'FamilyMode' },
    ],
  },
  {
    title: 'Hakkında',
    items: [
      { icon: 'information-circle-outline', title: 'Hakkında', type: 'navigate', screen: 'About' },
      { icon: 'help-circle-outline', title: 'Yardım & Destek', type: 'navigate', screen: 'HelpSupport' },
      { icon: 'star-outline', title: 'Uygulamayı Puanla', type: 'info' },
    ],
  },
]

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Ayarlar" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4" showsVerticalScrollIndicator={false}>
        {settingSections.map((section, si) => (
          <View key={si} className="mb-4">
            <Text className="text-xs font-bold text-[#5A7264] uppercase tracking-wide mb-2 ml-1">
              {section.title}
            </Text>
            <View className="bg-white rounded-2xl border border-[#E8F0EC] overflow-hidden">
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  className="flex-row items-center px-4 py-3.5 border-b border-[#E8F0EC]"
                  style={ii === section.items.length - 1 ? { borderBottomWidth: 0 } : {}}
                  activeOpacity={item.type === 'toggle' ? 1 : 0.6}
                  onPress={() => item.screen && navigation.navigate(item.screen)}
                  disabled={item.type === 'toggle'}
                >
                  <View className="w-9 h-9 rounded-full bg-[#E8F5EC] items-center justify-center mr-3">
                    <Ionicons name={item.icon} size={18} color="#1A5C37" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-semibold text-[#1A2E23]">{item.title}</Text>
                    {item.subtitle && <Text className="text-xs text-[#5A7264]">{item.subtitle}</Text>}
                  </View>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={item.value}
                      trackColor={{ false: '#D4E2DA', true: '#1A5C37' }}
                      thumbColor="#FFFFFF"
                    />
                  ) : item.info ? (
                    <View className="flex-row items-center">
                      <Text className="text-sm text-[#5A7264] mr-1">{item.info}</Text>
                      <Ionicons name="chevron-forward" size={16} color="#D4E2DA" />
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color="#D4E2DA" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Version info */}
        <View className="items-center mb-8">
          <Text className="text-xs text-[#A8BFB2]">NutriAI v1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}
