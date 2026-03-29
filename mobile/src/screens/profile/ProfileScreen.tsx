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
      { icon: 'person-outline', title: 'Profili Düzenle', screen: 'EditProfile', color: '#10B981' },
      { icon: 'body-outline', title: 'Kişisel Veriler', subtitle: 'Boy, kilo, yaş', screen: 'PersonalData', color: '#3B82F6' },
      { icon: 'flag-outline', title: 'Hedeflerim', screen: 'Goals', color: '#F59E0B' },
    ],
  },
  {
    title: 'Sağlık',
    items: [
      { icon: 'medical-outline', title: 'Alerji Yönetimi', screen: 'AllergyManagement', color: '#EF4444' },
      { icon: 'people-outline', title: 'Aile Modu', screen: 'FamilyMode', color: '#8B5CF6' },
      { icon: 'fitness-outline', title: 'Diyetisyen Bağlantısı', screen: 'DietitianConnection', color: '#14B8A6' },
    ],
  },
  {
    title: 'Uygulama',
    items: [
      { icon: 'settings-outline', title: 'Ayarlar', screen: 'Settings', color: '#64748B' },
      { icon: 'notifications-outline', title: 'Bildirimler', screen: 'NotificationSettings', color: '#EAB308' },
      { icon: 'alarm-outline', title: 'Hatırlatıcılar', screen: 'Reminders', color: '#F43F5E' },
      { icon: 'color-palette-outline', title: 'Tema', screen: 'Theme', color: '#A855F7' },
      { icon: 'language-outline', title: 'Dil', screen: 'Language', color: '#0EA5E9' },
    ],
  },
  {
    title: 'Premium',
    items: [
      { icon: 'diamond-outline', title: 'Abonelik', subtitle: 'Premium Plan', screen: 'Subscription', color: '#F59E0B' },
      { icon: 'trophy-outline', title: 'Başarılar', screen: 'Achievements', color: '#10B981' },
      { icon: 'watch-outline', title: 'Bağlı Cihazlar', screen: 'ConnectedDevices', color: '#14B8A6' },
    ],
  },
  {
    title: 'Destek & Bilgi',
    items: [
      { icon: 'download-outline', title: 'Veri Dışa Aktarma', screen: 'DataExport', color: '#475569' },
      { icon: 'help-circle-outline', title: 'Yardım & Destek', screen: 'HelpSupport', color: '#3B82F6' },
      { icon: 'information-circle-outline', title: 'Hakkında', screen: 'About', color: '#10B981' },
      { icon: 'shield-checkmark-outline', title: 'Gizlilik Politikası', screen: 'PrivacyPolicy', color: '#64748B' },
      { icon: 'document-text-outline', title: 'Kullanım Şartları', screen: 'TermsOfService', color: '#64748B' },
    ],
  },
]

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false} contentStyle={{ backgroundColor: '#F8F9FA' }}>
      <ScrollView className="flex-1 bg-[#F8F9FA]" showsVerticalScrollIndicator={false}>
        {/* Modern Dark Header Card wrapped in container */}
        <View className="px-5 pt-6 pb-4">
          <View className="bg-[#111827] rounded-[32px] p-6 shadow-xl shadow-black/20 overflow-hidden relative">
            {/* Subtle glow circles for depth inside card */}
            <View className="absolute -top-10 -right-10 w-40 h-40 bg-[#10B981] opacity-20 rounded-full blur-3xl" />
            <View className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#3B82F6] opacity-20 rounded-full blur-3xl" />
            
            <View className="flex-row items-center relative z-10">
              <View className="w-16 h-16 rounded-full bg-white/10 items-center justify-center mr-4 border border-white/20">
                <Text className="text-2xl font-black text-white">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-[22px] font-bold text-white mb-0.5">{mockUser.name}</Text>
                <Text className="text-sm text-gray-400 font-medium">{mockUser.email}</Text>
                <View className="flex-row items-center mt-2">
                  <View className="bg-[#10B981]/20 border border-[#10B981]/30 rounded-full px-2.5 py-1 flex-row items-center">
                    <Ionicons name="star" size={12} color="#10B981" />
                    <Text className="text-xs font-bold text-[#10B981] ml-1 uppercase">{mockUser.plan}</Text>
                  </View>
                  <Text className="text-xs font-medium text-gray-500 ml-3">{mockUser.joinDate}'dan beri</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/10"
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Stats row inside header */}
            <View className="flex-row mt-6 gap-3 relative z-10">
              <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
                <Text className="text-2xl font-black text-white">{mockUser.stats.streak}</Text>
                <Text className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wider">Gün Serisi</Text>
              </View>
              <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
                <Text className="text-2xl font-black text-white">{mockUser.stats.logged}</Text>
                <Text className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wider">Öğün Kaydı</Text>
              </View>
              <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 items-center">
                <Text className="text-2xl font-black text-[#10B981]">{mockUser.stats.lost}</Text>
                <Text className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wider">Kg Verildi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu sections */}
        <View className="px-5 pt-2 pb-6">
          {menuSections.map((section, si) => (
            <View key={si} className="mb-6">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">
                {section.title}
              </Text>
              <View className="bg-white rounded-[24px] border border-gray-100 shadow-sm shadow-black/5 overflow-hidden">
                {section.items.map((item, ii) => (
                  <TouchableOpacity
                    key={ii}
                    className={`flex-row items-center px-4 py-4 ${
                      ii === section.items.length - 1 ? '' : 'border-b border-gray-100'
                    }`}
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: item.color + '15' }}
                    >
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <View className="flex-1 justify-center">
                      <Text className="text-[16px] font-semibold text-gray-800">{item.title}</Text>
                      {item.subtitle && <Text className="text-[13px] font-medium text-gray-500 mt-0.5">{item.subtitle}</Text>}
                    </View>
                    <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
                      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity 
          className="mx-5 mb-10 bg-red-50 rounded-[24px] py-4 items-center border border-red-100" 
          activeOpacity={0.7}
        >
          <Text className="text-[16px] font-bold text-red-500">Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
