import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

type Goal = {
  id: string
  title: string
  target: string
  current: number
  total: number
  icon: keyof typeof Ionicons.glyphMap
  color: string
  deadline: string
}

const mockGoals: Goal[] = [
  { id: '1', title: 'Günde 10.000 adım at', target: '10.000 adım/gün', current: 18, total: 30, icon: 'footsteps-outline', color: '#8B6BAA', deadline: '31 Mar' },
  { id: '2', title: '3 kg ver', target: '74.5 → 71.5 kg', current: 1.2, total: 3, icon: 'trending-down-outline', color: '#1A5C37', deadline: '15 Nis' },
  { id: '3', title: 'Haftada 4 gün egzersiz', target: '4 gün/hafta', current: 3, total: 4, icon: 'barbell-outline', color: '#C75B4A', deadline: 'Bu hafta' },
  { id: '4', title: '30 gün şekersiz', target: '30 gün', current: 12, total: 30, icon: 'close-circle-outline', color: '#E8A040', deadline: '5 Nis' },
  { id: '5', title: 'Günde 2.5L su iç', target: '2.5 L/gün', current: 22, total: 30, icon: 'water-outline', color: '#4A90B8', deadline: '31 Mar' },
]

export default function CustomGoalsScreen() {
  const navigation = useNavigation<Nav>()

  const completed = mockGoals.filter(g => g.current >= g.total).length

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Özel Hedefler (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, borderRadius: 9999, backgroundColor: '#E8F5EC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Ionicons name="flag-outline" size={22} color="#1A5C37" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23' }}>{mockGoals.length} Aktif Hedef</Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>{completed} tamamlandı</Text>
            </View>
          </View>
        </View>

        {/* Goals list */}
        {mockGoals.map((goal) => {
          const pct = Math.min((goal.current / goal.total) * 100, 100)
          const isComplete = pct >= 100
          return (
            <View key={goal.id} style={{ borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View
                  style={{ width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: goal.color + '20' }}
                >
                  <Ionicons name={goal.icon} size={20} color={goal.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{goal.title}</Text>
                  <Text style={{ fontSize: 12, color: '#5A7264' }}>{goal.target}</Text>
                </View>
                {isComplete && (
                  <View style={{ backgroundColor: '#E8F5EC', borderRadius: 9999, padding: 6 }}>
                    <Ionicons name="checkmark" size={14} color="#1A5C37" />
                  </View>
                )}
              </View>
              {/* Progress */}
              <View style={{ backgroundColor: '#E8F0EC', borderRadius: 9999, overflow: 'hidden', marginBottom: 8 }} /* TODO: h-2.5 */>
                <View
                  style={{ height: '100%', borderRadius: 9999, width: `${pct}%`, backgroundColor: goal.color }}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>%{Math.round(pct)}</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>⏰ {goal.deadline}</Text>
              </View>
            </View>
          )
        })}

        {/* Add goal */}
        <TouchableOpacity
          style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 32, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>+ Yeni Hedef Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
