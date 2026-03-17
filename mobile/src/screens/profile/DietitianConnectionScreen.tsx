import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

const mockDietitian = {
  name: 'Dr. Elif Özkan',
  specialty: 'Sporcu Beslenmesi & Kilo Yönetimi',
  rating: 4.9,
  reviews: 128,
  experience: '12 yıl',
  nextAppointment: '20 Mar 2026, 14:00',
  connected: true,
}

const upcomingAppointments = [
  { date: '20 Mar', time: '14:00', type: 'Video Görüşme', status: 'Onaylandı' },
  { date: '3 Nis', time: '10:30', type: 'Kontrol', status: 'Bekliyor' },
]

const features = [
  { title: 'Mesaj Gönder', icon: 'chatbubble-outline' as const, desc: 'Diyetisyeninize yazın' },
  { title: 'Randevu Al', icon: 'calendar-outline' as const, desc: 'Online randevu oluşturun' },
  { title: 'Plan İste', icon: 'document-text-outline' as const, desc: 'Kişisel beslenme planı' },
  { title: 'Rapor Paylaş', icon: 'share-outline' as const, desc: 'Verilerinizi paylaşın' },
]

export default function DietitianConnectionScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Diyetisyen Bağlantısı" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Dietitian card */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <View className="flex-row items-center">
            <View className="w-14 h-14 rounded-full bg-[#4ECDC4]/20 items-center justify-center mr-3">
              <Text className="text-2xl">👩‍⚕️</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-[#1A2E23]">{mockDietitian.name}</Text>
              <Text className="text-xs text-[#5A7264]">{mockDietitian.specialty}</Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text className="text-xs font-bold text-[#1A2E23] ml-0.5">{mockDietitian.rating}</Text>
                <Text className="text-xs text-[#5A7264] ml-1">({mockDietitian.reviews} değerlendirme)</Text>
                <Text className="text-xs text-[#5A7264] ml-2">· {mockDietitian.experience}</Text>
              </View>
            </View>
          </View>
          <View className="bg-[#E8F5EC] rounded-xl p-3 mt-4 flex-row items-center">
            <Ionicons name="checkmark-circle" size={18} color="#1A5C37" />
            <Text className="text-sm font-semibold text-[#1A5C37] ml-2">Bağlı</Text>
          </View>
        </View>

        {/* Quick actions */}
        <View className="flex-row flex-wrap mb-4">
          {features.map((f, i) => (
            <TouchableOpacity
              key={i}
              className="w-[48%] mx-[1%] mb-2.5 bg-white rounded-xl p-4 border border-[#E8F0EC]"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-full bg-[#E8F5EC] items-center justify-center mb-2">
                <Ionicons name={f.icon} size={20} color="#1A5C37" />
              </View>
              <Text className="text-sm font-semibold text-[#1A2E23]">{f.title}</Text>
              <Text className="text-xs text-[#5A7264] mt-0.5">{f.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming appointments */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Yaklaşan Randevular</Text>
        {upcomingAppointments.map((apt, i) => (
          <View key={i} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]">
            <View className="w-10 h-10 rounded-full bg-[#DBEAFE] items-center justify-center mr-3">
              <Ionicons name="calendar-outline" size={18} color="#4A7FB5" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-[#1A2E23]">{apt.date} — {apt.time}</Text>
              <Text className="text-xs text-[#5A7264]">{apt.type}</Text>
            </View>
            <View
              className="rounded-full px-2.5 py-0.5"
              style={{ backgroundColor: apt.status === 'Onaylandı' ? '#E8F5EC' : '#FEF3C7' }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: apt.status === 'Onaylandı' ? '#1A5C37' : '#E8A040' }}
              >
                {apt.status}
              </Text>
            </View>
          </View>
        ))}

        {/* Change dietitian */}
        <TouchableOpacity className="items-center mt-4 mb-8" activeOpacity={0.6}>
          <Text className="text-sm text-[#5A7264]">Diyetisyen Değiştir</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
