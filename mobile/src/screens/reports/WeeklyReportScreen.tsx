import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function WeeklyReportScreen() {
  const navigation = useNavigation()

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Haftalık Rapor"
        subtitle="17-23 Mart 2026"
        onBack={() => navigation.goBack()}
        rightIcon="share-social-outline"
        onRightPress={() => {}}
      />
      
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Score Header */}
        <View className="bg-[#1A5C37] rounded-3xl p-6 mb-6 items-center shadow-lg shadow-[#1A5C37]/30">
           <Text className="text-[#E8F5EC] text-sm uppercase tracking-wider mb-2 font-medium">Haftalık Sağlık Skoru</Text>
           <View className="flex-row items-end">
             <Text className="text-white text-5xl font-extrabold pb-1">85</Text>
             <Text className="text-[#A8BFB2] text-xl font-bold ml-1 mb-2">/100</Text>
           </View>
           <View className="flex-row items-center mt-3 bg-white/10 px-3 py-1.5 rounded-full">
             <Ionicons name="trending-up" size={16} color="#4ECDC4" />
             <Text className="text-[#4ECDC4] text-xs font-bold ml-2">Geçen haftaya göre %12 artış</Text>
           </View>
        </View>

        {/* Macros Summary */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Makro Besin Dengesi</Text>
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-6">
           <View className="flex-row items-center justify-between mb-4">
              <View className="items-center flex-1">
                 <Text className="text-xs text-[#5A7264] uppercase tracking-wide mb-1">Protein</Text>
                 <Text className="text-xl font-bold text-[#4A7FB5]">%28</Text>
              </View>
              <View className="w-px h-10 bg-[#E8F0EC]" />
              <View className="items-center flex-1">
                 <Text className="text-xs text-[#5A7264] uppercase tracking-wide mb-1">Karb</Text>
                 <Text className="text-xl font-bold text-[#F59E0B]">%45</Text>
              </View>
              <View className="w-px h-10 bg-[#E8F0EC]" />
              <View className="items-center flex-1">
                 <Text className="text-xs text-[#5A7264] uppercase tracking-wide mb-1">Yağ</Text>
                 <Text className="text-xl font-bold text-[#EF4444]">%27</Text>
              </View>
           </View>
           
           <View className="h-3 w-full rounded-full flex-row overflow-hidden shadow-inner">
              <View className="h-full bg-[#4A7FB5]" style={{ width: '28%' }} />
              <View className="h-full bg-[#F59E0B]" style={{ width: '45%' }} />
              <View className="h-full bg-[#EF4444]" style={{ width: '27%' }} />
           </View>
        </View>

        {/* Highlights */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Öne Çıkanlar</Text>
        <View className="flex-row gap-3 mb-6">
           <View className="flex-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex-col justify-between" style={{ minHeight: 120 }}>
              <View className="w-10 h-10 bg-emerald-200 rounded-full items-center justify-center mb-3">
                 <Ionicons name="water" size={20} color="#059669" />
              </View>
              <View>
                 <Text className="text-emerald-800 font-extrabold text-xl mb-1">14.5<Text className="text-sm font-medium">L</Text></Text>
                 <Text className="text-emerald-700 text-[10px]">%90 Hedef</Text>
              </View>
           </View>
           <View className="flex-1 bg-blue-50 rounded-2xl p-4 border border-blue-100 flex-col justify-between" style={{ minHeight: 120 }}>
              <View className="w-10 h-10 bg-blue-200 rounded-full items-center justify-center mb-3">
                 <Ionicons name="barbell" size={20} color="#2563EB" />
              </View>
               <View>
                 <Text className="text-blue-800 font-extrabold text-xl mb-1">3.5<Text className="text-sm font-medium">Sa</Text></Text>
                 <Text className="text-blue-700 text-[10px]">Aktivite</Text>
              </View>
           </View>
           <View className="flex-1 bg-amber-50 rounded-2xl p-4 border border-amber-100 flex-col justify-between" style={{ minHeight: 120 }}>
              <View className="w-10 h-10 bg-amber-200 rounded-full items-center justify-center mb-3">
                 <Ionicons name="restaurant" size={20} color="#D97706" />
              </View>
               <View>
                 <Text className="text-amber-800 font-extrabold text-xl mb-1">21<Text className="text-sm font-medium">Öğün</Text></Text>
                 <Text className="text-amber-700 text-[10px]">Eksiksiz</Text>
              </View>
           </View>
        </View>

        {/* AI Insight */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-8 flex-row items-start">
           <View className="w-10 h-10 rounded-full bg-[#1A5C37] items-center justify-center mr-4">
              <Ionicons name="sparkles" size={20} color="#FFF" />
           </View>
           <View className="flex-1">
              <Text className="font-bold text-[#1A2E23] mb-1.5 text-base">Yapay Zeka Yorumu</Text>
              <Text className="text-[#5A7264] leading-relaxed text-[13px]">
                Harika bir hafta geçirdin! Su tüketimin oldukça başarılı. Hafta sonu karbonhidrat alımında hafif sapmalar olmuş, ancak bunu egzersizle dengelemişsin. Önümüzdeki hafta lif alımını %10 artırmayı hedefleyebiliriz.
              </Text>
           </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}
