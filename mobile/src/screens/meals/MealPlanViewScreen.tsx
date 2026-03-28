import React, { useEffect } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { usePlan } from '../../hooks/usePlan'
import { colors } from '../../theme/colors'

const turkishDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const mealTypeLabels: Record<string, string> = {
  breakfast: '☀️ Kahvaltı',
  lunch: '🍽️ Öğle Yemeği',
  dinner: '🌙 Akşam Yemeği',
  snack: '🍎 Ara Öğün',
}

export default function MealPlanViewScreen() {
  const navigation = useNavigation()
  const { activePlan, loadActivePlan } = usePlan()

  useEffect(() => {
    loadActivePlan()
  }, [loadActivePlan])

  if (!activePlan) {
    return (
      <ScreenWrapper padded={false}>
        <AppHeader title="Beslenme Planı" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Ionicons name="document-text-outline" size={60} color={colors.text.disabled} />
          <Text style={{ marginTop: 16, fontSize: 16, color: colors.text.secondary, textAlign: 'center' }}>
            Şu an atanmış aktif bir diyet planınız bulunmuyor. Diyetisyeninizle iletişime geçin.
          </Text>
        </View>
      </ScreenWrapper>
    )
  }

  // Calculate generic plan stats
  const totalDays = activePlan.days?.length || 0
  const avgCals = totalDays > 0 
    ? Math.round(activePlan.days.reduce((s, d) => s + (d.totalCalories || 0), 0) / totalDays) 
    : 0

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
              <Text className="text-2xl font-bold text-[#1A5C37]">{avgCals}</Text>
              <Text className="text-xs text-[#5A7264]">Ort. Günlük kcal</Text>
            </View>
            <View className="flex-1 bg-white/70 rounded-xl p-3 items-center">
              <Text className="text-2xl font-bold text-[#1A5C37]">{totalDays}</Text>
              <Text className="text-xs text-[#5A7264]">Günlük Plan</Text>
            </View>
          </View>
        </View>

        {/* Days */}
        {activePlan.days?.map((dayPlan, index) => {
          let dayName = turkishDays[index % 7]
          // Optional: use actual day if backend provides real dates
          if (dayPlan.day) {
            const d = new Date(dayPlan.day)
            if (!isNaN(d.getTime())) {
              dayName = turkishDays[d.getDay()] + ', ' + d.getDate()
            } else {
              dayName = `Gün ${index + 1}`
            }
          }

          return (
            <View key={index} className="mb-5">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-bold text-[#1A2E23]">{dayName}</Text>
                <Text className="text-sm font-semibold text-[#1A5C37]">{dayPlan.totalCalories || 0} kcal</Text>
              </View>
              {dayPlan.meals?.map((meal, mIndex) => (
                <View
                  key={mIndex}
                  className="bg-white rounded-xl px-4 py-3 mb-2 border border-[#E8F0EC] flex-row items-center"
                >
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-[#1A2E23]">
                      {mealTypeLabels[meal.type] || meal.type}
                    </Text>
                    <Text className="text-xs text-[#5A7264] mt-0.5">
                      {meal.name || (meal.foods?.map((f) => f.name).join(', ') || 'Belirtilmemiş')}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-bold text-[#1A5C37]">{Math.round(meal.nutrition?.calories || 0)} kcal</Text>
                    {meal.nutrition?.protein != null && (
                      <Text className="text-xs text-[#5A7264]">{meal.nutrition.protein}g Protein</Text>
                    )}
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
