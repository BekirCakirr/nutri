import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { getWaterHistory, addWaterEntry } from '../../services/api/tracking'

type Nav = StackNavigationProp<ProgressStackParamList>

const DAILY_GOAL = 2500 // ml
const GLASS_SIZE = 250 // ml

const quickOptions = [
  { label: '1 Bardak', amount: 250, icon: 'water-outline' as const },
  { label: 'Şişe', amount: 500, icon: 'water' as const },
  { label: 'Büyük Şişe', amount: 750, icon: 'water' as const },
  { label: 'Özel', amount: 200, icon: 'add-outline' as const },
]

interface WaterLog { time: string; amount: number }

export default function WaterScreen() {
  const navigation = useNavigation<Nav>()
  const [consumed, setConsumed] = useState(0)
  const [logs, setLogs] = useState<WaterLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const history = await getWaterHistory()
        const todayTotal = history.length > 0 ? history[history.length - 1].value : 0
        setConsumed(todayTotal)
      } catch { /* ignore */ }
      finally { setIsLoading(false) }
    })()
  }, [])

  const pct = Math.min((consumed / DAILY_GOAL) * 100, 100)
  const glasses = Math.floor(consumed / GLASS_SIZE)

  const addWater = async (amount: number) => {
    if (amount <= 0) return
    setConsumed(prev => Math.min(prev + amount, 5000))
    setLogs(prev => [{ time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }), amount }, ...prev])
    try {
      await addWaterEntry(new Date().toISOString().split('T')[0], amount)
    } catch { /* best-effort */ }
  }

  if (isLoading) {
    return (
      <ScreenWrapper padded={false}>
        <AppHeader title="Su Takibi" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#4A90B8" />
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Su Takibi" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Main progress card */}
        <View style={{ borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16, alignItems: 'center' }} /* TODO: bg-white */>
          <View style={{ width: 160, height: 160, borderRadius: 9999, borderColor: '#E4F0F7', alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative' }} /* TODO: border-[8px] */>
            <View
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 9999, borderColor: '#4A90B8', borderTopColor: pct >= 25 ? '#4A90B8' : '#E4F0F7',
                borderRightColor: pct >= 50 ? '#4A90B8' : '#E4F0F7',
                borderBottomColor: pct >= 75 ? '#4A90B8' : '#E4F0F7',
                borderLeftColor: pct >= 100 ? '#4A90B8' : '#E4F0F7', }} /* TODO: border-[8px] */
            />
            <Ionicons name="water" size={28} color="#4A90B8" />
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#1A2E23', marginTop: 4 }}>
              {(consumed / 1000).toFixed(1)}L
            </Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>/ {(DAILY_GOAL / 1000).toFixed(1)}L</Text>
          </View>

          <View style={{ height: 12, backgroundColor: '#E4F0F7', borderRadius: 9999, overflow: 'hidden' }} /* TODO: w-full */>
            <View style={{ height: '100%', backgroundColor: '#4A90B8', borderRadius: 9999, width: `${pct}%` }} />
          </View>
          <Text style={{ fontSize: 14, color: '#5A7264', marginTop: 8 }}>
            %{Math.round(pct)} tamamlandı · {glasses} bardak
          </Text>
        </View>

        {/* Quick add buttons */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Hızlı Ekle</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
          {quickOptions.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={{ width: '48%', marginBottom: 10, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E8F0EC', flexDirection: 'row', alignItems: 'center' }} /* TODO: mx-[1%] bg-white */activeOpacity={0.7}
              onPress={() => addWater(opt.amount)}
            >
              <View style={{ width: 36, height: 36, borderRadius: 9999, backgroundColor: '#E4F0F7', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Ionicons name={opt.icon} size={18} color="#4A90B8" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23' }}>{opt.label}</Text>
                {opt.amount > 0 && (
                  <Text style={{ fontSize: 12, color: '#5A7264' }}>{opt.amount} ml</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's log */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Bugünün Kayıtları</Text>
        {logs.length === 0 ? (
          <View style={{ borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center', marginBottom: 16 }} /* TODO: bg-white */>
            <Text style={{ fontSize: 14, color: '#5A7264' }}>Henüz kayıt yok. Yukarıdan su ekleyin!</Text>
          </View>
        ) : (
          logs.map((entry, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
              <View style={{ width: 36, height: 36, borderRadius: 9999, backgroundColor: '#E4F0F7', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Ionicons name="water-outline" size={16} color="#4A90B8" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23' }}>{entry.amount} ml</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>{entry.time}</Text>
              </View>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>{entry.amount >= 500 ? '🫗' : '🥤'}</Text>
            </View>
          ))
        )}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
