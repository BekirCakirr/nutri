import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Notification = {
  id: string
  title: string
  message: string
  time: string
  type: 'alert' | 'success' | 'info' | 'reminder'
  read: boolean
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Su İçme Vakti', message: 'Uzun süredir su içmedin. Hedefine ulaşmak için 1 bardak su iç!', time: '10 dk önce', type: 'reminder', read: false },
  { id: '2', title: 'Hedefine Ulaştın! 🏆', message: 'Tebrikler! Dün 10.000 adım hedefini tamamladın.', time: '2 saat önce', type: 'success', read: false },
  { id: '3', title: 'Öğle Yemeği Kaydı', message: 'Öğle yemeğini kaydetmeyi unuttun mu?', time: '4 saat önce', type: 'reminder', read: true },
  { id: '4', title: 'Yeni Mesaj (Diyetisyen)', message: 'Dyt. Buse Hanım sana yeni bir mesaj gönderdi.', time: 'Dün, 14:30', type: 'info', read: true },
  { id: '5', title: 'Alerjen Uyarısı', message: 'Son taradığın üründe gluten tespit edildi!', time: 'Dün, 09:15', type: 'alert', read: true },
]

export default function NotificationsScreen() {
  const navigation = useNavigation()

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return 'warning'
      case 'success': return 'trophy'
      case 'info': return 'chatbubble-ellipses'
      case 'reminder': return 'water'
      default: return 'notifications'
    }
  }

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return 'text-red-500 bg-red-100'
      case 'success': return 'text-emerald-500 bg-emerald-100'
      case 'info': return 'text-blue-500 bg-blue-100'
      case 'reminder': return 'text-blue-400 bg-blue-50'
      default: return 'text-[#1A5C37] bg-emerald-50'
    }
  }

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Bildirimler"
        onBack={() => navigation.goBack()}
        rightIcon="checkmark-done-outline"
        onRightPress={() => {}}
      />
      
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="space-y-3 pb-8">
          {mockNotifications.map((noti) => (
             <TouchableOpacity 
               key={noti.id} 
               className={`flex-row p-4 rounded-2xl border ${noti.read ? 'bg-white border-[#E8F0EC]' : 'bg-[#E8F5EC] border-[#1A5C37]/20'} shadow-sm`}
               activeOpacity={0.7}
             >
                <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${getColor(noti.type).split(' ')[1]}`}>
                  <Ionicons name={getIcon(noti.type)} size={24} color={getTypeColor(noti.type)} />
                </View>
                
                <View className="flex-1">
                   <View className="flex-row items-start justify-between mb-1">
                      <Text className={`font-bold flex-1 pr-2 ${noti.read ? 'text-[#1A2E23]' : 'text-[#1A5C37]'}`}>
                        {noti.title}
                      </Text>
                      <Text className="text-[10px] text-[#A8BFB2]">{noti.time}</Text>
                   </View>
                   <Text className={`tracking-wide text-[13px] leading-5 ${noti.read ? 'text-[#5A7264]' : 'text-[#1A2E23] font-medium'}`}>
                     {noti.message}
                   </Text>
                </View>

                {!noti.read && (
                  <View className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#EF4444]" />
                )}
             </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

function getTypeColor(type: string) {
  switch (type) {
    case 'alert': return '#EF4444'
    case 'success': return '#10B981'
    case 'info': return '#3B82F6'
    case 'reminder': return '#60A5FA'
    default: return '#1A5C37'
  }
}
