import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { getExerciseHistory } from '../../services/api/tracking'

type Nav = StackNavigationProp<ProgressStackParamList>

interface ExercisePoint {
  date: string
  name: string
  duration: number
  calories: number
  icon: keyof typeof Ionicons.glyphMap
}

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  walking: 'walk-outline', running: 'bicycle-outline', yoga: 'body-outline', other: 'barbell-outline',
}

export default function ExerciseScreen() {
  const navigation = useNavigation<Nav>()
  const [exercises, setExercises] = useState<ExercisePoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const history = await getExerciseHistory()
        const mapped: ExercisePoint[] = history.slice(-10).map(e => {
          const typ = e.type ?? 'other'
          return {
            date: e.date,
            name: typ.charAt(0).toUpperCase() + typ.slice(1),
            duration: e.minutes ?? 30,
            calories: e.caloriesBurned ?? 0,
            icon: iconMap[typ] ?? 'barbell-outline',
          }
        })
        setExercises(mapped.length > 0 ? mapped : defaultExercises)
      } catch {
        setExercises(defaultExercises)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (isLoading) {
    return (
      <ScreenWrapper padded={false}>
        <AppHeader title="Egzersiz Takibi" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#C75B4A" />
        </View>
      </ScreenWrapper>
    )
  }

  const totalMin = exercises.reduce((s, e) => s + e.duration, 0)
  const totalCal = exercises.reduce((s, e) => s + e.calories, 0)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Egzersiz Takibi" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Summary cards */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', marginRight: 8 }} /* TODO: bg-white */>
            <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Ionicons name="time-outline" size={20} color="#C75B4A" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#1A2E23' }}>{totalMin}</Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>dakika</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', marginLeft: 8 }} /* TODO: bg-white */>
            <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Ionicons name="flame-outline" size={20} color="#E8A040" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#1A2E23' }}>{totalCal}</Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>kcal yakıldı</Text>
          </View>
        </View>

        {/* Exercise list */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Egzersiz Geçmişi</Text>
        {exercises.map((ex, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
            <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Ionicons name={ex.icon} size={20} color="#C75B4A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{ex.name}</Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>{ex.date} · {ex.duration} dk</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#E8A040' }}>{ex.calories} kcal</Text>
            </View>
          </View>
        ))}

        {/* Add exercise */}
        <TouchableOpacity
          style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 32, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>+ Egzersiz Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const defaultExercises: ExercisePoint[] = [
  { date: 'Bugün', name: 'Yürüyüş', duration: 30, calories: 150, icon: 'walk-outline' },
  { date: 'Bugün', name: 'Yoga', duration: 45, calories: 120, icon: 'body-outline' },
]
