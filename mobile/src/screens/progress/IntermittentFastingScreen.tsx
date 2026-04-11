import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type FastingPlan = { label: string; fast: number; eat: number }

const plans: FastingPlan[] = [
  { label: '16:8', fast: 16, eat: 8 },
  { label: '18:6', fast: 18, eat: 6 },
  { label: '20:4', fast: 20, eat: 4 },
  { label: '5:2', fast: 0, eat: 0 },
]

const mockHistory = [
  { date: '16 Mar', plan: '16:8', completed: true, duration: '16s 12dk' },
  { date: '15 Mar', plan: '16:8', completed: true, duration: '16s 45dk' },
  { date: '14 Mar', plan: '16:8', completed: false, duration: '14s 30dk' },
  { date: '13 Mar', plan: '18:6', completed: true, duration: '18s 05dk' },
  { date: '12 Mar', plan: '16:8', completed: true, duration: '16s 20dk' },
]

export default function IntermittentFastingScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedPlan, setSelectedPlan] = useState(0)
  const [isFasting, setIsFasting] = useState(false)
  const [elapsed, setElapsed] = useState(0) // seconds
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isFasting) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isFasting])

  const hours = Math.floor(elapsed / 3600)
  const mins = Math.floor((elapsed % 3600) / 60)
  const secs = elapsed % 60
  const plan = plans[selectedPlan]
  const targetSec = plan.fast * 3600
  const pct = targetSec > 0 ? Math.min((elapsed / targetSec) * 100, 100) : 0

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Aralıklı Oruç (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Plan selector */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
          {plans.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={{ flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, backgroundColor: selectedPlan === i ? '#1A5C37' : '#FFFFFF',
                borderColor: selectedPlan === i ? '#1A5C37' : '#E8F0EC', }}
              activeOpacity={0.7}
              onPress={() => { setSelectedPlan(i); setElapsed(0); setIsFasting(false) }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: '700', color: selectedPlan === i ? '#FFFFFF' : '#1A2E23' }}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Timer card */}
        <View style={{ backgroundColor: '#1A2E23', borderRadius: 16, padding: 24, marginBottom: 16, alignItems: 'center' }}>
          {/* Circular timer (simplified) */}
          <View style={{ width: 176, height: 176, borderRadius: 9999, borderColor: '#2D4A3A', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }} /* TODO: border-[8px] */>
            <Text style={{ fontSize: 30, fontWeight: '800', color: '#FFFFFF' }}>
              {String(hours).padStart(2, '0')}:{String(mins).padStart(2, '0')}
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
              :{String(secs).padStart(2, '0')}
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
              / {plan.fast} saat
            </Text>
          </View>

          {/* Progress bar */}
          <View style={{ height: 8, backgroundColor: '#2D4A3A', borderRadius: 9999, overflow: 'hidden', marginBottom: 16 }} /* TODO: w-full */>
            <View
              style={{ height: '100%', backgroundColor: '#4ECDC4', borderRadius: 9999, width: `${pct}%` }}
            />
          </View>

          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
            {isFasting ? `Oruç devam ediyor (%${Math.round(pct)})` : 'Başlamak için butona bas'}
          </Text>

          <TouchableOpacity
            style={{ borderRadius: 9999, paddingHorizontal: 32, paddingVertical: 14, backgroundColor: isFasting ? '#EF4444' : '#4ECDC4' }}
            activeOpacity={0.8}
            onPress={() => {
              if (isFasting) { setIsFasting(false); setElapsed(0) }
              else setIsFasting(true)
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
              {isFasting ? '⏹ Orucu Bitir' : '▶ Orucu Başlat'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info card */}
        <View style={{ backgroundColor: '#E8F5EC', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#C8E6CF66' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="information-circle-outline" size={18} color="#1A5C37" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A5C37', marginLeft: 4 }}>{plan.label} Planı</Text>
          </View>
          <Text style={{ fontSize: 12, color: '#5A7264' }}>
            {plan.fast > 0 ? `${plan.fast} saat oruç, ${plan.eat} saat yeme penceresi.` : 'Haftada 5 gün normal ye, 2 gün düşük kalori.'}
          </Text>
        </View>

        {/* History */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Geçmiş</Text>
        {mockHistory.map((h, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC' , backgroundColor: '#FFFFFF' }}>
            <View
              style={{ width: 36, height: 36, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: h.completed ? '#E8F5EC' : '#FEE2E2' }}
            >
              <Ionicons
                name={h.completed ? 'checkmark' : 'close'}
                size={18}
                color={h.completed ? '#1A5C37' : '#EF4444'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{h.plan}</Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>{h.date} · {h.duration}</Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: '700', color: h.completed ? '#1A5C37' : '#EF4444' }}>
              {h.completed ? 'Tamamlandı' : 'Yarım kaldı'}
            </Text>
          </View>
        ))}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
