import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function MonthlyReportScreen() {
  const navigation = useNavigation()

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Aylık Rapor"
        subtitle="Mart 2026"
        onBack={() => navigation.goBack()}
        rightIcon="download-outline"
        onRightPress={() => {}}
      />
      
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Trend Banner */}
        <View className="bg-white rounded-2xl p-5 border border-emerald-200 mb-6 flex-row items-center shadow-sm">
           <View className="flex-1">
             <Text className="text-[#1A2E23] font-bold text-lg mb-1">Mükemmel İlerleme!</Text>
             <Text className="text-[#5A7264] text-xs leading-relaxed">Mart ayında hedef kilona %80 daha yaklaştın. Düzenli beslenmen harika sonuçlar veriyor.</Text>
           </View>
           <View className="w-16 h-16 bg-emerald-100 rounded-full items-center justify-center ml-4">
              <Ionicons name="trending-up" size={32} color="#10B981" />
           </View>
        </View>

        {/* Key Metrics */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Aylık Özet</Text>
        <View className="flex-row flex-wrap justify-between mb-8">
           <View className="w-[48%] bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
              <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mb-3">
                 <Ionicons name="scale" size={16} color="#3B82F6" />
              </View>
              <Text className="text-[#5A7264] text-xs uppercase tracking-wide mb-1">Kilo Değişimi</Text>
              <View className="flex-row items-end">
                 <Text className="text-2xl font-bold text-[#1A2E23]">-2.4</Text>
                 <Text className="text-[#A8BFB2] text-sm ml-1 mb-1 font-medium">kg</Text>
              </View>
           </View>

           <View className="w-[48%] bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
              <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center mb-3">
                 <Ionicons name="flame" size={16} color="#F97316" />
              </View>
              <Text className="text-[#5A7264] text-xs uppercase tracking-wide mb-1">Yakılan</Text>
               <View className="flex-row items-end">
                 <Text className="text-2xl font-bold text-[#1A2E23]">12K</Text>
                 <Text className="text-[#A8BFB2] text-sm ml-1 mb-1 font-medium">kcal</Text>
              </View>
           </View>

           <View className="w-[48%] bg-white rounded-2xl p-5 border border-[#E8F0EC]">
              <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mb-3">
                 <Ionicons name="calendar-clear" size={16} color="#10B981" />
              </View>
              <Text className="text-[#5A7264] text-xs uppercase tracking-wide mb-1">Kusursuz Gün</Text>
               <View className="flex-row items-end">
                 <Text className="text-2xl font-bold text-[#1A2E23]">24</Text>
                 <Text className="text-[#A8BFB2] text-sm ml-1 mb-1 font-medium">gün</Text>
              </View>
           </View>

           <View className="w-[48%] bg-white rounded-2xl p-5 border border-[#E8F0EC]">
              <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mb-3">
                 <Ionicons name="moon" size={16} color="#8B5CF6" />
              </View>
              <Text className="text-[#5A7264] text-xs uppercase tracking-wide mb-1">Ort. Uyku</Text>
               <View className="flex-row items-end">
                 <Text className="text-2xl font-bold text-[#1A2E23]">7.5</Text>
                 <Text className="text-[#A8BFB2] text-sm ml-1 mb-1 font-medium">saat</Text>
              </View>
           </View>
        </View>

        {/* Doctor Action */}
        <TouchableOpacity className="bg-[#1A5C37] rounded-xl p-4 flex-row items-center justify-between mb-8 shadow-sm shadow-[#1A5C37]/30">
           <View className="flex-1 pr-4">
              <Text className="text-white font-bold mb-1">Diyetisyeninle Paylaş</Text>
              <Text className="text-[#E8F5EC] text-xs">Bu aylık veriyi uzmanına gönder ve değerlendirme al.</Text>
           </View>
           <Ionicons name="paper-plane" size={24} color="#FFF" />
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  )
}
