import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type VitaminItem = {
  name: string
  current: number
  target: number
  unit: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
}

const mockVitamins: VitaminItem[] = [
  { name: 'C Vitamini', current: 72, target: 90, unit: 'mg', icon: 'nutrition-outline', color: '#E8A040' },
  { name: 'D Vitamini', current: 400, target: 600, unit: 'IU', icon: 'sunny-outline', color: '#F59E0B' },
  { name: 'B12 Vitamini', current: 2.0, target: 2.4, unit: 'µg', icon: 'flash-outline', color: '#C75B4A' },
  { name: 'Demir', current: 14, target: 18, unit: 'mg', icon: 'water', color: '#EF4444' },
  { name: 'Kalsiyum', current: 850, target: 1000, unit: 'mg', icon: 'fitness-outline', color: '#4A7FB5' },
  { name: 'Magnezyum', current: 310, target: 400, unit: 'mg', icon: 'leaf-outline', color: '#1A5C37' },
  { name: 'Çinko', current: 9, target: 11, unit: 'mg', icon: 'shield-outline', color: '#8B6BAA' },
  { name: 'A Vitamini', current: 750, target: 900, unit: 'µg', icon: 'eye-outline', color: '#E8A040' },
  { name: 'E Vitamini', current: 12, target: 15, unit: 'mg', icon: 'heart-outline', color: '#4ECDC4' },
  { name: 'Omega-3', current: 1.2, target: 1.6, unit: 'g', icon: 'fish-outline', color: '#4A90B8' },
  { name: 'Lif', current: 22, target: 30, unit: 'g', icon: 'leaf-outline', color: '#5DA06B' },
  { name: 'Potasyum', current: 3200, target: 4700, unit: 'mg', icon: 'pulse-outline', color: '#D4A843' },
]

export default function VitaminsScreen() {
  const navigation = useNavigation<Nav>()

  const adequate = mockVitamins.filter(v => (v.current / v.target) >= 0.8).length

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Vitamin & Mineral (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 , backgroundColor: '#FFFFFF' }}>
          <Text style={{ fontSize: 14, color: '#5A7264' }}>Günlük Alım Durumu</Text>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#1A2E23', marginTop: 4 }}>
            {adequate}/{mockVitamins.length} yeterli
          </Text>
          <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 4 }}>%80 ve üzeri yeterli kabul edilir</Text>
        </View>

        {/* Vitamins list */}
        {mockVitamins.map((v, i) => {
          const pct = Math.min((v.current / v.target) * 100, 100)
          const isLow = pct < 60
          const isOk = pct >= 80
          return (
            <View key={i} style={{ borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' , backgroundColor: '#FFFFFF' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View
                  style={{ width: 36, height: 36, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: v.color + '20' }}
                >
                  <Ionicons name={v.icon} size={18} color={v.color} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23', flex: 1 }}>{v.name}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: isLow ? '#EF4444' : isOk ? '#1A5C37' : '#E8A040' }}>
                  %{Math.round(pct)}
                </Text>
              </View>
              {/* Progress bar */}
              <View style={{ backgroundColor: '#E8F0EC', borderRadius: 9999, overflow: 'hidden' }} /* TODO: h-2.5 */>
                <View
                  style={{ height: '100%', borderRadius: 9999,
                    width: `${pct}%`,
                    backgroundColor: isLow ? '#EF4444' : isOk ? '#1A5C37' : '#E8A040',
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>{v.current} {v.unit}</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>Hedef: {v.target} {v.unit}</Text>
              </View>
            </View>
          )
        })}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
