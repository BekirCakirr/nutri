import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

const mockItems = [
  { id: '1', name: 'Tavuk Göğsü (Izgara)', portion: 150, unit: 'g', calories: 165 },
  { id: '2', name: 'Pilav', portion: 200, unit: 'g', calories: 206 },
  { id: '3', name: 'Yeşil Salata', portion: 1, unit: 'kase', calories: 20 },
]

export default function AdjustPortionsScreen() {
  const navigation = useNavigation()
  const [items, setItems] = useState(mockItems)

  const adjustPortion = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const newPortion = Math.max(item.unit === 'g' ? 25 : 0.5, item.portion + delta)
        const ratio = newPortion / item.portion
        return { ...item, portion: newPortion, calories: Math.round(item.calories * ratio) }
      })
    )
  }

  const totalCal = items.reduce((s, i) => s + i.calories, 0)

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Porsiyon Ayarla" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: '#E8F5EC', borderRadius: 16, padding: 16, marginBottom: 24, alignItems: 'center', borderWidth: 1, borderColor: '#C8E6CF66' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#5A7264' }}>Toplam</Text>
          <Text style={{ fontSize: 36, fontWeight: '800', color: '#1A5C37' }}>{totalCal}</Text>
          <Text style={{ fontSize: 14, color: '#5A7264' }}>kcal</Text>
        </View>

        {items.map((item) => {
          const step = item.unit === 'g' ? 25 : 0.5
          return (
            <View key={item.id} style={{ borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E8F0EC' , backgroundColor: '#FFFFFF' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23', flex: 1 }}>{item.name}</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A5C37' }}>{item.calories} kcal</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                <TouchableOpacity
                  onPress={() => adjustPortion(item.id, -step)}
                  style={{ width: 44, height: 44, borderRadius: 9999, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="remove" size={22} color="#EF4444" />
                </TouchableOpacity>
                <View style={{ backgroundColor: '#F0F5F2', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 8, alignItems: 'center' , minWidth: 100 }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A2E23' }}>
                    {item.portion}{item.unit}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => adjustPortion(item.id, step)}
                  style={{ width: 44, height: 44, borderRadius: 9999, backgroundColor: '#E8F5EC', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="add" size={22} color="#1A5C37" />
                </TouchableOpacity>
              </View>
            </View>
          )
        })}

        <TouchableOpacity
          style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 32, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>Onayla ve Kaydet ✅</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
