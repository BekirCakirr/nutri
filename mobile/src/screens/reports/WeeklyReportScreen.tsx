import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function WeeklyReportScreen() {
  const navigation = useNavigation()

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader
        title="Haftalık Rapor"
        subtitle="17-23 Mart 2026"
        onBack={() => navigation.goBack()}
        rightIcon="share-social-outline"
        onRightPress={() => {}}
      />
      
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 16, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        
        {/* Score Header */}
        <View style={{ backgroundColor: '#1A5C37', borderRadius: 24, padding: 24, marginBottom: 24, alignItems: 'center' }} /* TODO: shadow-lg shadow-[#1A5C37]/30 */>
           <Text style={{ color: '#E8F5EC', fontSize: 14, textTransform: 'uppercase', marginBottom: 8, fontWeight: '500' }} /* TODO: tracking-wider */>Haftalık Sağlık Skoru</Text>
           <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
             <Text style={{ color: '#FFFFFF', fontWeight: '800', paddingBottom: 4 , fontSize: 48 }}>85</Text>
             <Text style={{ color: '#A8BFB2', fontSize: 20, fontWeight: '700', marginLeft: 4, marginBottom: 8 }}>/100</Text>
           </View>
           <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999 , backgroundColor: 'rgba(255,255,255,0.1)' }}>
             <Ionicons name="trending-up" size={16} color="#4ECDC4" />
             <Text style={{ color: '#4ECDC4', fontSize: 12, fontWeight: '700', marginLeft: 8 }}>Geçen haftaya göre %12 artış</Text>
           </View>
        </View>

        {/* Macros Summary */}
        <Text style={{ color: '#1A2E23', fontWeight: '700', fontSize: 18, marginBottom: 16 }}>Makro Besin Dengesi</Text>
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 24 , backgroundColor: '#FFFFFF' }}>
           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                 <Text style={{ fontSize: 12, color: '#5A7264', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Protein</Text>
                 <Text style={{ fontSize: 20, fontWeight: '700', color: '#4A7FB5' }}>%28</Text>
              </View>
              <View style={{ height: 40, backgroundColor: '#E8F0EC' }} /* TODO: w-px *//>
              <View style={{ alignItems: 'center', flex: 1 }}>
                 <Text style={{ fontSize: 12, color: '#5A7264', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Karb</Text>
                 <Text style={{ fontSize: 20, fontWeight: '700', color: '#F59E0B' }}>%45</Text>
              </View>
              <View style={{ height: 40, backgroundColor: '#E8F0EC' }} /* TODO: w-px *//>
              <View style={{ alignItems: 'center', flex: 1 }}>
                 <Text style={{ fontSize: 12, color: '#5A7264', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Yağ</Text>
                 <Text style={{ fontSize: 20, fontWeight: '700', color: '#EF4444' }}>%27</Text>
              </View>
           </View>
           
           <View style={{ height: 12, borderRadius: 9999, flexDirection: 'row', overflow: 'hidden' }} /* TODO: w-full shadow-inner */>
              <View style={{ backgroundColor: '#4A7FB5', width: '28%' , height: '100%' }} />
              <View style={{ backgroundColor: '#F59E0B', width: '45%' , height: '100%' }} />
              <View style={{ backgroundColor: '#EF4444', width: '27%' , height: '100%' }} />
           </View>
        </View>

        {/* Highlights */}
        <Text style={{ color: '#1A2E23', fontWeight: '700', fontSize: 18, marginBottom: 16 }}>Öne Çıkanlar</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
           <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, justifyContent: 'space-between', minHeight: 120 }} /* TODO: bg-emerald-50 border-emerald-100 flex-col */>
              <View style={{ width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }} /* TODO: bg-emerald-200 */>
                 <Ionicons name="water" size={20} color="#059669" />
              </View>
              <View>
                 <Text style={{ fontWeight: '800', fontSize: 20, marginBottom: 4 }} /* TODO: text-emerald-800 */>14.5<Text style={{ fontSize: 14, fontWeight: '500' }}>L</Text></Text>
                 <Text style={{ fontSize: 10 }} /* TODO: text-emerald-700 */>%90 Hedef</Text>
              </View>
           </View>
           <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, justifyContent: 'space-between', minHeight: 120 }} /* TODO: bg-blue-50 border-blue-100 flex-col */>
              <View style={{ width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }} /* TODO: bg-blue-200 */>
                 <Ionicons name="barbell" size={20} color="#2563EB" />
              </View>
               <View>
                 <Text style={{ fontWeight: '800', fontSize: 20, marginBottom: 4 }} /* TODO: text-blue-800 */>3.5<Text style={{ fontSize: 14, fontWeight: '500' }}>Sa</Text></Text>
                 <Text style={{ fontSize: 10 }} /* TODO: text-blue-700 */>Aktivite</Text>
              </View>
           </View>
           <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, justifyContent: 'space-between', minHeight: 120 }} /* TODO: bg-amber-50 border-amber-100 flex-col */>
              <View style={{ width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }} /* TODO: bg-amber-200 */>
                 <Ionicons name="restaurant" size={20} color="#D97706" />
              </View>
               <View>
                 <Text style={{ fontWeight: '800', fontSize: 20, marginBottom: 4 , color: '#92400E' }}>21<Text style={{ fontSize: 14, fontWeight: '500' }}>Öğün</Text></Text>
                 <Text style={{ fontSize: 10 }} /* TODO: text-amber-700 */>Eksiksiz</Text>
              </View>
           </View>
        </View>

        {/* AI Insight */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 32, flexDirection: 'row', alignItems: 'flex-start' , backgroundColor: '#FFFFFF' }}>
           <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: '#1A5C37', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
              <Ionicons name="sparkles" size={20} color="#FFF" />
           </View>
           <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: '#1A2E23', marginBottom: 6, fontSize: 16 }}>Yapay Zeka Yorumu</Text>
              <Text style={{ color: '#5A7264', fontSize: 13 , lineHeight: 20 }}>
                Harika bir hafta geçirdin! Su tüketimin oldukça başarılı. Hafta sonu karbonhidrat alımında hafif sapmalar olmuş, ancak bunu egzersizle dengelemişsin. Önümüzdeki hafta lif alımını %10 artırmayı hedefleyebiliriz.
              </Text>
           </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}
