import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { getWeightHistory } from '../../services/api/tracking'

type Nav = StackNavigationProp<ProgressStackParamList>

interface WeightPoint { date: string; value: number }

const target = 70.0

export default function WeightScreen() {
  const navigation = useNavigation<Nav>()
  const [weightHistory, setWeightHistory] = useState<WeightPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await getWeightHistory()
        const mapped = data.map(w => ({ date: w.date, value: typeof w.value === 'number' ? w.value : 0 }))
        setWeightHistory(mapped.length > 0 ? mapped.slice(-7) : [
          { date: 'Demo', value: 75.0 }, { date: 'Demo', value: 74.8 }, { date: 'Demo', value: 74.5 },
        ])
      } catch {
        setWeightHistory([{ date: 'Demo', value: 74.5 }])
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (isLoading) {
    return (
      <ScreenWrapper padded={false}>
        <AppHeader title="Kilo Takibi" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#1A5C37" />
        </View>
      </ScreenWrapper>
    )
  }

  const current = weightHistory[weightHistory.length - 1] ?? { date: '-', value: 0 }
  const diff = current.value - target
  const minW = Math.min(...weightHistory.map(d => d.value), target) - 1
  const maxW = Math.max(...weightHistory.map(d => d.value)) + 1

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Kilo Takibi" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Current weight card */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
          <Text style={{ fontSize: 14, color: '#5A7264' }}>Mevcut Kilo</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 }}>
            <Text style={{ fontSize: 36, fontWeight: '800', color: '#1A2E23' }}>{current.value.toFixed(1)}</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#5A7264', marginLeft: 4, marginBottom: 4 }}>kg</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <View style={{ backgroundColor: '#E8F5EC', borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="arrow-down" size={14} color="#1A5C37" />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#1A5C37', marginLeft: 2 }}>
                {diff.toFixed(1)} kg hedefe kaldı
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: '#5A7264', marginLeft: 8 }}>Hedef: {target} kg</Text>
          </View>
        </View>

        {/* Simple bar chart */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 16 }}>Son {weightHistory.length} Gün</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 128 }}>
            {weightHistory.map((d, i) => {
              const pct = maxW > minW ? ((d.value - minW) / (maxW - minW)) * 100 : 50
              return (
                <View key={i} style={{ alignItems: 'center', flex: 1, marginHorizontal: 2 }}>
                  <Text style={{ fontSize: 10, color: '#5A7264', marginBottom: 4 }}>{d.value.toFixed(1)}</Text>
                  <View
                    style={{ width: 20, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#1A5C37', height: `${pct}%` }}
                  />
                  <Text style={{ fontSize: 10, color: '#5A7264', marginTop: 4 }}>{d.date.split(' ')[0]}</Text>
                </View>
              )
            })}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <View style={{ flex: 1, backgroundColor: '#EF44444d' }} /* TODO: h-px *//>
            <Text style={{ fontSize: 10, color: '#EF4444', marginHorizontal: 8 }}>Hedef: {target} kg</Text>
            <View style={{ flex: 1, backgroundColor: '#EF44444d' }} /* TODO: h-px *//>
          </View>
        </View>

        {/* History list */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Geçmiş Kayıtlar</Text>
        {[...weightHistory].reverse().map((d, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
            <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: '#E8F5EC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Ionicons name="scale-outline" size={18} color="#1A5C37" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{d.value.toFixed(1)} kg</Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>{d.date}</Text>
            </View>
            {i > 0 && weightHistory.length > 1 && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={weightHistory[weightHistory.length - 1 - i]?.value < weightHistory[weightHistory.length - i]?.value ? 'arrow-down' : 'arrow-up'}
                  size={14}
                  color={weightHistory[weightHistory.length - 1 - i]?.value < weightHistory[weightHistory.length - i]?.value ? '#1A5C37' : '#EF4444'}
                />
              </View>
            )}
          </View>
        ))}

        {/* Add button */}
        <TouchableOpacity
          style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 32, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>+ Yeni Kayıt Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
