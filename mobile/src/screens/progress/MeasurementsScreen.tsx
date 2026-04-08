import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type Measurement = {
  name: string
  value: number
  prevValue: number
  unit: string
  icon: keyof typeof Ionicons.glyphMap
}

const mockMeasurements: Measurement[] = [
  { name: 'Göğüs', value: 96, prevValue: 98, unit: 'cm', icon: 'body-outline' },
  { name: 'Bel', value: 82, prevValue: 85, unit: 'cm', icon: 'resize-outline' },
  { name: 'Kalça', value: 99, prevValue: 100, unit: 'cm', icon: 'body-outline' },
  { name: 'Sağ Kol', value: 33, prevValue: 32.5, unit: 'cm', icon: 'fitness-outline' },
  { name: 'Sol Kol', value: 32.5, prevValue: 32, unit: 'cm', icon: 'fitness-outline' },
  { name: 'Sağ Bacak', value: 55, prevValue: 56, unit: 'cm', icon: 'walk-outline' },
  { name: 'Sol Bacak', value: 54.5, prevValue: 55.5, unit: 'cm', icon: 'walk-outline' },
  { name: 'Boyun', value: 38, prevValue: 38.5, unit: 'cm', icon: 'person-outline' },
]

const lastUpdate = '16 Mar 2026'

export default function MeasurementsScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Vücut Ölçüleri (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <View style={{ backgroundColor: '#1A2E23', borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, borderRadius: 9999, backgroundColor: '#2D4A3A', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Ionicons name="body-outline" size={24} color="#4ECDC4" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>{mockMeasurements.length} Ölçü</Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Son güncelleme: {lastUpdate}</Text>
            </View>
          </View>
        </View>

        {/* Measurements list */}
        {mockMeasurements.map((m, i) => {
          const diff = m.value - m.prevValue
          const isDown = diff < 0
          const isUp = diff > 0
          return (
            <View key={i} style={{ borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: '#E8F5EC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name={m.icon} size={18} color="#1A5C37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{m.name}</Text>
                  <Text style={{ fontSize: 12, color: '#5A7264' }}>Önceki: {m.prevValue} {m.unit}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#1A2E23' }}>{m.value} {m.unit}</Text>
                  {diff !== 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <Ionicons
                        name={isDown ? 'arrow-down' : 'arrow-up'}
                        size={12}
                        color={isDown ? '#1A5C37' : '#EF4444'}
                      />
                      <Text
                        style={{ fontSize: 12, fontWeight: '600', marginLeft: 2, color: isDown ? '#1A5C37' : '#EF4444' }}
                      >
                        {Math.abs(diff).toFixed(1)} {m.unit}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )
        })}

        {/* Add button */}
        <TouchableOpacity
          style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 32, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>+ Yeni Ölçüm Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
