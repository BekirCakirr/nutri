import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type MacroData = {
  name: string
  current: number
  target: number
  unit: string
  color: string
  calories: number
}

const macros: MacroData[] = [
  { name: 'Protein', current: 92, target: 120, unit: 'g', color: '#C75B4A', calories: 368 },
  { name: 'Karbonhidrat', current: 210, target: 275, unit: 'g', color: '#4A7FB5', calories: 840 },
  { name: 'Yağ', current: 58, target: 73, unit: 'g', color: '#D4A843', calories: 522 },
]

const totalCal = macros.reduce((s, m) => s + m.calories, 0)
const targetCal = 2200

const weeklyMacros = [
  { day: 'Pzt', protein: 95, carbs: 230, fat: 62 },
  { day: 'Sal', protein: 85, carbs: 200, fat: 55 },
  { day: 'Çar', protein: 110, carbs: 260, fat: 70 },
  { day: 'Per', protein: 88, carbs: 195, fat: 58 },
  { day: 'Cum', protein: 100, carbs: 240, fat: 65 },
  { day: 'Cmt', protein: 75, carbs: 280, fat: 80 },
  { day: 'Paz', protein: 92, carbs: 210, fat: 58 },
]

export default function MacroTrackingScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Makro Takibi (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Total calories from macros */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16, alignItems: 'center' }} /* TODO: bg-white */>
          <Text style={{ fontSize: 14, color: '#5A7264' }}>Makrolardan Kalori</Text>
          <Text style={{ fontSize: 30, fontWeight: '800', color: '#1A2E23', marginTop: 4 }}>{totalCal} kcal</Text>
          <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>Hedef: {targetCal} kcal</Text>
        </View>

        {/* Macro donut (simplified with bars) */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 16 }}>Bugün</Text>

          {/* Distribution bar */}
          <View style={{ height: 16, backgroundColor: '#E8F0EC', borderRadius: 9999, overflow: 'hidden', flexDirection: 'row', marginBottom: 16 }}>
            {macros.map((m, i) => (
              <View
                key={i}
                style={{
                  height: '100%',
                  width: `${(m.calories / totalCal) * 100}%`,
                  backgroundColor: m.color,
                }}
              />
            ))}
          </View>

          {/* Legend */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {macros.map((m, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <View style={{ width: 12, height: 12, borderRadius: 9999, marginBottom: 4, backgroundColor: m.color }} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#1A2E23' }}>{m.name}</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>
                  {Math.round((m.calories / totalCal) * 100)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Individual macro progress */}
        {macros.map((m, i) => {
          const pct = Math.min((m.current / m.target) * 100, 100)
          return (
            <View key={i} style={{ borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 12, height: 12, borderRadius: 9999, marginRight: 8, backgroundColor: m.color }} />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{m.name}</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: m.color }}>
                  {m.current}g / {m.target}g
                </Text>
              </View>
              <View style={{ height: 12, backgroundColor: '#E8F0EC', borderRadius: 9999, overflow: 'hidden' }}>
                <View
                  style={{ height: '100%', borderRadius: 9999, width: `${pct}%`, backgroundColor: m.color }}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>%{Math.round(pct)}</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>{m.calories} kcal</Text>
              </View>
            </View>
          )
        })}

        {/* Weekly table */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 32, marginTop: 8 }} /* TODO: bg-white */>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Haftalık Özet</Text>
          {/* Header */}
          <View style={{ flexDirection: 'row', paddingBottom: 8, marginBottom: 8, borderBottomWidth: 1, borderColor: '#E8F0EC' }}>
            <Text style={{ flex: 1, fontSize: 12, fontWeight: '700', color: '#5A7264' }}>Gün</Text>
            <Text style={{ width: 64, fontSize: 12, fontWeight: '700', textAlign: 'center', color: '#C75B4A' }}>P</Text>
            <Text style={{ width: 64, fontSize: 12, fontWeight: '700', textAlign: 'center', color: '#4A7FB5' }}>K</Text>
            <Text style={{ width: 64, fontSize: 12, fontWeight: '700', textAlign: 'center', color: '#D4A843' }}>Y</Text>
          </View>
          {weeklyMacros.map((w, i) => (
            <View key={i} style={{ flexDirection: 'row', paddingVertical: 6 }}>
              <Text style={{ flex: 1, fontSize: 14, color: '#1A2E23', fontWeight: '600' }}>{w.day}</Text>
              <Text style={{ width: 64, fontSize: 14, textAlign: 'center', color: '#1A2E23' }}>{w.protein}g</Text>
              <Text style={{ width: 64, fontSize: 14, textAlign: 'center', color: '#1A2E23' }}>{w.carbs}g</Text>
              <Text style={{ width: 64, fontSize: 14, textAlign: 'center', color: '#1A2E23' }}>{w.fat}g</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}
