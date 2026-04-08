import React, { useState } from 'react'
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native'
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
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#E8F0EC' }}>
       <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 16 }}>
          <View style={{ width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: color + '20' }}>
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <View style={{ flex: 1 }}>
             <Text style={{ fontWeight: '600', color: '#1A2E23', fontSize: 16, marginBottom: 2 }}>{title}</Text>
             <Text style={{ fontSize: 12, color: '#5A7264' }}>{subtitle}</Text>
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
      
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 16, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        
        {/* Master Toggle */}
        <View style={{ borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white shadow-sm */>
           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, paddingRight: 16 }}>
                 <Text style={{ fontWeight: '700', fontSize: 18, color: '#1A2E23', marginBottom: 4 }}>Anlık Bildirimler</Text>
                 <Text style={{ fontSize: 12, color: '#5A7264' }}>Tüm uygulama bildirimlerini (push) açıp kapatın.</Text>
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
          <Text style={{ color: '#1A2E23', fontWeight: '700', fontSize: 15, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 }} /* TODO: tracking-wider */>Günlük Hatırlatıcılar</Text>
          <View style={{ borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 24 }} /* TODO: bg-white */>
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
          <Text style={{ color: '#1A2E23', fontWeight: '700', fontSize: 15, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 }} /* TODO: tracking-wider */>Sosyal & Uzman</Text>
          <View style={{ borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 24 }} /* TODO: bg-white */>
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
          <Text style={{ color: '#1A2E23', fontWeight: '700', fontSize: 15, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 }} /* TODO: tracking-wider */>Sistem</Text>
          <View style={{ borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 32 }} /* TODO: bg-white */>
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
