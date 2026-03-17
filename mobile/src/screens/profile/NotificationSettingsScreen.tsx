import React, { useState } from 'react'
import { View, Text, ScrollView, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type NotifSetting = {
  title: string
  desc: string
  icon: keyof typeof Ionicons.glyphMap
  key: string
  default: boolean
}

const notifSettings: NotifSetting[] = [
  { title: 'Öğün Hatırlatıcı', desc: 'Kahvaltı, öğle ve akşam yemeği hatırlatmaları', icon: 'restaurant-outline', key: 'meals', default: true },
  { title: 'Su Hatırlatıcı', desc: 'Saatte bir su içme hatırlatması', icon: 'water-outline', key: 'water', default: true },
  { title: 'Egzersiz Hatırlatıcı', desc: 'Günlük egzersiz motivasyonu', icon: 'barbell-outline', key: 'exercise', default: false },
  { title: 'Kilo Kaydı', desc: 'Haftalık kilo kayıt hatırlatması', icon: 'scale-outline', key: 'weight', default: true },
  { title: 'Hedef Güncellemeleri', desc: 'Hedeflere ulaştığınızda bildirim', icon: 'trophy-outline', key: 'goals', default: true },
  { title: 'Diyetisyen Mesajları', desc: 'Diyetisyeninizden gelen mesajlar', icon: 'chatbubble-outline', key: 'dietitian', default: true },
  { title: 'Haftalık Rapor', desc: 'Her Pazar haftalık rapor özeti', icon: 'stats-chart-outline', key: 'weekly', default: true },
  { title: 'Promosyonlar', desc: 'İndirim ve kampanya bildirimleri', icon: 'pricetag-outline', key: 'promo', default: false },
]

export default function NotificationSettingsScreen() {
  const navigation = useNavigation<Nav>()
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(notifSettings.map(s => [s.key, s.default]))
  )

  const toggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Bildirim Ayarları" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Master toggle */}
        <View className="bg-[#E8F5EC] rounded-2xl p-4 mb-4 flex-row items-center border border-[#C8E6CF]/40">
          <View className="w-10 h-10 rounded-full bg-[#1A5C37] items-center justify-center mr-3">
            <Ionicons name="notifications" size={20} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-[#1A2E23]">Bildirimleri Aktif Et</Text>
            <Text className="text-xs text-[#5A7264]">Tüm bildirimleri aç/kapat</Text>
          </View>
          <Switch
            value={Object.values(settings).some(v => v)}
            trackColor={{ false: '#D4E2DA', true: '#1A5C37' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Individual settings */}
        {notifSettings.map((s) => (
          <View key={s.key} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]">
            <View className="w-9 h-9 rounded-full bg-[#E8F5EC] items-center justify-center mr-3">
              <Ionicons name={s.icon} size={18} color="#1A5C37" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-[#1A2E23]">{s.title}</Text>
              <Text className="text-xs text-[#5A7264]">{s.desc}</Text>
            </View>
            <Switch
              value={settings[s.key]}
              onValueChange={() => toggle(s.key)}
              trackColor={{ false: '#D4E2DA', true: '#1A5C37' }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
