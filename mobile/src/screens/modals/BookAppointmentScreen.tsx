import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
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
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Appointment type */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Görüşme Türü</Text>
        {appointmentTypes.map((t) => (
          <TouchableOpacity
            key={t.id}
            className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border-2"
            style={{ borderColor: selectedType === t.id ? '#1A5C37' : '#E8F0EC' }}
            activeOpacity={0.7}
            onPress={() => setSelectedType(t.id)}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: selectedType === t.id ? '#E8F5EC' : '#F8FAF9' }}
            >
              <Ionicons name={t.icon} size={20} color={selectedType === t.id ? '#1A5C37' : '#5A7264'} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#1A2E23]">{t.title}</Text>
              <Text className="text-xs text-[#5A7264]">{t.desc}</Text>
            </View>
            <Text className="text-base font-bold text-[#1A5C37]">{t.price}</Text>
          </TouchableOpacity>
        ))}

        {/* Date selection */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3 mt-4">Tarih Seçin</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {availableDays.map((d, i) => (
            <TouchableOpacity
              key={i}
              className="items-center mr-2.5 rounded-xl py-3 px-4 border"
              style={{
                backgroundColor: !d.available ? '#F0F0F0' : selectedDay === i ? '#1A5C37' : '#FFFFFF',
                borderColor: selectedDay === i ? '#1A5C37' : '#E8F0EC',
                opacity: d.available ? 1 : 0.4,
              }}
              activeOpacity={0.7}
              disabled={!d.available}
              onPress={() => setSelectedDay(i)}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: selectedDay === i ? '#FFFFFF' : '#5A7264' }}
              >
                {d.day}
              </Text>
              <Text
                className="text-sm font-bold mt-0.5"
                style={{ color: selectedDay === i ? '#FFFFFF' : '#1A2E23' }}
              >
                {d.date.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time slots */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Saat Seçin</Text>
        <View className="flex-row flex-wrap mb-4">
          {timeSlots.map((time, i) => (
            <TouchableOpacity
              key={i}
              className="w-[30%] mx-[1.5%] mb-2.5 rounded-xl py-3 items-center border"
              style={{
                backgroundColor: selectedTime === i ? '#1A5C37' : '#FFFFFF',
                borderColor: selectedTime === i ? '#1A5C37' : '#E8F0EC',
              }}
              activeOpacity={0.7}
              onPress={() => setSelectedTime(i)}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: selectedTime === i ? '#FFFFFF' : '#1A2E23' }}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirm */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">Randevuyu Onayla</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
