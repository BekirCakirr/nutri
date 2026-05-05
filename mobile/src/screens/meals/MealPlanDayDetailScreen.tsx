import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { MealsStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { usePlanStore } from '../../stores/planStore'
import { colors } from '../../theme/colors'

type Route = RouteProp<MealsStackParamList, 'MealPlanDayDetail'>
type Nav = StackNavigationProp<MealsStackParamList, 'MealPlanDayDetail'>

const mealTypeLabels: Record<string, { label: string; icon: string; color: string }> = {
  breakfast: { label: 'Kahvaltı', icon: 'sunny-outline', color: '#F59E0B' },
  lunch: { label: 'Öğle Yemeği', icon: 'restaurant-outline', color: '#1A5C37' },
  dinner: { label: 'Akşam Yemeği', icon: 'moon-outline', color: '#6366F1' },
  snack: { label: 'Ara Öğün', icon: 'cafe-outline', color: '#EC4899' },
}

const turkishDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const turkishMonths = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']

// Mock data for a day — used when backend has no plan
const mockDayItems = [
  { meal_type: 'breakfast' as const, food_name: 'Haşlanmış yumurta (2 adet)', amount_g: '120', calories: '156', protein: '12', carbs: '1', fat: '10' },
  { meal_type: 'breakfast' as const, food_name: 'Tam buğday ekmek', amount_g: '60', calories: '140', protein: '5', carbs: '24', fat: '2' },
  { meal_type: 'breakfast' as const, food_name: 'Beyaz peynir', amount_g: '40', calories: '100', protein: '7', carbs: '1', fat: '8' },
  { meal_type: 'breakfast' as const, food_name: 'Domates, salatalık, zeytin', amount_g: '100', calories: '45', protein: '1', carbs: '6', fat: '2' },
  { meal_type: 'lunch' as const, food_name: 'Mercimek çorbası', amount_g: '250', calories: '180', protein: '12', carbs: '28', fat: '3' },
  { meal_type: 'lunch' as const, food_name: 'Izgara tavuk göğsü', amount_g: '150', calories: '230', protein: '35', carbs: '0', fat: '8' },
  { meal_type: 'lunch' as const, food_name: 'Bulgur pilavı', amount_g: '120', calories: '150', protein: '4', carbs: '30', fat: '2' },
  { meal_type: 'lunch' as const, food_name: 'Mevsim salatası', amount_g: '150', calories: '60', protein: '2', carbs: '8', fat: '2' },
  { meal_type: 'dinner' as const, food_name: 'Fırında somon fileto', amount_g: '180', calories: '350', protein: '38', carbs: '0', fat: '20' },
  { meal_type: 'dinner' as const, food_name: 'Buharda brokoli', amount_g: '150', calories: '50', protein: '4', carbs: '8', fat: '0' },
  { meal_type: 'dinner' as const, food_name: 'Kinoa', amount_g: '100', calories: '120', protein: '4', carbs: '20', fat: '2' },
  { meal_type: 'snack' as const, food_name: 'Yoğurt', amount_g: '200', calories: '120', protein: '8', carbs: '10', fat: '5' },
  { meal_type: 'snack' as const, food_name: 'Ceviz (10 adet)', amount_g: '30', calories: '200', protein: '5', carbs: '4', fat: '18' },
  { meal_type: 'snack' as const, food_name: 'Bal (1 tatlı kaşığı)', amount_g: '10', calories: '30', protein: '0', carbs: '8', fat: '0' },
]

export default function MealPlanDayDetailScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const { date } = route.params ?? { date: new Date().toISOString().split('T')[0] }

  const activePlan = usePlanStore((s) => s.activePlan)
  const loadActivePlan = usePlanStore((s) => s.loadActivePlan)
  const [loading, setLoading] = useState(!activePlan)

  useEffect(() => {
    let cancelled = false
    if (!activePlan) {
      loadActivePlan()
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    } else {
      setLoading(false)
    }
    return () => {
      cancelled = true
    }
  }, [activePlan, loadActivePlan])

  const safeDate = date && !Number.isNaN(new Date(date).getTime())
    ? date
    : new Date().toISOString().split('T')[0]
  const d = new Date(safeDate)
  const mappedDayOfWeek = d.getDay() === 0 ? 7 : d.getDay()
  const dayLabel = `${turkishDays[d.getDay()]}, ${d.getDate()} ${turkishMonths[d.getMonth()]}`

  if (loading) {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <AppHeader title={dayLabel} onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1A5C37" />
        </View>
      </ScreenWrapper>
    )
  }

  // Use backend data or mock — backend may return day_of_week as string or number
  const allItems = Array.isArray(activePlan?.items) ? (activePlan?.items ?? []) : []
  const backendItems = allItems.filter((i) => Number(i?.day_of_week) === mappedDayOfWeek)
  const dayItems = backendItems.length > 0 ? backendItems : mockDayItems

  // Calculate totals
  const totalCal = dayItems.reduce((s, i) => s + (Number(i.calories) || 0), 0)
  const totalProtein = dayItems.reduce((s, i) => s + (Number(i.protein) || 0), 0)
  const totalCarbs = dayItems.reduce((s, i) => s + (Number(i.carbs) || 0), 0)
  const totalFat = dayItems.reduce((s, i) => s + (Number(i.fat) || 0), 0)

  // Group by meal_type
  const mealGroups: Record<string, typeof dayItems> = {}
  dayItems.forEach((item) => {
    if (!mealGroups[item.meal_type]) mealGroups[item.meal_type] = []
    mealGroups[item.meal_type].push(item)
  })

  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack']
  const sortedMealKeys = Object.keys(mealGroups).sort((a, b) => {
    const idxA = mealOrder.indexOf(a)
    const idxB = mealOrder.indexOf(b)
    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99)
  })

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title={dayLabel} onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={{ backgroundColor: '#E8F5EC', borderRadius: 20, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#C8E6CF66' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#5A7264', marginBottom: 4 }}>Günlük Toplam</Text>
          <Text style={{ fontSize: 40, fontWeight: '800', color: '#1A5C37' }}>{Math.round(totalCal)}</Text>
          <Text style={{ fontSize: 14, color: '#5A7264', marginTop: -2, marginBottom: 20 }}>kcal</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)' }}>
              <View style={{ borderRadius: 10, backgroundColor: '#EF444420', padding: 6, marginBottom: 6 }}>
                <Ionicons name="fitness" size={16} color="#EF4444" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A2E23' }}>{Math.round(totalProtein)}g</Text>
              <Text style={{ fontSize: 11, color: '#5A7264' }}>Protein</Text>
            </View>
            <View style={{ flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)' }}>
              <View style={{ borderRadius: 10, backgroundColor: '#3B82F620', padding: 6, marginBottom: 6 }}>
                <Ionicons name="leaf" size={16} color="#3B82F6" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A2E23' }}>{Math.round(totalCarbs)}g</Text>
              <Text style={{ fontSize: 11, color: '#5A7264' }}>Karbonhidrat</Text>
            </View>
            <View style={{ flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)' }}>
              <View style={{ borderRadius: 10, backgroundColor: '#F59E0B20', padding: 6, marginBottom: 6 }}>
                <Ionicons name="water" size={16} color="#F59E0B" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A2E23' }}>{Math.round(totalFat)}g</Text>
              <Text style={{ fontSize: 11, color: '#5A7264' }}>Yağ</Text>
            </View>
          </View>
        </View>

        {/* Meal cards */}
        {sortedMealKeys.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 64 }}>
            <Ionicons name="calendar-outline" size={56} color="#D4E2DA" />
            <Text style={{ fontSize: 16, color: '#5A7264', marginTop: 16 }}>Bu gün için plan bulunmuyor</Text>
          </View>
        ) : (
          sortedMealKeys.map((mealType) => {
            const items = mealGroups[mealType]
            const config = mealTypeLabels[mealType] || { label: mealType, icon: 'fast-food-outline', color: '#5A7264' }
            const typeCals = items.reduce((sum, item) => sum + (Number(item.calories) || 0), 0)
            const typeProtein = items.reduce((sum, item) => sum + (Number(item.protein) || 0), 0)

            return (
              <View key={mealType} style={{ borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#E8F0EC', backgroundColor: '#FFFFFF' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: config.color + '15' }}>
                    <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={20} color={config.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, fontWeight: '700', color: '#1A2E23' }}>{config.label}</Text>
                    <Text style={{ fontSize: 12, color: '#5A7264' }}>{typeProtein}g protein</Text>
                  </View>
                  <Text style={{ fontSize: 17, fontWeight: '700', color: colors.primary.main }}>{Math.round(typeCals)} kcal</Text>
                </View>
                {items.map((item, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderColor: '#F0F5F2' }}>
                    <Text style={{ fontSize: 14, color: '#1A2E23', flex: 1 }}>{item.food_name}</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#1A2E23' }}>{item.calories} kcal</Text>
                      <Text style={{ fontSize: 11, color: '#5A7264' }}>{item.amount_g}g</Text>
                    </View>
                  </View>
                ))}
              </View>
            )
          })
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  )
}
