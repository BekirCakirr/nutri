import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native'
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
      
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 16, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={{ backgroundColor: '#1A5C37', borderRadius: 12, padding: 20, marginBottom: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1A5C37' }}>
          <View style={{ flex: 1, paddingRight: 16 }}>
             <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 18, marginBottom: 4 }}>Beraber Daha Güçlüyüz!</Text>
             <Text style={{ color: '#E8F5EC', fontSize: 12 }} /* TODO: leading-relaxed */>
               Aile üyelerinizi ekleyin, birbirinizin gelişimini takip edin ve grup hedeflerine ulaşarak ortak rozetler kazanın.
             </Text>
          </View>
          <View style={{ width: 56, height: 56, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' }} /* TODO: bg-white/20 */>
             <Ionicons name="people" size={32} color="#FFF" />
          </View>
        </View>

        {/* Members List */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
           <Text style={{ color: '#1A2E23', fontWeight: '700', fontSize: 18 }}>Aile Üyeleri</Text>
           <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5EC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999 }}>
             <Ionicons name="add" size={16} color="#1A5C37" />
             <Text style={{ color: '#1A5C37', fontSize: 12, fontWeight: '700', marginLeft: 4 }}>Üye Ekle</Text>
           </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 32 }} /* TODO: space-y-3 */>
          {mockFamily.map((member) => (
             <View key={member.id} style={{ borderWidth: 1, borderColor: '#E8F0EC', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
               <View style={{ position: 'relative' }}>
                 <Image source={{ uri: member.avatar }} style={{ width: 48, height: 48, borderRadius: 9999, borderWidth: 1, borderColor: '#E8F0EC' }} />
                 {member.status === 'active' && (
                   <View style={{ position: 'absolute', bottom: 0, right: 0, borderRadius: 9999, borderWidth: 2 }} /* TODO: w-3.5 h-3.5 bg-emerald-500 border-white *//>
                 )}
               </View>

               <View style={{ flex: 1, marginLeft: 12 }}>
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontWeight: '700', color: '#1A2E23', fontSize: 15 }}>{member.name}</Text>
                    <View style={{ backgroundColor: '#F8FAF9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#E8F0EC' }}>
                      <Text style={{ fontSize: 10, color: '#5A7264' }}>{member.relation}</Text>
                    </View>
                 </View>
                 
                 {member.status === 'active' ? (
                   <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                     <Ionicons name="star" size={12} color="#F59E0B" />
                     <Text style={{ fontSize: 12, color: '#5A7264', fontWeight: '500', marginLeft: 4 }}>{member.points} Puan</Text>
                   </View>
                 ) : (
                   <Text style={{ fontSize: 12, marginTop: 4 }} /* TODO: text-amber-600 italic */>Davet bekleniyor...</Text>
                 )}
               </View>

               {member.status === 'active' ? (
                  <TouchableOpacity style={{ width: 32, height: 32, borderRadius: 9999, backgroundColor: '#E8F5EC', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="chevron-forward" size={16} color="#1A5C37" />
                  </TouchableOpacity>
               ) : (
                  <TouchableOpacity>
                     <Text style={{ color: '#1A5C37', fontWeight: '700', fontSize: 12 }}>Tekrar Yolla</Text>
                  </TouchableOpacity>
               )}
             </View>
          ))}
        </View>

        {/* Group Goals */}
        <Text style={{ color: '#1A2E23', fontWeight: '700', fontSize: 18, marginBottom: 16 }}>Ortak Hedefler</Text>
        <View style={{ borderWidth: 1, borderColor: '#E8F0EC', borderRadius: 16, padding: 20, marginBottom: 32 }} /* TODO: bg-white */>
           <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
             <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={{ fontWeight: '700', color: '#1A2E23', marginBottom: 4 }}>Ailecek 100K Adım</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>Bu hafta toplam 100.000 adım atın.</Text>
             </View>
             <Ionicons name="footsteps" size={24} color="#4A7FB5" />
           </View>

           <View style={{ height: 8, backgroundColor: '#F8FAF9', borderRadius: 9999, overflow: 'hidden', marginVertical: 8 }}>
              <View style={{ width: '65%', backgroundColor: '#4A7FB5', borderRadius: 9999 }} /* TODO: h-full *//>
           </View>
           
           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
             <Text style={{ fontSize: 10, color: '#5A7264', fontWeight: '500' }}>65.000 / 100.000</Text>
             <Text style={{ fontSize: 10, color: '#4A7FB5', fontWeight: '700' }}>%65 Tamamlandı</Text>
           </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}
