import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type Reminder = {
  id: string
  title: string
  time: string
  days: string
  icon: keyof typeof Ionicons.glyphMap
  enabled: boolean
  color: string
}

const mockReminders: Reminder[] = [
  { id: '1', title: 'Kahvaltı', time: '08:00', days: 'Her gün', icon: 'sunny-outline', enabled: true, color: '#E8A040' },
  { id: '2', title: 'Öğle Yemeği', time: '12:30', days: 'Hafta içi', icon: 'restaurant-outline', enabled: true, color: '#1A5C37' },
  { id: '3', title: 'Akşam Yemeği', time: '19:00', days: 'Her gün', icon: 'moon-outline', enabled: true, color: '#4A7FB5' },
  { id: '4', title: 'Su İç', time: 'Her saat', days: 'Her gün', icon: 'water-outline', enabled: true, color: '#4A90B8' },
  { id: '5', title: 'Kilo Kaydı', time: '07:30', days: 'Pazartesi', icon: 'scale-outline', enabled: false, color: '#8B6BAA' },
  { id: '6', title: 'Egzersiz', time: '17:30', days: 'Pzt, Çar, Cum', icon: 'barbell-outline', enabled: true, color: '#C75B4A' },
  { id: '7', title: 'Uyku', time: '22:30', days: 'Her gün', icon: 'bed-outline', enabled: false, color: '#5A7264' },
  { id: '8', title: 'Vitamin', time: '09:00', days: 'Her gün', icon: 'medical-outline', enabled: true, color: '#4ECDC4' },
]

export default function RemindersScreen() {
  const navigation = useNavigation<Nav>()
  const [reminders, setReminders] = useState(mockReminders)

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  const activeCount = reminders.filter(r => r.enabled).length

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Hatırlatıcılar" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View className="bg-white rounded-2xl p-4 mb-4 border border-[#E8F0EC] flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-[#FEF3C7] items-center justify-center mr-3">
            <Ionicons name="alarm" size={20} color="#E8A040" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-[#1A2E23]">{activeCount} Aktif Hatırlatıcı</Text>
            <Text className="text-xs text-[#5A7264]">{reminders.length} toplam</Text>
          </View>
        </View>

        {/* Reminders list */}
        {reminders.map((r) => (
          <View key={r.id} className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: r.color + '18' }}
            >
              <Ionicons name={r.icon} size={18} color={r.color} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{r.title}</Text>
              <Text className="text-xs text-[#5A7264]">{r.time} · {r.days}</Text>
            </View>
            <Switch
              value={r.enabled}
              onValueChange={() => toggleReminder(r.id)}
              trackColor={{ false: '#D4E2DA', true: '#1A5C37' }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}

        {/* Add reminder */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mt-4 mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">+ Yeni Hatırlatıcı Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
