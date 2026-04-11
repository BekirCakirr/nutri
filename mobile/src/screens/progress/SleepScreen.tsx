import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { getSleepHistory } from '../../services/api/tracking'

type Nav = StackNavigationProp<ProgressStackParamList>

interface SleepPoint {
  date: string
  duration: number
  quality: number
  bedTime: string
  wakeTime: string
}

function qualityColor(q: number) {
  if (q >= 85) return '#1A5C37'
  if (q >= 70) return '#E8A040'
  return '#EF4444'
}

function qualityLabel(q: number) {
  if (q >= 85) return 'Mükemmel'
  if (q >= 70) return 'İyi'
  if (q >= 50) return 'Orta'
  return 'Düşük'
}

const qualityToPercent: Record<string, number> = {
  excellent: 95, good: 80, fair: 65, poor: 40,
}

export default function SleepScreen() {
  const navigation = useNavigation<Nav>()
  const [sleepData, setSleepData] = useState<SleepPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const history = await getSleepHistory()
        const mapped: SleepPoint[] = history.slice(-7).map(s => {
          return {
            date: s.date,
            duration: s.hours > 0 ? s.hours : 7.5,
            quality: typeof s.quality === 'number' ? s.quality * 20 : 80,
            bedTime: '23:00',
            wakeTime: s.hours > 0 ? `${String(Math.floor(23 + s.hours) % 24).padStart(2, '0')}:00` : '07:00',
          }
        })
        setSleepData(mapped.length > 0 ? mapped : defaultData)
      } catch {
        setSleepData(defaultData)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (isLoading) {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <AppHeader title="Uyku Takibi" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#4A7FB5" />
        </View>
      </ScreenWrapper>
    )
  }

  const latest = sleepData[sleepData.length - 1] ?? defaultData[0]
  const avgDuration = (sleepData.reduce((s, d) => s + d.duration, 0) / (sleepData.length || 1)).toFixed(1)
  const avgQuality = Math.round(sleepData.reduce((s, d) => s + d.quality, 0) / (sleepData.length || 1))

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Uyku Takibi" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Current sleep card */}
        <View style={{ backgroundColor: '#1A2E23', borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Son Gece</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 }}>
            <Text style={{ fontSize: 36, fontWeight: '800', color: '#FFFFFF' }}>{latest.duration.toFixed(1)}</Text>
            <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', marginLeft: 4, marginBottom: 4 }}>saat</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="moon-outline" size={14} color="rgba(255,255,255,0.6)" />
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginLeft: 4 }}>{latest.bedTime}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="sunny-outline" size={14} color="rgba(255,255,255,0.6)" />
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginLeft: 4 }}>{latest.wakeTime}</Text>
            </View>
            <View
              style={{ borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: qualityColor(latest.quality) + '30' }} /* TODO: ml-auto */
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: qualityColor(latest.quality) === '#1A5C37' ? '#4ECDC4' : qualityColor(latest.quality) }}>
                %{latest.quality} {qualityLabel(latest.quality)}
              </Text>
            </View>
          </View>
        </View>

        {/* Average stats */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', marginRight: 8, alignItems: 'center' , backgroundColor: '#FFFFFF' }}>
            <Ionicons name="time-outline" size={22} color="#4A7FB5" />
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A2E23', marginTop: 4 }}>{avgDuration}</Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>Ort. süre (saat)</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', marginLeft: 8, alignItems: 'center' , backgroundColor: '#FFFFFF' }}>
            <Ionicons name="star-outline" size={22} color="#E8A040" />
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A2E23', marginTop: 4 }}>%{avgQuality}</Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>Ort. kalite</Text>
          </View>
        </View>

        {/* Sleep history */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Haftalık Geçmiş</Text>
        {sleepData.map((d, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC' , backgroundColor: '#FFFFFF' }}>
            <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Ionicons name="moon-outline" size={18} color="#4A7FB5" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{d.duration.toFixed(1)} saat</Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>{d.date} · {d.bedTime} → {d.wakeTime}</Text>
            </View>
            <View style={{ borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: qualityColor(d.quality) + '20' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: qualityColor(d.quality) }}>
                %{d.quality}
              </Text>
            </View>
          </View>
        ))}

        {/* Add button */}
        <TouchableOpacity
          style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 32, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>+ Uyku Kaydı Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const defaultData: SleepPoint[] = [
  { date: '16 Mar', duration: 7.5, quality: 88, bedTime: '23:15', wakeTime: '06:45' },
  { date: '15 Mar', duration: 6.8, quality: 72, bedTime: '00:30', wakeTime: '07:18' },
  { date: '14 Mar', duration: 8.0, quality: 92, bedTime: '22:45', wakeTime: '06:45' },
]
