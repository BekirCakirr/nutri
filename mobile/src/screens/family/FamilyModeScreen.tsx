import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type FamilyMember = {
  id: string
  name: string
  relation: string
  points: number
  status: 'active' | 'pending'
  avatar: string
}

const mockFamily: FamilyMember[] = [
  { id: '1', name: 'Ahmet Yılmaz', relation: 'Kendin', points: 1250, status: 'active', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', name: 'Ayşe Yılmaz', relation: 'Eş', points: 980, status: 'active', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '3', name: 'Can Yılmaz', relation: 'Çocuk', points: 450, status: 'active', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '4', name: 'Mehmet Yılmaz', relation: 'Kardeş', points: 0, status: 'pending', avatar: 'https://i.pravatar.cc/150?img=15' },
]

export default function FamilyModeScreen() {
  const navigation = useNavigation()

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Aile Modu"
        subtitle="3 Üye Aktif"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View className="bg-[#1A5C37] rounded-xl p-5 mb-6 flex-row items-center border border-[#1A5C37]">
          <View className="flex-1 pr-4">
             <Text className="text-white font-bold text-lg mb-1">Beraber Daha Güçlüyüz!</Text>
             <Text className="text-[#E8F5EC] text-xs leading-relaxed">
               Aile üyelerinizi ekleyin, birbirinizin gelişimini takip edin ve grup hedeflerine ulaşarak ortak rozetler kazanın.
             </Text>
          </View>
          <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center">
             <Ionicons name="people" size={32} color="#FFF" />
          </View>
        </View>

        {/* Members List */}
        <View className="flex-row items-center justify-between mb-4">
           <Text className="text-[#1A2E23] font-bold text-lg">Aile Üyeleri</Text>
           <TouchableOpacity className="flex-row items-center bg-[#E8F5EC] px-3 py-1.5 rounded-full">
             <Ionicons name="add" size={16} color="#1A5C37" />
             <Text className="text-[#1A5C37] text-xs font-bold ml-1">Üye Ekle</Text>
           </TouchableOpacity>
        </View>

        <View className="space-y-3 mb-8">
          {mockFamily.map((member) => (
             <View key={member.id} className="bg-white border text-sm border-[#E8F0EC] rounded-2xl p-4 flex-row items-center">
               <View className="relative">
                 <Image source={{ uri: member.avatar }} className="w-12 h-12 rounded-full border border-[#E8F0EC]" />
                 {member.status === 'active' && (
                   <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                 )}
               </View>

               <View className="flex-1 ml-3">
                 <View className="flex-row items-center gap-2">
                    <Text className="font-bold text-[#1A2E23] text-[15px]">{member.name}</Text>
                    <View className="bg-[#F8FAF9] px-2 py-0.5 rounded-sm border border-[#E8F0EC]">
                      <Text className="text-[10px] text-[#5A7264]">{member.relation}</Text>
                    </View>
                 </View>
                 
                 {member.status === 'active' ? (
                   <View className="flex-row items-center mt-1">
                     <Ionicons name="star" size={12} color="#F59E0B" />
                     <Text className="text-xs text-[#5A7264] font-medium ml-1">{member.points} Puan</Text>
                   </View>
                 ) : (
                   <Text className="text-xs text-amber-600 mt-1 italic">Davet bekleniyor...</Text>
                 )}
               </View>

               {member.status === 'active' ? (
                  <TouchableOpacity className="w-8 h-8 rounded-full bg-[#E8F5EC] items-center justify-center">
                    <Ionicons name="chevron-forward" size={16} color="#1A5C37" />
                  </TouchableOpacity>
               ) : (
                  <TouchableOpacity>
                     <Text className="text-[#1A5C37] font-bold text-xs">Tekrar Yolla</Text>
                  </TouchableOpacity>
               )}
             </View>
          ))}
        </View>

        {/* Group Goals */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Ortak Hedefler</Text>
        <View className="bg-white border border-[#E8F0EC] rounded-2xl p-5 mb-8">
           <View className="flex-row items-start justify-between mb-3">
             <View className="flex-1 pr-4">
                <Text className="font-bold text-[#1A2E23] mb-1">Ailecek 100K Adım</Text>
                <Text className="text-xs text-[#5A7264]">Bu hafta toplam 100.000 adım atın.</Text>
             </View>
             <Ionicons name="footsteps" size={24} color="#4A7FB5" />
           </View>

           <View className="h-2 bg-[#F8FAF9] rounded-full overflow-hidden my-2">
              <View className="w-[65%] h-full bg-[#4A7FB5] rounded-full" />
           </View>
           
           <View className="flex-row items-center justify-between mt-1">
             <Text className="text-[10px] text-[#5A7264] font-medium">65.000 / 100.000</Text>
             <Text className="text-[10px] text-[#4A7FB5] font-bold">%65 Tamamlandı</Text>
           </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}
