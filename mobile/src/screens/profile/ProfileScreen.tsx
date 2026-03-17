import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'

type Nav = StackNavigationProp<ProfileStackParamList>

const mockUser = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet@email.com',
  plan: 'Premium',
  joinDate: 'Ocak 2026',
  stats: { streak: 18, logged: 245, lost: 3.2 },
}

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle?: string
  screen: keyof ProfileStackParamList
  color: string
}

const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Hesap',
    items: [
      { icon: 'person-outline', title: 'Profili Düzenle', screen: 'EditProfile', color: '#1A5C37' },
      { icon: 'body-outline', title: 'Kişisel Veriler', subtitle: 'Boy, kilo, yaş', screen: 'PersonalData', color: '#4A7FB5' },
      { icon: 'flag-outline', title: 'Hedeflerim', screen: 'Goals', color: '#E8A040' },
    ],
  },
  {
    title: 'Sağlık',
    items: [
      { icon: 'medical-outline', title: 'Alerji Yönetimi', screen: 'AllergyManagement', color: '#EF4444' },
      { icon: 'people-outline', title: 'Aile Modu', screen: 'FamilyMode', color: '#8B6BAA' },
      { icon: 'fitness-outline', title: 'Diyetisyen Bağlantısı', screen: 'DietitianConnection', color: '#4ECDC4' },
    ],
  },
  {
    title: 'Uygulama',
    items: [
      { icon: 'settings-outline', title: 'Ayarlar', screen: 'Settings', color: '#5A7264' },
      { icon: 'notifications-outline', title: 'Bildirimler', screen: 'NotificationSettings', color: '#F59E0B' },
      { icon: 'alarm-outline', title: 'Hatırlatıcılar', screen: 'Reminders', color: '#C75B4A' },
      { icon: 'color-palette-outline', title: 'Tema', screen: 'Theme', color: '#8B6BAA' },
      { icon: 'language-outline', title: 'Dil', screen: 'Language', color: '#4A7FB5' },
    ],
  },
  {
    title: 'Premium',
    items: [
      { icon: 'diamond-outline', title: 'Abonelik', subtitle: 'Premium Plan', screen: 'Subscription', color: '#E8A040' },
      { icon: 'trophy-outline', title: 'Başarılar', screen: 'Achievements', color: '#1A5C37' },
      { icon: 'watch-outline', title: 'Bağlı Cihazlar', screen: 'ConnectedDevices', color: '#4ECDC4' },
    ],
  },
  {
    title: 'Destek & Bilgi',
    items: [
      { icon: 'download-outline', title: 'Veri Dışa Aktarma', screen: 'DataExport', color: '#5A7264' },
      { icon: 'help-circle-outline', title: 'Yardım & Destek', screen: 'HelpSupport', color: '#4A7FB5' },
      { icon: 'information-circle-outline', title: 'Hakkında', screen: 'About', color: '#1A5C37' },
      { icon: 'shield-checkmark-outline', title: 'Gizlilik Politikası', screen: 'PrivacyPolicy', color: '#5A7264' },
      { icon: 'document-text-outline', title: 'Kullanım Şartları', screen: 'TermsOfService', color: '#5A7264' },
    ],
  },
]

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <ScrollView className="flex-1 bg-[#F8FAF9]" showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View className="bg-[#1A2E23] px-5 pt-8 pb-6">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-[#2D4A3A] items-center justify-center mr-4">
              <Text className="text-2xl font-bold text-white">
                {mockUser.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-white">{mockUser.name}</Text>
              <Text className="text-sm text-white/60">{mockUser.email}</Text>
              <View className="flex-row items-center mt-1">
                <View className="bg-[#4ECDC4]/20 rounded-full px-2.5 py-0.5">
                  <Text className="text-xs font-bold text-[#4ECDC4]">⭐ {mockUser.plan}</Text>
                </View>
                <Text className="text-xs text-white/40 ml-2">{mockUser.joinDate}'dan beri</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              className="w-10 h-10 rounded-full bg-[#2D4A3A] items-center justify-center"
            >
              <Ionicons name="pencil-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Stats row */}
          <View className="flex-row mt-5 gap-3">
            <View className="flex-1 bg-[#2D4A3A] rounded-xl p-3 items-center">
              <Text className="text-xl font-extrabold text-white">{mockUser.stats.streak}</Text>
              <Text className="text-[10px] text-white/50">🔥 Gün Serisi</Text>
            </View>
            <View className="flex-1 bg-[#2D4A3A] rounded-xl p-3 items-center">
              <Text className="text-xl font-extrabold text-white">{mockUser.stats.logged}</Text>
              <Text className="text-[10px] text-white/50">📋 Öğün Kaydı</Text>
            </View>
            <View className="flex-1 bg-[#2D4A3A] rounded-xl p-3 items-center">
              <Text className="text-xl font-extrabold text-white">{mockUser.stats.lost} kg</Text>
              <Text className="text-[10px] text-white/50">📉 Verilen</Text>
            </View>
          </View>
        </View>

        {/* Menu sections */}
        <View className="px-4 pt-4">
          {menuSections.map((section, si) => (
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
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View
                      className="w-9 h-9 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: item.color + '18' }}
                    >
                      <Ionicons name={item.icon} size={18} color={item.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[15px] font-semibold text-[#1A2E23]">{item.title}</Text>
                      {item.subtitle && <Text className="text-xs text-[#5A7264]">{item.subtitle}</Text>}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#D4E2DA" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity className="mx-4 mb-8 bg-white rounded-xl py-4 items-center border border-[#FEE2E2]" activeOpacity={0.7}>
          <Text className="text-base font-semibold text-[#EF4444]">Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
