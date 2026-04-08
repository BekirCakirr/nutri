import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
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
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={{ backgroundColor: '#E8F5EC', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#C8E6CF66' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#5A7264', marginBottom: 4 }}>Günlük Toplam</Text>
          <Text style={{ fontSize: 36, fontWeight: '800', color: '#1A5C37' }}>{Math.round(totalCal)}</Text>
          <Text style={{ fontSize: 14, color: '#5A7264', marginTop: -2, marginBottom: 16 }}>kcal</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1, borderRadius: 12, padding: 10, alignItems: 'center' }} /* TODO: bg-white/70 */>
              <View style={{ borderRadius: 9999, backgroundColor: '#EF4444', marginBottom: 4 }} /* TODO: w-2.5 h-2.5 *//>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23' }}>{Math.round(totalProtein)}g</Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>Protein</Text>
            </View>
            <View style={{ flex: 1, borderRadius: 12, padding: 10, alignItems: 'center' }} /* TODO: bg-white/70 */>
              <View style={{ borderRadius: 9999, backgroundColor: '#3B82F6', marginBottom: 4 }} /* TODO: w-2.5 h-2.5 *//>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23' }}>{Math.round(totalCarbs)}g</Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>Karbonhidrat</Text>
            </View>
            <View style={{ flex: 1, borderRadius: 12, padding: 10, alignItems: 'center' }} /* TODO: bg-white/70 */>
              <View style={{ borderRadius: 9999, backgroundColor: '#F59E0B', marginBottom: 4 }} /* TODO: w-2.5 h-2.5 *//>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23' }}>{Math.round(totalFat)}g</Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>Yağ</Text>
            </View>
          </View>
        </View>

        {/* Meal cards */}
        {dayMeals.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 64 }}>
            <Ionicons name="calendar-outline" size={56} color="#D4E2DA" />
            <Text style={{ fontSize: 16, color: '#5A7264', marginTop: 16 }}>Bu gün için plan bulunmuyor</Text>
          </View>
        ) : (
          dayMeals.map((meal) => {
            const config = mealTypeLabels[meal.type] || { label: meal.type, icon: 'fast-food-outline', color: '#5A7264' }
            return (
              <View key={meal.id} style={{ borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View
                    style={{ width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: config.color + '18' }}
                  >
                    <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={18} color={config.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23' }}>{config.label}</Text>
                    <Text style={{ fontSize: 12, color: '#5A7264' }}>{meal.time}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A5C37' }}>{Math.round(meal.totalNutrition.calories)} kcal</Text>
                </View>
                {meal.items.map((item, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderColor: '#F0F5F2' }}>
                    <Text style={{ fontSize: 14, color: '#1A2E23', flex: 1 }}>{item.food.name}</Text>
                    <Text style={{ fontSize: 14, color: '#5A7264' }}>{item.quantity} {item.unit}</Text>
                  </View>
                ))}
              </View>
            )
          })
        )}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
