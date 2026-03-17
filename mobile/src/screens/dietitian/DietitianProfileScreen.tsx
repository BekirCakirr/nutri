import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function DietitianProfileScreen() {
  const navigation = useNavigation()

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Diyetisyen Profili"
        onBack={() => navigation.goBack()}
        rightIcon="heart-outline"
        onRightPress={() => {}}
      />
      <ScrollView className="flex-1 bg-[#F8FAF9]" showsVerticalScrollIndicator={false}>
        
        {/* Header Profile Info */}
        <View className="bg-white pt-6 pb-8 px-5 border-b border-[#E8F0EC] items-center">
          <View className="relative mb-4">
            <View className="w-24 h-24 rounded-full bg-[#E8F5EC] items-center justify-center border-4 border-white shadow-sm overflow-hidden">
               <Image
                 source={{ uri: 'https://i.pravatar.cc/300?img=32' }}
                 className="w-full h-full"
                 resizeMode="cover"
               />
            </View>
            <View className="absolute bottom-0 right-0 bg-[#4ECDC4] w-6 h-6 rounded-full border-2 border-white items-center justify-center">
              <Ionicons name="checkmark" size={12} color="#FFF" />
            </View>
          </View>
          
          <Text className="text-2xl font-extrabold text-[#1A2E23] mb-1">Dyt. Buse Yılmaz</Text>
          <Text className="text-[#5A7264] text-base font-medium mb-4">Klinik & Sporcu Beslenmesi Uzmanı</Text>
          
          <View className="flex-row items-center gap-6">
            <View className="items-center">
              <View className="flex-row items-center gap-1 mb-1">
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text className="font-bold text-[#1A2E23]">4.9</Text>
              </View>
              <Text className="text-[10px] text-[#5A7264] uppercase tracking-wider">Değerlendirme</Text>
            </View>
            <View className="w-px h-8 bg-[#E8F0EC]" />
            <View className="items-center">
              <View className="flex-row items-center gap-1 mb-1">
                <Ionicons name="people" size={16} color="#4A7FB5" />
                <Text className="font-bold text-[#1A2E23]">2.4K+</Text>
              </View>
              <Text className="text-[10px] text-[#5A7264] uppercase tracking-wider">Danışan</Text>
            </View>
             <View className="w-px h-8 bg-[#E8F0EC]" />
            <View className="items-center">
              <View className="flex-row items-center gap-1 mb-1">
                <Ionicons name="briefcase" size={16} color="#1A5C37" />
                <Text className="font-bold text-[#1A2E23]">8 Yıl</Text>
              </View>
              <Text className="text-[10px] text-[#5A7264] uppercase tracking-wider">Deneyim</Text>
            </View>
          </View>
        </View>

        {/* Content Tabs area simulator */}
        <View className="px-5 pt-6 pb-20">
          
          <Text className="text-[#1A2E23] font-bold text-lg mb-3">Hakkında</Text>
          <Text className="text-[#5A7264] leading-relaxed mb-6">
            Hacettepe Üniversitesi Beslenme ve Diyetetik bölümünden 2018 yılında mezun oldu. Özellikle sporcu beslenmesi, hastalıklarda tıbbi beslenme tedavisi ve sürdürülebilir kilo kontrolü üzerine uzmanlaşmıştır.
          </Text>

          <Text className="text-[#1A2E23] font-bold text-lg mb-3">Uzmanlık Alanları</Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {['Sporcu Beslenmesi', 'Kilo Verme', 'Diyabet Tipi 2', 'Hamilelik'].map((tag, i) => (
              <View key={i} className="bg-[#E8F5EC] px-3 py-1.5 rounded-full border border-[#1A5C37]/10">
                <Text className="text-[#1A5C37] text-xs font-semibold">{tag}</Text>
              </View>
            ))}
          </View>

          <Text className="text-[#1A2E23] font-bold text-lg mb-3">Eğitim ve Sertifikalar</Text>
          <View className="space-y-4 mb-6">
            <View className="flex-row items-start">
               <View className="w-8 h-8 rounded-full bg-[#4A7FB5]/10 items-center justify-center mr-3 mt-1">
                 <Ionicons name="school" size={16} color="#4A7FB5" />
               </View>
               <View className="flex-1">
                 <Text className="font-semibold text-[#1A2E23]">Lisans (Beslenme ve Diyetetik)</Text>
                 <Text className="text-sm text-[#5A7264]">Hacettepe Üniversitesi • 2014 - 2018</Text>
               </View>
            </View>
            <View className="flex-row items-start mt-4">
               <View className="w-8 h-8 rounded-full bg-[#1A5C37]/10 items-center justify-center mr-3 mt-1">
                 <Ionicons name="ribbon" size={16} color="#1A5C37" />
               </View>
               <View className="flex-1">
                 <Text className="font-semibold text-[#1A2E23]">Sporcu Beslenmesi Uzmanlığı</Text>
                 <Text className="text-sm text-[#5A7264]">ISSN Certification • 2019</Text>
               </View>
            </View>
          </View>

          {/* Pricing Info */}
          <View className="bg-[#1A5C37]/5 border border-[#1A5C37]/20 rounded-2xl p-4 flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-[#5A7264] text-xs font-medium uppercase tracking-wider mb-1">Seans Ücreti</Text>
              <Text className="text-xl font-bold text-[#1A5C37]">₺850 <Text className="text-sm font-normal text-[#5A7264]">/ 45 dk</Text></Text>
            </View>
             <Ionicons name="card-outline" size={24} color="#1A5C37" />
          </View>

        </View>
      </ScrollView>

      {/* Floating Book Button */}
      <View className="absolute bottom-0 w-full bg-white px-5 py-4 border-t border-[#E8F0EC]" style={{ paddingBottom: 32 }}>
        <TouchableOpacity 
          className="w-full bg-[#1A5C37] h-14 rounded-xl flex-row items-center justify-center shadow-sm shadow-[#1A5C37]/30"
          onPress={() => navigation.navigate('BookAppointment' as never)}
        >
          <Ionicons name="calendar" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-base">Randevu Al</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}
