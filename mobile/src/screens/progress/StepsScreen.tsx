import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const DAILY_GOAL = 10000

const mockStepsData = [
  { date: '17 Mar', day: 'Pzt', steps: 6420 },
  { date: '16 Mar', day: 'Paz', steps: 8350 },
  { date: '15 Mar', day: 'Cmt', steps: 12100 },
  { date: '14 Mar', day: 'Cum', steps: 7800 },
  { date: '13 Mar', day: 'Per', steps: 5400 },
  { date: '12 Mar', day: 'Çar', steps: 9200 },
  { date: '11 Mar', day: 'Sal', steps: 10500 },
]

export default function StepsScreen() {
  const navigation = useNavigation<Nav>()
  const today = mockStepsData[0]
  const pct = Math.min((today.steps / DAILY_GOAL) * 100, 100)
  const avgSteps = Math.round(mockStepsData.reduce((s, d) => s + d.steps, 0) / mockStepsData.length)
  const maxSteps = Math.max(...mockStepsData.map(d => d.steps))
  const distance = (today.steps * 0.0008).toFixed(1) // ~0.8m per step
  const calories = Math.round(today.steps * 0.04) // ~0.04 kcal per step

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Adım Sayıcı (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Main progress */}
        <View style={{ borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16, alignItems: 'center' }} /* TODO: bg-white */>
          {/* Circular progress (simplified) */}
          <View style={{ width: 160, height: 160, borderRadius: 9999, borderColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }} /* TODO: border-[8px] */>
            <Ionicons name="footsteps-outline" size={28} color="#8B6BAA" />
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#1A2E23', marginTop: 4 }}>
              {today.steps.toLocaleString('tr-TR')}
            </Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>/ {DAILY_GOAL.toLocaleString('tr-TR')}</Text>
          </View>

          {/* Progress bar */}
          <View style={{ height: 12, backgroundColor: '#F3E8FF', borderRadius: 9999, overflow: 'hidden' }} /* TODO: w-full */>
            <View
              style={{ height: '100%', backgroundColor: '#8B6BAA', borderRadius: 9999, width: `${pct}%` }}
            />
          </View>
          <Text style={{ fontSize: 14, color: '#5A7264', marginTop: 8 }}>%{Math.round(pct)} tamamlandı</Text>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
          <View style={{ flex: 1, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Ionicons name="navigate-outline" size={18} color="#8B6BAA" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23', marginTop: 4 }}>{distance} km</Text>
            <Text style={{ fontSize: 10, color: '#5A7264' }}>Mesafe</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Ionicons name="flame-outline" size={18} color="#E8A040" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23', marginTop: 4 }}>{calories}</Text>
            <Text style={{ fontSize: 10, color: '#5A7264' }}>kcal</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Ionicons name="stats-chart-outline" size={18} color="#1A5C37" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23', marginTop: 4 }}>{avgSteps.toLocaleString('tr-TR')}</Text>
            <Text style={{ fontSize: 10, color: '#5A7264' }}>Ort.</Text>
          </View>
        </View>

        {/* Weekly chart */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 16 }}>Haftalık</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 112 }}>
            {mockStepsData.map((d, i) => {
              const barPct = (d.steps / maxSteps) * 100
              const reachedGoal = d.steps >= DAILY_GOAL
              return (
                <View key={i} style={{ alignItems: 'center', flex: 1, marginHorizontal: 2 }}>
                  <Text style={{ fontSize: 9, color: '#5A7264', marginBottom: 4 }}>
                    {(d.steps / 1000).toFixed(1)}k
                  </Text>
                  <View
                    style={{
                      width: 20, borderTopLeftRadius: 8, borderTopRightRadius: 8,
                      height: `${barPct}%`,
                      backgroundColor: reachedGoal ? '#8B6BAA' : '#D4E2DA',
                    }}
                  />
                  <Text style={{ fontSize: 10, color: '#5A7264', marginTop: 4, fontWeight: '600' }}>{d.day}</Text>
                </View>
              )
            })}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <View style={{ flex: 1, backgroundColor: '#8B6BAA4d' }} /* TODO: h-px *//>
            <Text style={{ fontSize: 10, color: '#8B6BAA', marginHorizontal: 8 }}>Hedef: {(DAILY_GOAL / 1000)}k</Text>
            <View style={{ flex: 1, backgroundColor: '#8B6BAA4d' }} /* TODO: h-px *//>
          </View>
        </View>

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
