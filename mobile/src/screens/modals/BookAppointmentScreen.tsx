import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

const appointmentTypes = [
  { id: 'video', title: 'Video Görüşme', icon: 'videocam-outline' as const, price: '₺250', desc: '45 dakika online' },
  { id: 'audio', title: 'Sesli Görüşme', icon: 'call-outline' as const, price: '₺200', desc: '30 dakika telefon' },
  { id: 'chat', title: 'Mesaj Danışma', icon: 'chatbubble-outline' as const, price: '₺150', desc: 'Yazılı danışmanlık' },
]

const availableDays = [
  { date: '20 Mar', day: 'Per', available: true },
  { date: '21 Mar', day: 'Cum', available: true },
  { date: '22 Mar', day: 'Cmt', available: false },
  { date: '23 Mar', day: 'Paz', available: false },
  { date: '24 Mar', day: 'Pzt', available: true },
  { date: '25 Mar', day: 'Sal', available: true },
  { date: '26 Mar', day: 'Çar', available: true },
]

const timeSlots = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30']

export default function BookAppointmentScreen() {
  const navigation = useNavigation()
  const [selectedType, setSelectedType] = useState('video')
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedTime, setSelectedTime] = useState<number | null>(null)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Randevu Al" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Appointment type */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Görüşme Türü</Text>
        {appointmentTypes.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 2, borderColor: selectedType === t.id ? '#1A5C37' : '#E8F0EC' }} /* TODO: bg-white */
            activeOpacity={0.7}
            onPress={() => setSelectedType(t.id)}
          >
            <View
              style={{ width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: selectedType === t.id ? '#E8F5EC' : '#F8FAF9' }}
            >
              <Ionicons name={t.icon} size={20} color={selectedType === t.id ? '#1A5C37' : '#5A7264'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{t.title}</Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>{t.desc}</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A5C37' }}>{t.price}</Text>
          </TouchableOpacity>
        ))}

        {/* Date selection */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12, marginTop: 16 }}>Tarih Seçin</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {availableDays.map((d, i) => (
            <TouchableOpacity
              key={i}
              style={{ alignItems: 'center', marginRight: 10, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, backgroundColor: !d.available ? '#F0F0F0' : selectedDay === i ? '#1A5C37' : '#FFFFFF',
                borderColor: selectedDay === i ? '#1A5C37' : '#E8F0EC',
                opacity: d.available ? 1 : 0.4, }}
              activeOpacity={0.7}
              disabled={!d.available}
              onPress={() => setSelectedDay(i)}
            >
              <Text
                style={{ fontSize: 12, fontWeight: '600', color: selectedDay === i ? '#FFFFFF' : '#5A7264' }}
              >
                {d.day}
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: '700', marginTop: 2, color: selectedDay === i ? '#FFFFFF' : '#1A2E23' }}
              >
                {d.date.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time slots */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Saat Seçin</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
          {timeSlots.map((time, i) => (
            <TouchableOpacity
              key={i}
              style={{ width: '30%', marginBottom: 10, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, backgroundColor: selectedTime === i ? '#1A5C37' : '#FFFFFF',
                borderColor: selectedTime === i ? '#1A5C37' : '#E8F0EC', }} /* TODO: mx-[1.5%] */
              activeOpacity={0.7}
              onPress={() => setSelectedTime(i)}
            >
              <Text
                style={{ fontSize: 14, fontWeight: '600', color: selectedTime === i ? '#FFFFFF' : '#1A2E23' }}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirm */}
        <TouchableOpacity
          style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 32, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>Randevuyu Onayla</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
