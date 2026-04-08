import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const dailyTarget = 2200

const mockCalorieData = [
  { date: '17 Mar', day: 'Pzt', consumed: 1680, burned: 280 },
  { date: '16 Mar', day: 'Paz', consumed: 2100, burned: 150 },
  { date: '15 Mar', day: 'Cmt', consumed: 2450, burned: 320 },
  { date: '14 Mar', day: 'Cum', consumed: 1920, burned: 210 },
  { date: '13 Mar', day: 'Per', consumed: 1850, burned: 180 },
  { date: '12 Mar', day: 'Çar', consumed: 2050, burned: 350 },
  { date: '11 Mar', day: 'Sal', consumed: 1750, burned: 200 },
  { date: '10 Mar', day: 'Pzt', consumed: 2300, burned: 280 },
  { date: '9 Mar', day: 'Paz', consumed: 1600, burned: 100 },
  { date: '8 Mar', day: 'Cmt', consumed: 2650, burned: 400 },
]

type Period = '7 Gün' | '30 Gün'

export default function CalorieHistoryScreen() {
  const navigation = useNavigation<Nav>()
  const [period, setPeriod] = useState<Period>('7 Gün')

  const data = period === '7 Gün' ? mockCalorieData.slice(0, 7) : mockCalorieData
  const avgConsumed = Math.round(data.reduce((s, d) => s + d.consumed, 0) / data.length)
  const avgBurned = Math.round(data.reduce((s, d) => s + d.burned, 0) / data.length)
  const maxCal = Math.max(...data.map(d => d.consumed))

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Kalori Geçmişi (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Period selector */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
          {(['7 Gün', '30 Gün'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={{ flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center', borderWidth: 1, backgroundColor: period === p ? '#1A5C37' : '#FFFFFF',
                borderColor: period === p ? '#1A5C37' : '#E8F0EC', }}
              activeOpacity={0.7}
              onPress={() => setPeriod(p)}
            >
              <Text
                style={{ fontSize: 14, fontWeight: '600', color: period === p ? '#FFFFFF' : '#5A7264' }}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Average stats */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 12 }}>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Ionicons name="flame-outline" size={22} color="#E8A040" />
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A2E23', marginTop: 4 }}>{avgConsumed}</Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>Ort. alım (kcal)</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Ionicons name="flash-outline" size={22} color="#C75B4A" />
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A2E23', marginTop: 4 }}>{avgBurned}</Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>Ort. yakım (kcal)</Text>
          </View>
        </View>

        {/* Bar chart */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 16 }}>Kalori Alımı</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 112 }}>
            {data.slice(0, 7).map((d, i) => {
              const pct = (d.consumed / maxCal) * 100
              const overTarget = d.consumed > dailyTarget
              return (
                <View key={i} style={{ alignItems: 'center', flex: 1, marginHorizontal: 2 }}>
                  <Text style={{ fontSize: 9, color: '#5A7264', marginBottom: 4 }}>{d.consumed}</Text>
                  <View
                    style={{
                      width: 20, borderTopLeftRadius: 8, borderTopRightRadius: 8,
                      height: `${pct}%`,
                      backgroundColor: overTarget ? '#EF4444' : '#E8A040',
                    }}
                  />
                  <Text style={{ fontSize: 10, color: '#5A7264', marginTop: 4, fontWeight: '600' }}>{d.day}</Text>
                </View>
              )
            })}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <View style={{ flex: 1, backgroundColor: '#1A5C374d' }} /* TODO: h-px *//>
            <Text style={{ fontSize: 10, color: '#1A5C37', marginHorizontal: 8 }}>Hedef: {dailyTarget} kcal</Text>
            <View style={{ flex: 1, backgroundColor: '#1A5C374d' }} /* TODO: h-px *//>
          </View>
        </View>

        {/* Daily list */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Günlük Kayıtlar</Text>
        {data.map((d, i) => {
          const net = d.consumed - d.burned
          const overTarget = d.consumed > dailyTarget
          return (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
              <View
                style={{ width: 36, height: 36, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: overTarget ? '#FEE2E2' : '#E8F5EC' }}
              >
                <Ionicons name="flame-outline" size={16} color={overTarget ? '#EF4444' : '#1A5C37'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23' }}>{d.date} ({d.day})</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>
                  Alım: {d.consumed} · Yakım: {d.burned} · Net: {net}
                </Text>
              </View>
              <Text
                style={{ fontSize: 14, fontWeight: '700', color: overTarget ? '#EF4444' : '#1A5C37' }}
              >
                {d.consumed}
              </Text>
            </View>
          )
        })}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
