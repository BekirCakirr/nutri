import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'

type Nav = StackNavigationProp<ProgressStackParamList>

// Summary data for the dashboard
const summaryData = {
  weight: { current: 74.5, target: 70, unit: 'kg' },
  water: { current: 1750, target: 2500, unit: 'ml' },
  calories: { consumed: 1680, target: 2200 },
  steps: { current: 6420, target: 10000 },
  sleep: { hours: 7.2, quality: 85 },
  exercise: { minutes: 35, calories: 280 },
}

type CardItem = {
  title: string
  icon: keyof typeof Ionicons.glyphMap
  value: string
  sub: string
  color: string
  bgColor: string
  screen: keyof ProgressStackParamList
}

const cards: CardItem[] = [
  { title: 'Kilo', icon: 'scale-outline', value: `${summaryData.weight.current} kg`, sub: `Hedef: ${summaryData.weight.target} kg`, color: '#1A5C37', bgColor: '#E8F5EC', screen: 'Weight' },
  { title: 'Su', icon: 'water-outline', value: `${(summaryData.water.current / 1000).toFixed(1)} L`, sub: `Hedef: ${(summaryData.water.target / 1000).toFixed(1)} L`, color: '#4A90B8', bgColor: '#E4F0F7', screen: 'Water' },
  { title: 'Kalori', icon: 'flame-outline', value: `${summaryData.calories.consumed}`, sub: `/ ${summaryData.calories.target} kcal`, color: '#E8A040', bgColor: '#FEF3C7', screen: 'CalorieHistory' },
  { title: 'Adımlar', icon: 'footsteps-outline', value: `${summaryData.steps.current.toLocaleString('tr-TR')}`, sub: `/ ${summaryData.steps.target.toLocaleString('tr-TR')}`, color: '#8B6BAA', bgColor: '#F3E8FF', screen: 'Steps' },
  { title: 'Uyku', icon: 'moon-outline', value: `${summaryData.sleep.hours} saat`, sub: `Kalite: %${summaryData.sleep.quality}`, color: '#4A7FB5', bgColor: '#DBEAFE', screen: 'Sleep' },
  { title: 'Egzersiz', icon: 'barbell-outline', value: `${summaryData.exercise.minutes} dk`, sub: `${summaryData.exercise.calories} kcal yakıldı`, color: '#C75B4A', bgColor: '#FEE2E2', screen: 'Exercise' },
  { title: 'Ruh Hali', icon: 'happy-outline', value: '😊', sub: 'Bugün: İyi', color: '#F59E0B', bgColor: '#FEF3C7', screen: 'Mood' },
  { title: 'Makrolar', icon: 'pie-chart-outline', value: 'P/K/Y', sub: '92g / 210g / 58g', color: '#1A5C37', bgColor: '#E8F5EC', screen: 'MacroTracking' },
]

const secondaryCards: { title: string; icon: keyof typeof Ionicons.glyphMap; screen: keyof ProgressStackParamList }[] = [
  { title: 'Kan Değerleri', icon: 'water', screen: 'BloodValues' },
  { title: 'Vitaminler', icon: 'leaf-outline', screen: 'Vitamins' },
  { title: 'Fotoğraflar', icon: 'camera-outline', screen: 'ProgressPhotos' },
  { title: 'Aralıklı Oruç', icon: 'timer-outline', screen: 'IntermittentFasting' },
  { title: 'Hedefler', icon: 'flag-outline', screen: 'CustomGoals' },
  { title: 'Ölçüler', icon: 'resize-outline', screen: 'Measurements' },
  { title: 'Besin Detayı', icon: 'nutrition-outline', screen: 'NutrientBreakdown' },
  { title: 'Kalp Hızı', icon: 'heart-outline', screen: 'HeartRate' },
  { title: 'Stres', icon: 'pulse-outline', screen: 'Stress' },
]

export default function OverviewScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <ScrollView className="flex-1 bg-[#F8FAF9]" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-6 pb-3">
          <Text className="text-2xl font-extrabold text-[#1A2E23]">İlerleme</Text>
          <Text className="text-sm text-[#5A7264] mt-1">Sağlık verilerinizin özeti</Text>
        </View>

        {/* Primary stat cards grid (2 columns) */}
        <View className="px-4 flex-row flex-wrap">
          {cards.map((card, idx) => (
            <TouchableOpacity
              key={idx}
              className="w-[48%] mx-[1%] mb-3 bg-white rounded-2xl p-4 border border-[#E8F0EC]"
              activeOpacity={0.7}
              onPress={() => navigation.navigate(card.screen)}
            >
              <View className="flex-row items-center mb-3">
                <View
                  className="w-9 h-9 rounded-full items-center justify-center mr-2.5"
                  style={{ backgroundColor: card.bgColor }}
                >
                  <Ionicons name={card.icon} size={18} color={card.color} />
                </View>
                <Text className="text-xs font-semibold text-[#5A7264]">{card.title}</Text>
              </View>
              <Text className="text-xl font-bold text-[#1A2E23]">{card.value}</Text>
              <Text className="text-xs text-[#5A7264] mt-0.5">{card.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <View className="mx-5 my-2 h-px bg-[#D4E2DA]" />

        {/* Secondary navigation cards */}
        <View className="px-5 py-3">
          <Text className="text-lg font-bold text-[#1A2E23] mb-3">Diğer Takipler</Text>
          {secondaryCards.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]"
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View className="w-10 h-10 rounded-full bg-[#E8F5EC] items-center justify-center mr-3">
                <Ionicons name={item.icon} size={20} color="#1A5C37" />
              </View>
              <Text className="flex-1 text-base font-semibold text-[#1A2E23]">{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color="#5A7264" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
