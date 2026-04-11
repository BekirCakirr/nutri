import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type Nutrient = {
  name: string
  current: number
  target: number
  unit: string
  color: string
  category: string
}

const categories = ['Makrolar', 'Vitaminler', 'Mineraller']

const mockNutrients: Nutrient[] = [
  // Makrolar
  { name: 'Protein', current: 92, target: 120, unit: 'g', color: '#C75B4A', category: 'Makrolar' },
  { name: 'Karbonhidrat', current: 210, target: 275, unit: 'g', color: '#4A7FB5', category: 'Makrolar' },
  { name: 'Yağ', current: 58, target: 73, unit: 'g', color: '#D4A843', category: 'Makrolar' },
  { name: 'Lif', current: 18, target: 30, unit: 'g', color: '#5DA06B', category: 'Makrolar' },
  { name: 'Şeker', current: 42, target: 50, unit: 'g', color: '#E8A040', category: 'Makrolar' },
  // Vitaminler
  { name: 'C Vitamini', current: 72, target: 90, unit: 'mg', color: '#E8A040', category: 'Vitaminler' },
  { name: 'D Vitamini', current: 400, target: 600, unit: 'IU', color: '#F59E0B', category: 'Vitaminler' },
  { name: 'B12', current: 2.0, target: 2.4, unit: 'µg', color: '#C75B4A', category: 'Vitaminler' },
  { name: 'A Vitamini', current: 750, target: 900, unit: 'µg', color: '#4A7FB5', category: 'Vitaminler' },
  // Mineraller
  { name: 'Kalsiyum', current: 850, target: 1000, unit: 'mg', color: '#4A7FB5', category: 'Mineraller' },
  { name: 'Demir', current: 14, target: 18, unit: 'mg', color: '#EF4444', category: 'Mineraller' },
  { name: 'Magnezyum', current: 310, target: 400, unit: 'mg', color: '#1A5C37', category: 'Mineraller' },
  { name: 'Çinko', current: 9, target: 11, unit: 'mg', color: '#8B6BAA', category: 'Mineraller' },
  { name: 'Potasyum', current: 3200, target: 4700, unit: 'mg', color: '#D4A843', category: 'Mineraller' },
]

export default function NutrientBreakdownScreen() {
  const navigation = useNavigation<Nav>()
  const [activeCategory, setActiveCategory] = useState(0)

  const filtered = mockNutrients.filter(n => n.category === categories[activeCategory])

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Besin Detayı (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 , backgroundColor: '#FFFFFF' }}>
          <Text style={{ fontSize: 14, color: '#5A7264' }}>Bugünkü Alım</Text>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#1A2E23', marginTop: 4 }}>1680 kcal</Text>
          <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>
            {mockNutrients.filter(n => (n.current / n.target) >= 0.8).length}/{mockNutrients.length} besin hedefte
          </Text>
        </View>

        {/* Category tabs */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
          {categories.map((cat, i) => (
            <TouchableOpacity
              key={i}
              style={{ flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center', borderWidth: 1, backgroundColor: activeCategory === i ? '#1A5C37' : '#FFFFFF',
                borderColor: activeCategory === i ? '#1A5C37' : '#E8F0EC', }}
              activeOpacity={0.7}
              onPress={() => setActiveCategory(i)}
            >
              <Text
                style={{ fontSize: 14, fontWeight: '600', color: activeCategory === i ? '#FFFFFF' : '#5A7264' }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nutrient items */}
        {filtered.map((n, i) => {
          const pct = Math.min((n.current / n.target) * 100, 100)
          return (
            <View key={i} style={{ borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' , backgroundColor: '#FFFFFF' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{n.name}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: n.color }}>
                  {n.current} / {n.target} {n.unit}
                </Text>
              </View>
              <View style={{ backgroundColor: '#E8F0EC', borderRadius: 9999, overflow: 'hidden' }} /* TODO: h-2.5 */>
                <View
                  style={{ height: '100%', borderRadius: 9999, width: `${pct}%`, backgroundColor: n.color }}
                />
              </View>
              <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 4, textAlign: 'right' }}>%{Math.round(pct)}</Text>
            </View>
          )
        })}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
