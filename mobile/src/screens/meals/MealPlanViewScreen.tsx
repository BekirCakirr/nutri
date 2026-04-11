import React, { useEffect } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
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
      <ScreenWrapper scrollable={false} padded={false}>
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
  const planDays = activePlan.days ?? []
  const totalDays = planDays.length
  const avgCals = totalDays > 0
    ? Math.round(planDays.reduce((s, d) => s + (d.totalCalories || 0), 0) / totalDays)
    : 0

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Beslenme Planı" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Plan overview info */}
        <View style={{ backgroundColor: '#E8F5EC', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#C8E6CF66' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23', marginBottom: 4 }}>Haftalık Plan</Text>
          <Text style={{ fontSize: 14, color: '#5A7264' , lineHeight: 20 }}>
            Diyetisyeniniz tarafından sizin için oluşturulan beslenme planı.
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 16, gap: 16 }}>
            <View style={{ flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' , backgroundColor: 'rgba(255,255,255,0.7)' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A5C37' }}>{avgCals}</Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>Ort. Günlük kcal</Text>
            </View>
            <View style={{ flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' , backgroundColor: 'rgba(255,255,255,0.7)' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A5C37' }}>{totalDays}</Text>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>Günlük Plan</Text>
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
            <View key={index} style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23' }}>{dayName}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A5C37' }}>{dayPlan.totalCalories || 0} kcal</Text>
              </View>
              {dayPlan.meals?.map((meal, mIndex) => (
                <View
                  key={mIndex}
                  style={{ borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC', flexDirection: 'row', alignItems: 'center' , backgroundColor: '#FFFFFF' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23' }}>
                      {mealTypeLabels[meal.type] || meal.type}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>
                      {meal.name || (meal.foods?.map((f) => f.name).join(', ') || 'Belirtilmemiş')}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A5C37' }}>{Math.round(meal.nutrition?.calories || 0)} kcal</Text>
                    {meal.nutrition?.protein != null && (
                      <Text style={{ fontSize: 12, color: '#5A7264' }}>{meal.nutrition.protein}g Protein</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )
        })}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
