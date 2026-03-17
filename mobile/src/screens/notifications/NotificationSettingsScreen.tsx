import React, { useState } from 'react'
import { View, Text, ScrollView, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function NotificationSettingsScreen() {
  const navigation = useNavigation()

  // Setting states
  const [pushEnabled, setPushEnabled] = useState(true)
  const [waterReminder, setWaterReminder] = useState(true)
  const [mealReminder, setMealReminder] = useState(true)
  const [workoutReminder, setWorkoutReminder] = useState(false)
  const [goalsUpdates, setGoalsUpdates] = useState(true)
  const [dietitianMessages, setDietitianMessages] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [marketingApp, setMarketingApp] = useState(false)

  const SettingToggle = ({ title, subtitle, value, onValueChange, icon, color }: any) => (
    <View className="flex-row items-center justify-between py-4 border-b border-[#E8F0EC]">
       <View className="flex-row items-center flex-1 pr-4">
          <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: color + '20' }}>
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <View className="flex-1">
             <Text className="font-semibold text-[#1A2E23] text-base mb-0.5">{title}</Text>
             <Text className="text-xs text-[#5A7264]">{subtitle}</Text>
          </View>
       </View>
       <Switch
         trackColor={{ false: '#E8F0EC', true: '#4ECDC4' }}
         thumbColor="#FFF"
         ios_backgroundColor="#E8F0EC"
         onValueChange={onValueChange}
         value={value}
       />
    </View>
  )

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Bildirim Ayarları"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Master Toggle */}
        <View className="bg-white rounded-2xl p-4 mb-6 border border-[#E8F0EC] shadow-sm">
           <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                 <Text className="font-bold text-lg text-[#1A2E23] mb-1">Anlık Bildirimler</Text>
                 <Text className="text-xs text-[#5A7264]">Tüm uygulama bildirimlerini (push) açıp kapatın.</Text>
              </View>
              <Switch
                trackColor={{ false: '#E8F0EC', true: '#1A5C37' }}
                thumbColor="#FFF"
                ios_backgroundColor="#E8F0EC"
                onValueChange={setPushEnabled}
                value={pushEnabled}
                style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
              />
           </View>
        </View>

        <View style={{ opacity: pushEnabled ? 1 : 0.5 }} pointerEvents={pushEnabled ? 'auto' : 'none'}>
          {/* Daily Reminders */}
          <Text className="text-[#1A2E23] font-bold text-[15px] uppercase tracking-wider mb-2 ml-1">Günlük Hatırlatıcılar</Text>
          <View className="bg-white rounded-2xl px-4 border border-[#E8F0EC] mb-6">
            <SettingToggle 
               title="Su Hatırlatıcıları" subtitle="Hedeflerine ulaşman için aralıklarla uyarır" 
               value={waterReminder} onValueChange={setWaterReminder} icon="water-outline" color="#4A7FB5" 
            />
            <SettingToggle 
               title="Öğün Kayıtları" subtitle="Öğün saatleri yaklaştığında uyarır" 
               value={mealReminder} onValueChange={setMealReminder} icon="restaurant-outline" color="#E8A040" 
            />
            <SettingToggle 
               title="Egzersizler" subtitle="Aktivite hedefleri için motivasyon uyarıları" 
               value={workoutReminder} onValueChange={setWorkoutReminder} icon="barbell-outline" color="#8B6BAA" 
            />
          </View>

          {/* Social & Expert */}
          <Text className="text-[#1A2E23] font-bold text-[15px] uppercase tracking-wider mb-2 ml-1">Sosyal & Uzman</Text>
          <View className="bg-white rounded-2xl px-4 border border-[#E8F0EC] mb-6">
            <SettingToggle 
               title="Diyetisyen Mesajları" subtitle="Bağlı olduğun uzmandan gelen mesajlar" 
               value={dietitianMessages} onValueChange={setDietitianMessages} icon="chatbubbles-outline" color="#1A5C37" 
            />
            <SettingToggle 
               title="Grup/Aile Güncellemeleri" subtitle="Aile üyelerinin başarı ve durumları" 
               value={goalsUpdates} onValueChange={setGoalsUpdates} icon="people-outline" color="#4ECDC4" 
            />
          </View>

          {/* System & Marketing */}
          <Text className="text-[#1A2E23] font-bold text-[15px] uppercase tracking-wider mb-2 ml-1">Sistem</Text>
          <View className="bg-white rounded-2xl px-4 border border-[#E8F0EC] mb-8">
            <SettingToggle 
               title="Haftalık Raporlar" subtitle="Hafta sonu gelişimi özetleyen özet" 
               value={weeklyReport} onValueChange={setWeeklyReport} icon="stats-chart-outline" color="#5A7264" 
            />
            <SettingToggle 
               title="Tanıtım & İpuçları" subtitle="Yeni özellikler ve sağlıklı yaşam ipuçları" 
               value={marketingApp} onValueChange={setMarketingApp} icon="sparkles-outline" color="#F59E0B" 
            />
          </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}
