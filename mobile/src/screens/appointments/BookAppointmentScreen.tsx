import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

const appointmentTypes = [
  { id: '1', title: 'İlk Görüşme', duration: '45 dk', icon: 'person-add-outline', color: '#4ECDC4' },
  { id: '2', title: 'Kontrol', duration: '30 dk', icon: 'sync-circle-outline', color: '#4A7FB5' },
  { id: '3', title: 'Takip Görüşmesi', duration: '15 dk', icon: 'calendar-outline', color: '#1A5C37' },
]

const availableDates = [
  { day: 'Pzt', date: '3', fullDate: '3 Mart 2026' },
  { day: 'Sal', date: '4', fullDate: '4 Mart 2026' },
  { day: 'Çar', date: '5', fullDate: '5 Mart 2026' },
  { day: 'Per', date: '6', fullDate: '6 Mart 2026' },
  { day: 'Cum', date: '7', fullDate: '7 Mart 2026' },
]

const availableTimes = ['09:00', '10:00', '11:30', '14:00', '15:30', '16:00']

export default function BookAppointmentScreen() {
  const navigation = useNavigation()
  const [selectedType, setSelectedType] = useState('2')
  const [selectedDate, setSelectedDate] = useState('4')
  const [selectedTime, setSelectedTime] = useState('14:00')
  const [isSuccess, setIsSuccess] = useState(false)

  if (isSuccess) {
    return (
      <ScreenWrapper padded={false} scrollable={false}>
        <View className="flex-1 bg-[#1A5C37] items-center justify-center px-6">
          <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center mb-6">
            <Ionicons name="checkmark-circle" size={64} color="#FFF" />
          </View>
          <Text className="text-3xl font-extrabold text-white mb-3 text-center">Randevu Onaylandı!</Text>
          <Text className="text-[#E8F5EC] text-center mb-10 text-base leading-relaxed">
            Dyt. Buse Hanım ile {availableDates.find(d => d.date === selectedDate)?.fullDate} saat {selectedTime} 
            için {appointmentTypes.find(t => t.id === selectedType)?.title} randevunuz oluşturuldu.
          </Text>
          
          <TouchableOpacity 
            className="w-full bg-white rounded-xl py-4 items-center"
            onPress={() => navigation.navigate('HomeTab' as never)}
          >
            <Text className="text-[#1A5C37] font-bold text-base">Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Randevu Al"
        subtitle="Dyt. Buse Hanım"
        onBack={() => navigation.goBack()}
      />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4">
        
        {/* Type Selection */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Görüşme Türü</Text>
        <View className="mb-6">
          {appointmentTypes.map((type) => (
            <TouchableOpacity 
              key={type.id}
              className={`flex-row items-center p-4 rounded-2xl mb-3 border ${selectedType === type.id ? 'bg-[#E8F5EC] border-[#1A5C37]' : 'bg-white border-[#E8F0EC]'}`}
              onPress={() => setSelectedType(type.id)}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: type.color + '20' }}>
                 <Ionicons name={type.icon as any} size={20} color={type.color} />
              </View>
              <View className="flex-1">
                 <Text className={`font-semibold text-base ${selectedType === type.id ? 'text-[#1A5C37]' : 'text-[#1A2E23]'}`}>
                   {type.title}
                 </Text>
                 <Text className="text-xs text-[#5A7264] mt-0.5">{type.duration} sürecektir</Text>
              </View>
              <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selectedType === type.id ? 'border-[#1A5C37]' : 'border-[#A8BFB2]'}`}>
                {selectedType === type.id && <View className="w-3 h-3 rounded-full bg-[#1A5C37]" />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Selection */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Tarih Seçin</Text>
        <View className="flex-row justify-between mb-8">
          {availableDates.map(date => (
            <TouchableOpacity
              key={date.date}
              className={`items-center justify-center w-[18%] aspect-[0.7] rounded-full border ${selectedDate === date.date ? 'bg-[#1A5C37] border-[#1A5C37]' : 'bg-white border-[#E8F0EC]'}`}
              onPress={() => setSelectedDate(date.date)}
            >
              <Text className={`text-xs mb-2 font-medium ${selectedDate === date.date ? 'text-white/80' : 'text-[#5A7264]'}`}>
                {date.day}
              </Text>
              <Text className={`text-xl font-bold ${selectedDate === date.date ? 'text-white' : 'text-[#1A2E23]'}`}>
                {date.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time Selection */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Saat Seçin</Text>
        <View className="flex-row flex-wrap justify-between mb-8">
          {availableTimes.map(time => (
             <TouchableOpacity
               key={time}
               className={`w-[31%] py-3 rounded-xl items-center border mb-3 ${selectedTime === time ? 'bg-[#1A5C37] border-[#1A5C37]' : 'bg-white border-[#E8F0EC]'}`}
               onPress={() => setSelectedTime(time)}
             >
               <Text className={`font-semibold ${selectedTime === time ? 'text-white' : 'text-[#1A2E23]'}`}>
                 {time}
               </Text>
             </TouchableOpacity>
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          className="w-full bg-[#1A5C37] rounded-xl py-4 items-center mb-8 shadow-sm shadow-[#1A5C37]/30"
          onPress={() => setIsSuccess(true)}
        >
          <Text className="text-white font-bold text-base">Randevuyu Onayla</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  )
}
