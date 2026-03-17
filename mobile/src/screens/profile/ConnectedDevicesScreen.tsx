import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type Device = {
  id: string
  name: string
  type: string
  icon: keyof typeof Ionicons.glyphMap
  connected: boolean
  lastSync?: string
}

const mockDevices: Device[] = [
  { id: '1', name: 'Apple Watch SE', type: 'Akıllı Saat', icon: 'watch-outline', connected: true, lastSync: '5 dk önce' },
  { id: '2', name: 'Xiaomi Mi Band 8', type: 'Fitness Bileklik', icon: 'fitness-outline', connected: false, lastSync: '3 gün önce' },
]

const availableDevices = [
  { name: 'Fitbit', icon: 'watch-outline' as const },
  { name: 'Samsung Health', icon: 'phone-portrait-outline' as const },
  { name: 'Google Fit', icon: 'logo-google' as const },
  { name: 'Garmin', icon: 'navigate-outline' as const },
  { name: 'Apple Health', icon: 'heart-outline' as const },
  { name: 'Withings', icon: 'scale-outline' as const },
]

export default function ConnectedDevicesScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Bağlı Cihazlar" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Connected devices */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Bağlı ({mockDevices.filter(d => d.connected).length})</Text>
        {mockDevices.map((d) => (
          <View key={d.id} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: d.connected ? '#E8F5EC' : '#F8FAF9' }}
            >
              <Ionicons name={d.icon} size={20} color={d.connected ? '#1A5C37' : '#A8BFB2'} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{d.name}</Text>
              <Text className="text-xs text-[#5A7264]">{d.type}</Text>
              {d.lastSync && <Text className="text-[10px] text-[#A8BFB2]">Son senkronizasyon: {d.lastSync}</Text>}
            </View>
            <View
              className="rounded-full px-2.5 py-1"
              style={{ backgroundColor: d.connected ? '#E8F5EC' : '#FEE2E2' }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: d.connected ? '#1A5C37' : '#EF4444' }}
              >
                {d.connected ? 'Bağlı' : 'Bağlı Değil'}
              </Text>
            </View>
          </View>
        ))}

        {/* Available to connect */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3 mt-4">Bağlanabilir Cihazlar</Text>
        <View className="flex-row flex-wrap mb-4">
          {availableDevices.map((d, i) => (
            <TouchableOpacity
              key={i}
              className="w-[48%] mx-[1%] mb-2.5 bg-white rounded-xl p-4 border border-[#E8F0EC] items-center"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-full bg-[#E8F5EC] items-center justify-center mb-2">
                <Ionicons name={d.icon} size={22} color="#1A5C37" />
              </View>
              <Text className="text-sm font-semibold text-[#1A2E23]">{d.name}</Text>
              <Text className="text-xs text-[#1A5C37] mt-1">Bağlan</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
