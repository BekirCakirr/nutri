import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function AllergenScannerScreen() {
  const navigation = useNavigation()
  const [scanning, setScanning] = useState(true)

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Alerjen Tarama"
        onBack={() => navigation.goBack()}
      />

      <View className="flex-1 bg-[#F8FAF9]">
        {scanning ? (
          <View className="flex-1 items-center justify-center bg-black/90">
            <View className="w-[280px] h-[280px] border-2 border-[#4ECDC4] rounded-2xl bg-white/5 relative items-center justify-center">
              <View className="absolute top-4 left-4 border-t-4 border-l-4 border-[#4ECDC4] w-8 h-8 rounded-tl-lg" />
              <View className="absolute top-4 right-4 border-t-4 border-r-4 border-[#4ECDC4] w-8 h-8 rounded-tr-lg" />
              <View className="absolute bottom-4 left-4 border-b-4 border-l-4 border-[#4ECDC4] w-8 h-8 rounded-bl-lg" />
              <View className="absolute bottom-4 right-4 border-b-4 border-r-4 border-[#4ECDC4] w-8 h-8 rounded-br-lg" />
              
              <Text className="text-white/70 text-sm mt-8 text-center px-4">
                Ürün barkodunu veya içerik listesini kameraya okutun
              </Text>

              {/* Scanning animation line simulator */}
              <View className="absolute h-0.5 w-full bg-[#4ECDC4] top-1/2 opacity-50 shadow-lg" />
            </View>
            
            <TouchableOpacity 
              className="mt-12 bg-white/20 px-8 py-3 rounded-full"
              onPress={() => setScanning(false)}
            >
              <Text className="text-white font-semibold">Taramayı Durdur</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView className="flex-1 px-5 pt-6">
            <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] items-center mb-6">
              <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
                <Ionicons name="warning-outline" size={32} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-[#1A2E23] mb-2 text-center">Dikkat! Alerjen Bulundu</Text>
              <Text className="text-[#5A7264] text-center mb-4">
                Bu ürün profilinize kaydettiğiniz bazı alerjenleri içeriyor.
              </Text>
              
              <View className="w-full bg-red-50 rounded-xl p-4 border border-red-100">
                <Text className="text-sm font-semibold text-red-800 mb-2">Bulunan Alerjenler:</Text>
                <View className="flex-row items-center gap-2 mb-2">
                  <Ionicons name="close-circle" size={16} color="#EF4444" />
                  <Text className="text-red-700 font-medium">Yer Fıstığı (Peanut)</Text>
                </View>
                <View className="flex-row items-center gap-2">
                   <Ionicons name="close-circle" size={16} color="#EF4444" />
                   <Text className="text-red-700 font-medium">Süt Ürünleri Eser Miktarda</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              className="w-full bg-[#1A5C37] rounded-xl py-4 items-center mb-4"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-white font-bold text-base">Anladım, Kapat</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="w-full bg-[#F8FAF9] rounded-xl py-4 items-center border border-[#E8F0EC]"
              onPress={() => setScanning(true)}
            >
              <Text className="text-[#1A5C37] font-bold text-base">Yeni Tarama Yap</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  )
}
