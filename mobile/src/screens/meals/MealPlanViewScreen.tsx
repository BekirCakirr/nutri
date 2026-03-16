import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { mockMeals } from '../../mock/meals'

const turkishDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const mealTypeLabels: Record<string, string> = {
  breakfast: '☀️ Kahvaltı',
  lunch: '🍽️ Öğle Yemeği',
  dinner: '🌙 Akşam Yemeği',
  snack: '🍎 Ara Öğün',
}

export default function MealPlanViewScreen() {
  const navigation = useNavigation()

  // Group meals by date
  const mealsByDate: Record<string, typeof mockMeals> = {}
  for (const meal of mockMeals) {
    if (!mealsByDate[meal.date]) mealsByDate[meal.date] = []
    mealsByDate[meal.date].push(meal)
  }
  const sortedDates = Object.keys(mealsByDate).sort().reverse()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Beslenme Planı" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Plan overview info */}
        <View className="bg-[#E8F5EC] rounded-2xl p-5 mb-6 border border-[#C8E6CF]/40">
          <Text className="text-lg font-bold text-[#1A2E23] mb-1">Haftalık Plan</Text>
          <Text className="text-sm text-[#5A7264] leading-relaxed">
            Diyetisyeniniz tarafından sizin için oluşturulan beslenme planı.
          </Text>
          <View className="flex-row mt-4 gap-4">
            <View className="flex-1 bg-white/70 rounded-xl p-3 items-center">
              <Text className="text-2xl font-bold text-[#1A5C37]">1650</Text>
              <Text className="text-xs text-[#5A7264]">Günlük kcal</Text>
            </View>
            <View className="flex-1 bg-white/70 rounded-xl p-3 items-center">
              <Text className="text-2xl font-bold text-[#1A5C37]">4</Text>
              <Text className="text-xs text-[#5A7264]">Öğün / gün</Text>
            </View>
          </View>
        </View>

        {/* Days */}
        {sortedDates.map((date) => {
          const d = new Date(date)
          const dayName = turkishDays[d.getDay()]
          const dayNum = d.getDate()
          const meals = mealsByDate[date]
          const totalCal = meals.reduce((s, m) => s + m.totalNutrition.calories, 0)

          return (
            <View key={date} className="mb-5">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-bold text-[#1A2E23]">{dayName}, {dayNum}</Text>
                <Text className="text-sm font-semibold text-[#1A5C37]">{totalCal} kcal</Text>
              </View>
              {meals.map((meal) => (
                <View
                  key={meal.id}
                  className="bg-white rounded-xl px-4 py-3 mb-2 border border-[#E8F0EC] flex-row items-center"
                >
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-[#1A2E23]">
                      {mealTypeLabels[meal.type] || meal.type}
                    </Text>
                    <Text className="text-xs text-[#5A7264] mt-0.5">
                      {meal.items.map((i) => i.food.name).join(', ')}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-bold text-[#1A5C37]">{Math.round(meal.totalNutrition.calories)} kcal</Text>
                    <Text className="text-xs text-[#5A7264]">{meal.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          )
        })}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
