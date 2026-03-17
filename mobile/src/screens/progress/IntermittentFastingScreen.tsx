import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
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
    <ScreenWrapper padded={false}>
      <AppHeader title="Aralıklı Oruç" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Plan selector */}
        <View className="flex-row mb-4 gap-2">
          {plans.map((p, i) => (
            <TouchableOpacity
              key={i}
              className="flex-1 rounded-xl py-3 items-center border"
              style={{
                backgroundColor: selectedPlan === i ? '#1A5C37' : '#FFFFFF',
                borderColor: selectedPlan === i ? '#1A5C37' : '#E8F0EC',
              }}
              activeOpacity={0.7}
              onPress={() => { setSelectedPlan(i); setElapsed(0); setIsFasting(false) }}
            >
              <Text
                className="text-base font-bold"
                style={{ color: selectedPlan === i ? '#FFFFFF' : '#1A2E23' }}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Timer card */}
        <View className="bg-[#1A2E23] rounded-2xl p-6 mb-4 items-center">
          {/* Circular timer (simplified) */}
          <View className="w-44 h-44 rounded-full border-[8px] border-[#2D4A3A] items-center justify-center mb-4">
            <Text className="text-3xl font-extrabold text-white">
              {String(hours).padStart(2, '0')}:{String(mins).padStart(2, '0')}
            </Text>
            <Text className="text-sm text-white/50">
              :{String(secs).padStart(2, '0')}
            </Text>
            <Text className="text-xs text-white/40 mt-1">
              / {plan.fast} saat
            </Text>
          </View>

          {/* Progress bar */}
          <View className="w-full h-2 bg-[#2D4A3A] rounded-full overflow-hidden mb-4">
            <View
              className="h-full bg-[#4ECDC4] rounded-full"
              style={{ width: `${pct}%` }}
            />
          </View>

          <Text className="text-sm text-white/60 mb-4">
            {isFasting ? `Oruç devam ediyor (%${Math.round(pct)})` : 'Başlamak için butona bas'}
          </Text>

          <TouchableOpacity
            className="rounded-full px-8 py-3.5"
            style={{ backgroundColor: isFasting ? '#EF4444' : '#4ECDC4' }}
            activeOpacity={0.8}
            onPress={() => {
              if (isFasting) { setIsFasting(false); setElapsed(0) }
              else setIsFasting(true)
            }}
          >
            <Text className="text-base font-bold text-white">
              {isFasting ? '⏹ Orucu Bitir' : '▶ Orucu Başlat'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info card */}
        <View className="bg-[#E8F5EC] rounded-2xl p-4 mb-4 border border-[#C8E6CF]/40">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle-outline" size={18} color="#1A5C37" />
            <Text className="text-sm font-bold text-[#1A5C37] ml-1">{plan.label} Planı</Text>
          </View>
          <Text className="text-xs text-[#5A7264]">
            {plan.fast > 0 ? `${plan.fast} saat oruç, ${plan.eat} saat yeme penceresi.` : 'Haftada 5 gün normal ye, 2 gün düşük kalori.'}
          </Text>
        </View>

        {/* History */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Geçmiş</Text>
        {mockHistory.map((h, i) => (
          <View key={i} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2 border border-[#E8F0EC]">
            <View
              className="w-9 h-9 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: h.completed ? '#E8F5EC' : '#FEE2E2' }}
            >
              <Ionicons
                name={h.completed ? 'checkmark' : 'close'}
                size={18}
                color={h.completed ? '#1A5C37' : '#EF4444'}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{h.plan}</Text>
              <Text className="text-xs text-[#5A7264]">{h.date} · {h.duration}</Text>
            </View>
            <Text className="text-xs font-bold" style={{ color: h.completed ? '#1A5C37' : '#EF4444' }}>
              {h.completed ? 'Tamamlandı' : 'Yarım kaldı'}
            </Text>
          </View>
        ))}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
