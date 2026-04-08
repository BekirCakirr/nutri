import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
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
      
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 16, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        
        {/* Trend Banner */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, marginBottom: 24, flexDirection: 'row', alignItems: 'center' }} /* TODO: bg-white border-emerald-200 shadow-sm */>
           <View style={{ flex: 1 }}>
             <Text style={{ color: '#1A2E23', fontWeight: '700', fontSize: 18, marginBottom: 4 }}>Mükemmel İlerleme!</Text>
             <Text style={{ color: '#5A7264', fontSize: 12 }} /* TODO: leading-relaxed */>Mart ayında hedef kilona %80 daha yaklaştın. Düzenli beslenmen harika sonuçlar veriyor.</Text>
           </View>
           <View style={{ width: 64, height: 64, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginLeft: 16 }} /* TODO: bg-emerald-100 */>
              <Ionicons name="trending-up" size={32} color="#10B981" />
           </View>
        </View>

        {/* Key Metrics */}
        <Text style={{ color: '#1A2E23', fontWeight: '700', fontSize: 18, marginBottom: 16 }}>Aylık Özet</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 }}>
           <View style={{ width: '48%', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
              <View style={{ width: 32, height: 32, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }} /* TODO: bg-blue-100 */>
                 <Ionicons name="scale" size={16} color="#3B82F6" />
              </View>
              <Text style={{ color: '#5A7264', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Kilo Değişimi</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                 <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A2E23' }}>-2.4</Text>
                 <Text style={{ color: '#A8BFB2', fontSize: 14, marginLeft: 4, marginBottom: 4, fontWeight: '500' }}>kg</Text>
              </View>
           </View>

           <View style={{ width: '48%', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
              <View style={{ width: 32, height: 32, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }} /* TODO: bg-orange-100 */>
                 <Ionicons name="flame" size={16} color="#F97316" />
              </View>
              <Text style={{ color: '#5A7264', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Yakılan</Text>
               <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                 <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A2E23' }}>12K</Text>
                 <Text style={{ color: '#A8BFB2', fontSize: 14, marginLeft: 4, marginBottom: 4, fontWeight: '500' }}>kcal</Text>
              </View>
           </View>

           <View style={{ width: '48%', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
              <View style={{ width: 32, height: 32, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }} /* TODO: bg-green-100 */>
                 <Ionicons name="calendar-clear" size={16} color="#10B981" />
              </View>
              <Text style={{ color: '#5A7264', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Kusursuz Gün</Text>
               <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                 <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A2E23' }}>24</Text>
                 <Text style={{ color: '#A8BFB2', fontSize: 14, marginLeft: 4, marginBottom: 4, fontWeight: '500' }}>gün</Text>
              </View>
           </View>

           <View style={{ width: '48%', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
              <View style={{ width: 32, height: 32, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }} /* TODO: bg-purple-100 */>
                 <Ionicons name="moon" size={16} color="#8B5CF6" />
              </View>
              <Text style={{ color: '#5A7264', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Ort. Uyku</Text>
               <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                 <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A2E23' }}>7.5</Text>
                 <Text style={{ color: '#A8BFB2', fontSize: 14, marginLeft: 4, marginBottom: 4, fontWeight: '500' }}>saat</Text>
              </View>
           </View>
        </View>

        {/* Doctor Action */}
        <TouchableOpacity style={{ backgroundColor: '#1A5C37', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }} /* TODO: shadow-sm shadow-[#1A5C37]/30 */>
           <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: 4 }}>Diyetisyeninle Paylaş</Text>
              <Text style={{ color: '#E8F5EC', fontSize: 12 }}>Bu aylık veriyi uzmanına gönder ve değerlendirme al.</Text>
           </View>
           <Ionicons name="paper-plane" size={24} color="#FFF" />
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  )
}
