import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { MealsStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { mockMeals } from '../../mock/meals'

type Route = RouteProp<MealsStackParamList, 'MealPlanDayDetail'>

const mealTypeLabels: Record<string, { label: string; icon: string; color: string }> = {
  breakfast: { label: 'Kahvaltı', icon: 'sunny-outline', color: '#F59E0B' },
  lunch: { label: 'Öğle Yemeği', icon: 'restaurant-outline', color: '#1A5C37' },
  dinner: { label: 'Akşam Yemeği', icon: 'moon-outline', color: '#6366F1' },
  snack: { label: 'Ara Öğün', icon: 'cafe-outline', color: '#EC4899' },
}

export default function MealPlanDayDetailScreen() {
  const navigation = useNavigation()
  const route = useRoute<Route>()
  const { date } = route.params

  const dayMeals = mockMeals.filter((m) => m.date === date)
  const totalCal = dayMeals.reduce((s, m) => s + m.totalNutrition.calories, 0)
  const totalProtein = dayMeals.reduce((s, m) => s + m.totalNutrition.protein, 0)
  const totalCarbs = dayMeals.reduce((s, m) => s + m.totalNutrition.carbs, 0)
  const totalFat = dayMeals.reduce((s, m) => s + m.totalNutrition.fat, 0)

  const d = new Date(date)
  const formattedDate = `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title={formattedDate} onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View className="bg-[#E8F5EC] rounded-2xl p-5 mb-6 border border-[#C8E6CF]/40">
          <Text className="text-sm font-medium text-[#5A7264] mb-1">Günlük Toplam</Text>
          <Text className="text-4xl font-extrabold text-[#1A5C37]">{Math.round(totalCal)}</Text>
          <Text className="text-sm text-[#5A7264] -mt-0.5 mb-4">kcal</Text>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white/70 rounded-xl p-2.5 items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-[#EF4444] mb-1" />
              <Text className="text-lg font-bold text-[#1A2E23]">{Math.round(totalProtein)}g</Text>
              <Text className="text-xs text-[#5A7264]">Protein</Text>
            </View>
            <View className="flex-1 bg-white/70 rounded-xl p-2.5 items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] mb-1" />
              <Text className="text-lg font-bold text-[#1A2E23]">{Math.round(totalCarbs)}g</Text>
              <Text className="text-xs text-[#5A7264]">Karbonhidrat</Text>
            </View>
            <View className="flex-1 bg-white/70 rounded-xl p-2.5 items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] mb-1" />
              <Text className="text-lg font-bold text-[#1A2E23]">{Math.round(totalFat)}g</Text>
              <Text className="text-xs text-[#5A7264]">Yağ</Text>
            </View>
          </View>
        </View>

        {/* Meal cards */}
        {dayMeals.length === 0 ? (
          <View className="items-center py-16">
            <Ionicons name="calendar-outline" size={56} color="#D4E2DA" />
            <Text className="text-base text-[#5A7264] mt-4">Bu gün için plan bulunmuyor</Text>
          </View>
        ) : (
          dayMeals.map((meal) => {
            const config = mealTypeLabels[meal.type] || { label: meal.type, icon: 'fast-food-outline', color: '#5A7264' }
            return (
              <View key={meal.id} className="bg-white rounded-2xl p-4 mb-3 border border-[#E8F0EC]">
                <View className="flex-row items-center mb-3">
                  <View
                    className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: config.color + '18' }}
                  >
                    <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={18} color={config.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-[#1A2E23]">{config.label}</Text>
                    <Text className="text-xs text-[#5A7264]">{meal.time}</Text>
                  </View>
                  <Text className="text-base font-bold text-[#1A5C37]">{Math.round(meal.totalNutrition.calories)} kcal</Text>
                </View>
                {meal.items.map((item, idx) => (
                  <View key={idx} className="flex-row justify-between py-2 border-t border-[#F0F5F2]">
                    <Text className="text-sm text-[#1A2E23] flex-1">{item.food.name}</Text>
                    <Text className="text-sm text-[#5A7264]">{item.quantity} {item.unit}</Text>
                  </View>
                ))}
              </View>
            )
          })
        )}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
