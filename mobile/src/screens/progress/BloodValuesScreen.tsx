import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type BloodValue = {
  name: string
  value: number
  unit: string
  min: number
  max: number
  date: string
}

const mockBloodValues: BloodValue[] = [
  { name: 'Açlık Kan Şekeri', value: 95, unit: 'mg/dL', min: 70, max: 100, date: '10 Mar' },
  { name: 'Toplam Kolesterol', value: 195, unit: 'mg/dL', min: 0, max: 200, date: '10 Mar' },
  { name: 'LDL Kolesterol', value: 115, unit: 'mg/dL', min: 0, max: 130, date: '10 Mar' },
  { name: 'HDL Kolesterol', value: 55, unit: 'mg/dL', min: 40, max: 100, date: '10 Mar' },
  { name: 'Trigliserit', value: 140, unit: 'mg/dL', min: 0, max: 150, date: '10 Mar' },
  { name: 'Hemoglobin', value: 14.2, unit: 'g/dL', min: 12, max: 17, date: '10 Mar' },
  { name: 'Demir', value: 85, unit: 'µg/dL', min: 60, max: 170, date: '10 Mar' },
  { name: 'B12 Vitamini', value: 320, unit: 'pg/mL', min: 200, max: 900, date: '10 Mar' },
  { name: 'D Vitamini', value: 28, unit: 'ng/mL', min: 30, max: 100, date: '10 Mar' },
  { name: 'TSH', value: 2.5, unit: 'mIU/L', min: 0.4, max: 4.0, date: '10 Mar' },
]

function getStatus(val: number, min: number, max: number) {
  if (val < min) return { label: 'Düşük', color: '#E8A040', bg: '#FEF3C7' }
  if (val > max) return { label: 'Yüksek', color: '#EF4444', bg: '#FEE2E2' }
  return { label: 'Normal', color: '#1A5C37', bg: '#E8F5EC' }
}

export default function BloodValuesScreen() {
  const navigation = useNavigation<Nav>()

  const normalCount = mockBloodValues.filter(v => v.value >= v.min && v.value <= v.max).length

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Kan Değerleri (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 , backgroundColor: '#FFFFFF' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, borderRadius: 9999, backgroundColor: '#E8F5EC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Ionicons name="water" size={22} color="#1A5C37" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23' }}>
                {normalCount}/{mockBloodValues.length} Normal
              </Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>Son tahlil: 10 Mart 2026</Text>
            </View>
          </View>
        </View>

        {/* Values list */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Tüm Değerler</Text>
        {mockBloodValues.map((v, i) => {
          const status = getStatus(v.value, v.min, v.max)
          const pct = Math.min(((v.value - v.min) / (v.max - v.min)) * 100, 100)
          return (
            <View key={i} style={{ borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' , backgroundColor: '#FFFFFF' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23', flex: 1 }}>{v.name}</Text>
                <View style={{ borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 2, backgroundColor: status.bg }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: status.color }}>{status.label}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A2E23' }}>{v.value}</Text>
                <Text style={{ fontSize: 14, color: '#5A7264' }}>{v.unit}</Text>
              </View>
              {/* Progress bar */}
              <View style={{ height: 8, backgroundColor: '#E8F0EC', borderRadius: 9999, overflow: 'hidden' }}>
                <View
                  style={{ height: '100%', borderRadius: 9999,
                    width: `${Math.max(Math.min(pct, 100), 2)}%`,
                    backgroundColor: status.color,
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ fontSize: 10, color: '#5A7264' }}>{v.min} {v.unit}</Text>
                <Text style={{ fontSize: 10, color: '#5A7264' }}>{v.max} {v.unit}</Text>
              </View>
            </View>
          )
        })}

        {/* Add button */}
        <TouchableOpacity
          style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 32, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>+ Yeni Tahlil Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
