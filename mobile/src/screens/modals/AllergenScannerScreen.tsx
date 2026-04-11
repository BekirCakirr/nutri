import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type ScanResult = {
  name: string
  status: 'safe' | 'warning' | 'danger'
  allergens: string[]
} | null

const mockScanResults: ScanResult[] = [
  { name: 'Granola Bar', status: 'danger', allergens: ['Fıstık', 'Glüten', 'Süt'] },
]

const userAllergens = ['Fıstık', 'Süt Ürünleri', 'Glüten']

const recentScans = [
  { name: 'Soya Sütü', status: 'safe' as const, date: '17 Mar', allergens: [] },
  { name: 'Bisküvi', status: 'warning' as const, date: '16 Mar', allergens: ['Glüten'] },
  { name: 'Granola Bar', status: 'danger' as const, date: '16 Mar', allergens: ['Fıstık', 'Glüten', 'Süt'] },
  { name: 'Pirinç Patlağı', status: 'safe' as const, date: '15 Mar', allergens: [] },
]

function statusInfo(s: string) {
  if (s === 'safe') return { label: 'Güvenli', color: '#1A5C37', bg: '#E8F5EC', icon: 'checkmark-circle' as const }
  if (s === 'warning') return { label: 'Dikkat', color: '#E8A040', bg: '#FEF3C7', icon: 'warning' as const }
  return { label: 'Tehlikeli', color: '#EF4444', bg: '#FEE2E2', icon: 'alert-circle' as const }
}

export default function AllergenScannerScreen() {
  const navigation = useNavigation()
  const [scanning, setScanning] = useState(false)

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Alerjen Tarayıcı" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Scan area */}
        <View style={{ borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16, alignItems: 'center' , backgroundColor: '#FFFFFF' }}>
          <View style={{ width: 96, height: 96, borderRadius: 16, backgroundColor: '#F8FAF9', borderWidth: 2, borderColor: '#D4E2DA', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }} /* TODO: border-dashed */>
            <Ionicons name="scan-outline" size={40} color="#5A7264" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23' }}>Barkod veya Etiket Tarayın</Text>
          <Text style={{ fontSize: 14, color: '#5A7264', textAlign: 'center', marginTop: 4 }}>
            Ürünün barkodunu veya içindekiler etiketini tarayarak alerjen kontrolü yapın
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32, marginTop: 16, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
            activeOpacity={0.8}
            onPress={() => setScanning(!scanning)}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>📷 Taramayı Başlat</Text>
          </TouchableOpacity>
        </View>

        {/* My allergens */}
        <View style={{ backgroundColor: '#FEF3C7', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F59E0B33' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="warning" size={18} color="#E8A040" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A2E23', marginLeft: 8 }}>Alerjilerim</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {userAllergens.map((a, i) => (
              <View key={i} style={{ borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginBottom: 4 , backgroundColor: '#FFFFFF' }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#EF4444' }}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mock scan result */}
        {mockScanResults[0] && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Son Tarama Sonucu</Text>
            <View
              style={{ borderRadius: 16, padding: 20, borderWidth: 2, backgroundColor: statusInfo(mockScanResults[0].status).bg,
                borderColor: statusInfo(mockScanResults[0].status).color + '30', }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Ionicons
                  name={statusInfo(mockScanResults[0].status).icon}
                  size={24}
                  color={statusInfo(mockScanResults[0].status).color}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23' }}>{mockScanResults[0].name}</Text>
                  <Text
                    style={{ fontSize: 14, fontWeight: '700', color: statusInfo(mockScanResults[0].status).color }}
                  >
                    {statusInfo(mockScanResults[0].status).label}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, color: '#5A7264', marginBottom: 8 }}>Bulunan alerjenler:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {mockScanResults[0].allergens.map((a, i) => (
                  <View key={i} style={{ borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginBottom: 4 }} /* TODO: bg-white/80 */>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#EF4444' }}>⚠️ {a}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Recent scans */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Son Taramalar</Text>
        {recentScans.map((scan, i) => {
          const si = statusInfo(scan.status)
          return (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC' , backgroundColor: '#FFFFFF' }}>
              <View
                style={{ width: 36, height: 36, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: si.bg }}
              >
                <Ionicons name={si.icon} size={16} color={si.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23' }}>{scan.name}</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>{scan.date}</Text>
              </View>
              <View style={{ borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: si.bg }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: si.color }}>{si.label}</Text>
              </View>
            </View>
          )
        })}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
