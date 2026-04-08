import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const mockHeartRateData = [
  { time: '08:00', bpm: 72 },
  { time: '09:30', bpm: 85 },
  { time: '11:00', bpm: 78 },
  { time: '12:30', bpm: 92 },
  { time: '14:00', bpm: 75 },
  { time: '15:30', bpm: 88 },
  { time: '17:00', bpm: 120 },
  { time: '18:30', bpm: 95 },
  { time: '20:00', bpm: 68 },
]

const restingHR = 65
const avgHR = Math.round(mockHeartRateData.reduce((s, d) => s + d.bpm, 0) / mockHeartRateData.length)
const maxHR = Math.max(...mockHeartRateData.map(d => d.bpm))
const minHR = Math.min(...mockHeartRateData.map(d => d.bpm))

function getZone(bpm: number) {
  if (bpm < 60) return { label: 'Düşük', color: '#4A7FB5' }
  if (bpm < 100) return { label: 'Normal', color: '#1A5C37' }
  if (bpm < 140) return { label: 'Orta', color: '#E8A040' }
  return { label: 'Yüksek', color: '#EF4444' }
}

const zones = [
  { label: 'Dinlenme', range: '< 60 bpm', color: '#4A7FB5', bg: '#DBEAFE' },
  { label: 'Normal', range: '60-100 bpm', color: '#1A5C37', bg: '#E8F5EC' },
  { label: 'Orta', range: '100-140 bpm', color: '#E8A040', bg: '#FEF3C7' },
  { label: 'Yoğun', range: '> 140 bpm', color: '#EF4444', bg: '#FEE2E2' },
]

export default function HeartRateScreen() {
  const navigation = useNavigation<Nav>()
  const latest = mockHeartRateData[mockHeartRateData.length - 1]
  const zone = getZone(latest.bpm)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Kalp Hızı (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Current heart rate */}
        <View style={{ borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16, alignItems: 'center' }} /* TODO: bg-white */>
          <View style={{ width: 80, height: 80, borderRadius: 9999, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Ionicons name="heart" size={36} color="#EF4444" />
          </View>
          <Text style={{ fontSize: 36, fontWeight: '800', color: '#1A2E23' }}>{latest.bpm}</Text>
          <Text style={{ fontSize: 14, color: '#5A7264' }}>bpm</Text>
          <View style={{ borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8, backgroundColor: zone.color + '20' }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: zone.color }}>{zone.label}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
          <View style={{ flex: 1, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>Dinlenme</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#4A7FB5', marginTop: 2 }}>{restingHR}</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>Ortalama</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23', marginTop: 2 }}>{avgHR}</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>Min / Max</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23', marginTop: 2 }}>{minHR}/{maxHR}</Text>
          </View>
        </View>

        {/* Heart rate zones */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Kalp Hızı Bölgeleri</Text>
          {zones.map((z, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#E8F0EC' }} /* TODO: last:border-b-0 */>
              <View style={{ width: 12, height: 12, borderRadius: 9999, marginRight: 12, backgroundColor: z.color }} />
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: '#1A2E23' }}>{z.label}</Text>
              <Text style={{ fontSize: 14, color: '#5A7264' }}>{z.range}</Text>
            </View>
          ))}
        </View>

        {/* Today's readings */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Bugünün Ölçümleri</Text>
        {[...mockHeartRateData].reverse().map((d, i) => {
          const z = getZone(d.bpm)
          return (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
              <View
                style={{ width: 36, height: 36, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: z.color + '20' }}
              >
                <Ionicons name="heart" size={16} color={z.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{d.bpm} bpm</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>{d.time}</Text>
              </View>
              <View style={{ borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: z.color + '20' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: z.color }}>{z.label}</Text>
              </View>
            </View>
          )
        })}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
