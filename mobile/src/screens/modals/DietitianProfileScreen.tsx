import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

const mockDietitian = {
  name: 'Dr. Elif Özkan',
  specialty: 'Sporcu Beslenmesi & Kilo Yönetimi',
  rating: 4.9,
  reviews: 128,
  experience: '12 yıl',
  patients: 450,
  price: '₺250 / seans',
  bio: 'İstanbul Üniversitesi Beslenme ve Diyetetik bölümü mezunuyum. 12 yıldır sporcu beslenmesi ve kilo yönetimi alanında çalışıyorum. Kişiselleştirilmiş beslenme planları ile hedeflerinize ulaşmanıza yardımcı oluyorum.',
  education: [
    'İstanbul Üniversitesi - Beslenme ve Diyetetik (Lisans)',
    'Hacettepe Üniversitesi - Klinik Beslenme (Yüksek Lisans)',
  ],
  certifications: [
    'Sporcu Beslenmesi Uzmanı',
    'Diyabet Eğitmeni',
    'Obezite Tedavisi Sertifikası',
  ],
}

const availableTimes = ['09:00', '10:30', '13:00', '14:30', '16:00']

export default function DietitianProfileScreen() {
  const navigation = useNavigation()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Diyetisyen Profili" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4 items-center">
          <View className="w-20 h-20 rounded-full bg-[#4ECDC4]/20 items-center justify-center mb-3">
            <Text className="text-3xl">👩‍⚕️</Text>
          </View>
          <Text className="text-xl font-bold text-[#1A2E23]">{mockDietitian.name}</Text>
          <Text className="text-sm text-[#5A7264] mt-0.5">{mockDietitian.specialty}</Text>

          {/* Stats row */}
          <View className="flex-row mt-4 gap-4">
            <View className="items-center">
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text className="text-lg font-bold text-[#1A2E23] ml-1">{mockDietitian.rating}</Text>
              </View>
              <Text className="text-[10px] text-[#5A7264]">{mockDietitian.reviews} değerlendirme</Text>
            </View>
            <View className="w-px bg-[#E8F0EC]" />
            <View className="items-center">
              <Text className="text-lg font-bold text-[#1A2E23]">{mockDietitian.experience}</Text>
              <Text className="text-[10px] text-[#5A7264]">Deneyim</Text>
            </View>
            <View className="w-px bg-[#E8F0EC]" />
            <View className="items-center">
              <Text className="text-lg font-bold text-[#1A2E23]">{mockDietitian.patients}+</Text>
              <Text className="text-[10px] text-[#5A7264]">Hasta</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-2">Hakkında</Text>
          <Text className="text-sm text-[#5A7264] leading-5">{mockDietitian.bio}</Text>
        </View>

        {/* Education */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-2">Eğitim</Text>
          {mockDietitian.education.map((e, i) => (
            <View key={i} className="flex-row items-start mb-1.5">
              <Ionicons name="school-outline" size={14} color="#1A5C37" style={{ marginTop: 2 }} />
              <Text className="text-sm text-[#5A7264] ml-2 flex-1">{e}</Text>
            </View>
          ))}
        </View>

        {/* Certifications */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-2">Sertifikalar</Text>
          {mockDietitian.certifications.map((c, i) => (
            <View key={i} className="flex-row items-center mb-1.5">
              <Ionicons name="ribbon-outline" size={14} color="#E8A040" />
              <Text className="text-sm text-[#5A7264] ml-2">{c}</Text>
            </View>
          ))}
        </View>

        {/* Price & CTA */}
        <View className="bg-[#E8F5EC] rounded-2xl p-5 mb-4 border border-[#C8E6CF]/40">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm text-[#5A7264]">Seans Ücreti</Text>
            <Text className="text-xl font-extrabold text-[#1A2E23]">{mockDietitian.price}</Text>
          </View>
          <TouchableOpacity
            className="bg-[#1A5C37] rounded-xl py-4 items-center"
            style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
            activeOpacity={0.8}
          >
            <Text className="text-base font-semibold text-white">📅 Randevu Al</Text>
          </TouchableOpacity>
        </View>

        <View className="h-4" />
      </ScrollView>
    </ScreenWrapper>
  )
}
