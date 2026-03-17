import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
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
    <ScreenWrapper padded={false}>
      <AppHeader title="Alerjen Tarayıcı" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Scan area */}
        <View className="bg-white rounded-2xl p-6 border border-[#E8F0EC] mb-4 items-center">
          <View className="w-24 h-24 rounded-2xl bg-[#F8FAF9] border-2 border-dashed border-[#D4E2DA] items-center justify-center mb-4">
            <Ionicons name="scan-outline" size={40} color="#5A7264" />
          </View>
          <Text className="text-base font-bold text-[#1A2E23]">Barkod veya Etiket Tarayın</Text>
          <Text className="text-sm text-[#5A7264] text-center mt-1">
            Ürünün barkodunu veya içindekiler etiketini tarayarak alerjen kontrolü yapın
          </Text>
          <TouchableOpacity
            className="bg-[#1A5C37] rounded-xl py-3.5 px-8 mt-4"
            style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
            activeOpacity={0.8}
            onPress={() => setScanning(!scanning)}
          >
            <Text className="text-base font-semibold text-white">📷 Taramayı Başlat</Text>
          </TouchableOpacity>
        </View>

        {/* My allergens */}
        <View className="bg-[#FEF3C7] rounded-2xl p-4 mb-4 border border-[#F59E0B]/20">
          <View className="flex-row items-center mb-2">
            <Ionicons name="warning" size={18} color="#E8A040" />
            <Text className="text-sm font-bold text-[#1A2E23] ml-2">Alerjilerim</Text>
          </View>
          <View className="flex-row flex-wrap">
            {userAllergens.map((a, i) => (
              <View key={i} className="bg-white rounded-full px-3 py-1 mr-2 mb-1">
                <Text className="text-xs font-semibold text-[#EF4444]">{a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mock scan result */}
        {mockScanResults[0] && (
          <View className="mb-4">
            <Text className="text-base font-bold text-[#1A2E23] mb-3">Son Tarama Sonucu</Text>
            <View
              className="rounded-2xl p-5 border-2"
              style={{
                backgroundColor: statusInfo(mockScanResults[0].status).bg,
                borderColor: statusInfo(mockScanResults[0].status).color + '30',
              }}
            >
              <View className="flex-row items-center mb-3">
                <Ionicons
                  name={statusInfo(mockScanResults[0].status).icon}
                  size={24}
                  color={statusInfo(mockScanResults[0].status).color}
                />
                <View className="ml-3">
                  <Text className="text-lg font-bold text-[#1A2E23]">{mockScanResults[0].name}</Text>
                  <Text
                    className="text-sm font-bold"
                    style={{ color: statusInfo(mockScanResults[0].status).color }}
                  >
                    {statusInfo(mockScanResults[0].status).label}
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-[#5A7264] mb-2">Bulunan alerjenler:</Text>
              <View className="flex-row flex-wrap">
                {mockScanResults[0].allergens.map((a, i) => (
                  <View key={i} className="bg-white/80 rounded-full px-3 py-1 mr-2 mb-1">
                    <Text className="text-xs font-bold text-[#EF4444]">⚠️ {a}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Recent scans */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Son Taramalar</Text>
        {recentScans.map((scan, i) => {
          const si = statusInfo(scan.status)
          return (
            <View key={i} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2 border border-[#E8F0EC]">
              <View
                className="w-9 h-9 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: si.bg }}
              >
                <Ionicons name={si.icon} size={16} color={si.color} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-[#1A2E23]">{scan.name}</Text>
                <Text className="text-xs text-[#5A7264]">{scan.date}</Text>
              </View>
              <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: si.bg }}>
                <Text className="text-[10px] font-bold" style={{ color: si.color }}>{si.label}</Text>
              </View>
            </View>
          )
        })}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
