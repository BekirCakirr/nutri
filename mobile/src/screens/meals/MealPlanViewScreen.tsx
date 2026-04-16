import React, { useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { MealsStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { usePlan } from '../../hooks/usePlan'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import type { WeeklyPlan } from '../../types'

type Nav = StackNavigationProp<MealsStackParamList>

const turkishDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const mealTypeLabels: Record<string, string> = {
  breakfast: '☀️ Kahvaltı',
  lunch: '🍽️ Öğle Yemeği',
  dinner: '🌙 Akşam Yemeği',
  snack: '🍎 Ara Öğün',
}

// Mock plan data for demo
const today = new Date()
const startOfWeek = new Date(today)
startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday

function getDateStr(offset: number) {
  const d = new Date(startOfWeek)
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

const mockPlan: WeeklyPlan = {
  id: 'mock-plan-1',
  name: 'Kilo Verme Planı — Hafta 3',
  startDate: getDateStr(0),
  endDate: getDateStr(6),
  days: [
    {
      day: getDateStr(0),
      totalCalories: 1850,
      meals: [
        { type: 'breakfast', name: 'Yumurtalı menemen, tam buğday ekmek, peynir', foods: [], nutrition: { calories: 420, protein: 22, carbs: 35, fat: 18, fiber: 4, sugar: 3, sodium: 0 } },
        { type: 'lunch', name: 'Mercimek çorbası, ızgara tavuk salata', foods: [], nutrition: { calories: 550, protein: 38, carbs: 45, fat: 16, fiber: 8, sugar: 5, sodium: 0 } },
        { type: 'dinner', name: 'Fırında somon, buharda brokoli, bulgur', foods: [], nutrition: { calories: 580, protein: 42, carbs: 40, fat: 22, fiber: 6, sugar: 2, sodium: 0 } },
        { type: 'snack', name: 'Yoğurt, ceviz, bal', foods: [], nutrition: { calories: 300, protein: 12, carbs: 28, fat: 14, fiber: 2, sugar: 12, sodium: 0 } },
      ],
    },
    {
      day: getDateStr(1),
      totalCalories: 1780,
      meals: [
        { type: 'breakfast', name: 'Yulaf ezmesi, muz, badem', foods: [], nutrition: { calories: 380, protein: 14, carbs: 52, fat: 12, fiber: 7, sugar: 15, sodium: 0 } },
        { type: 'lunch', name: 'Nohutlu tavuk sote, pirinç pilavı', foods: [], nutrition: { calories: 520, protein: 35, carbs: 50, fat: 15, fiber: 6, sugar: 3, sodium: 0 } },
        { type: 'dinner', name: 'Karnıyarık, cacık, salata', foods: [], nutrition: { calories: 580, protein: 28, carbs: 48, fat: 24, fiber: 8, sugar: 6, sodium: 0 } },
        { type: 'snack', name: 'Elma, fıstık ezmesi', foods: [], nutrition: { calories: 300, protein: 8, carbs: 32, fat: 16, fiber: 5, sugar: 18, sodium: 0 } },
      ],
    },
    {
      day: getDateStr(2),
      totalCalories: 1820,
      meals: [
        { type: 'breakfast', name: 'Peynirli omlet, domates, zeytin', foods: [], nutrition: { calories: 400, protein: 24, carbs: 12, fat: 28, fiber: 2, sugar: 3, sodium: 0 } },
        { type: 'lunch', name: 'Izgara köfte, bulgur pilavı, ayran', foods: [], nutrition: { calories: 560, protein: 40, carbs: 42, fat: 20, fiber: 4, sugar: 6, sodium: 0 } },
        { type: 'dinner', name: 'Sebzeli makarna, ton balıklı salata', foods: [], nutrition: { calories: 520, protein: 30, carbs: 55, fat: 14, fiber: 6, sugar: 5, sodium: 0 } },
        { type: 'snack', name: 'Havuç çubukları, hummus', foods: [], nutrition: { calories: 340, protein: 10, carbs: 38, fat: 14, fiber: 8, sugar: 8, sodium: 0 } },
      ],
    },
    {
      day: getDateStr(3),
      totalCalories: 1790,
      meals: [
        { type: 'breakfast', name: 'Tam buğday tost, avokado, yumurta', foods: [], nutrition: { calories: 420, protein: 18, carbs: 30, fat: 24, fiber: 6, sugar: 2, sodium: 0 } },
        { type: 'lunch', name: 'Tavuk wrap, mevsim salatası', foods: [], nutrition: { calories: 480, protein: 32, carbs: 40, fat: 16, fiber: 5, sugar: 4, sodium: 0 } },
        { type: 'dinner', name: 'Etli kuru fasulye, pirinç, turşu', foods: [], nutrition: { calories: 620, protein: 34, carbs: 60, fat: 20, fiber: 12, sugar: 4, sodium: 0 } },
        { type: 'snack', name: 'Karışık kuruyemiş, kuru kayısı', foods: [], nutrition: { calories: 270, protein: 8, carbs: 28, fat: 14, fiber: 4, sugar: 16, sodium: 0 } },
      ],
    },
    {
      day: getDateStr(4),
      totalCalories: 1860,
      meals: [
        { type: 'breakfast', name: 'Smoothie bowl (muz, yulaf, çilek)', foods: [], nutrition: { calories: 360, protein: 12, carbs: 58, fat: 8, fiber: 6, sugar: 22, sodium: 0 } },
        { type: 'lunch', name: 'Fırında levrek, ıspanaklı börek', foods: [], nutrition: { calories: 580, protein: 38, carbs: 40, fat: 22, fiber: 4, sugar: 3, sodium: 0 } },
        { type: 'dinner', name: 'Tavuk sote, kinoa, brokoli', foods: [], nutrition: { calories: 540, protein: 42, carbs: 38, fat: 18, fiber: 6, sugar: 4, sodium: 0 } },
        { type: 'snack', name: 'Protein bar, süt', foods: [], nutrition: { calories: 380, protein: 24, carbs: 32, fat: 14, fiber: 3, sugar: 12, sodium: 0 } },
      ],
    },
    {
      day: getDateStr(5),
      totalCalories: 1750,
      meals: [
        { type: 'breakfast', name: 'Lor peynirli krep, bal, meyve', foods: [], nutrition: { calories: 380, protein: 20, carbs: 42, fat: 12, fiber: 3, sugar: 18, sodium: 0 } },
        { type: 'lunch', name: 'Mercimek köftesi, çoban salatası, ayran', foods: [], nutrition: { calories: 450, protein: 18, carbs: 55, fat: 12, fiber: 10, sugar: 6, sodium: 0 } },
        { type: 'dinner', name: 'Fırında sebzeli tavuk, patates püresi', foods: [], nutrition: { calories: 580, protein: 36, carbs: 48, fat: 20, fiber: 5, sugar: 4, sodium: 0 } },
        { type: 'snack', name: 'Muz, badem sütü', foods: [], nutrition: { calories: 340, protein: 6, carbs: 48, fat: 10, fiber: 4, sugar: 24, sodium: 0 } },
      ],
    },
    {
      day: getDateStr(6),
      totalCalories: 1900,
      meals: [
        { type: 'breakfast', name: 'Serpme kahvaltı (peynir, zeytin, yumurta, domates)', foods: [], nutrition: { calories: 500, protein: 26, carbs: 30, fat: 28, fiber: 4, sugar: 6, sodium: 0 } },
        { type: 'lunch', name: 'Lahmacun, salata, ayran', foods: [], nutrition: { calories: 520, protein: 24, carbs: 55, fat: 18, fiber: 4, sugar: 5, sodium: 0 } },
        { type: 'dinner', name: 'Kuzu tandır, bulgur, yoğurtlu semizotu', foods: [], nutrition: { calories: 620, protein: 40, carbs: 42, fat: 26, fiber: 5, sugar: 4, sodium: 0 } },
        { type: 'snack', name: 'Meyveli yoğurt, granola', foods: [], nutrition: { calories: 260, protein: 10, carbs: 36, fat: 8, fiber: 3, sugar: 18, sodium: 0 } },
      ],
    },
  ],
}

export default function MealPlanViewScreen() {
  const navigation = useNavigation<Nav>()
  const { activePlan, loadActivePlan } = usePlan()

  useEffect(() => {
    loadActivePlan()
  }, [loadActivePlan])

  const plan = activePlan?.days?.length ? activePlan : mockPlan
  const planDays = plan.days ?? []
  const totalDays = planDays.length
  const avgCals = totalDays > 0
    ? Math.round(planDays.reduce((s, d) => s + (d.totalCalories || 0), 0) / totalDays)
    : 0

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Beslenme Planı" onBack={() => navigation.goBack()} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Plan overview */}
        <View style={s.overviewCard}>
          <View style={s.overviewBadge}>
            <Ionicons name="nutrition" size={16} color="#FFF" />
          </View>
          <Text style={s.planTitle}>{(plan as any).name || 'Haftalık Plan'}</Text>
          <Text style={s.planSubtitle}>Diyetisyeniniz tarafından sizin için hazırlandı</Text>
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statValue}>{avgCals}</Text>
              <Text style={s.statLabel}>Ort. Günlük kcal</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>{totalDays}</Text>
              <Text style={s.statLabel}>Gün</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>4</Text>
              <Text style={s.statLabel}>Öğün/Gün</Text>
            </View>
          </View>
        </View>

        {/* Days */}
        {planDays.map((dayPlan, index) => {
          let dayName = `Gün ${index + 1}`
          if (dayPlan.day) {
            const d = new Date(dayPlan.day)
            if (!isNaN(d.getTime())) {
              dayName = turkishDays[d.getDay()] + ', ' + d.getDate() + ' ' + ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'][d.getMonth()]
            }
          }

          const isToday = dayPlan.day === new Date().toISOString().split('T')[0]

          return (
            <TouchableOpacity
              key={index}
              style={[s.dayCard, isToday && s.dayCardToday]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('MealPlanDayDetail', { date: dayPlan.day })}
            >
              <View style={s.dayHeader}>
                <View style={s.dayNameRow}>
                  {isToday && <View style={s.todayDot} />}
                  <Text style={[s.dayName, isToday && s.dayNameToday]}>{dayName}</Text>
                </View>
                <View style={s.dayCalBadge}>
                  <Text style={s.dayCalText}>{dayPlan.totalCalories} kcal</Text>
                </View>
              </View>
              {dayPlan.meals?.map((meal, mIndex) => (
                <View key={mIndex} style={s.mealRow}>
                  <Text style={s.mealType}>{mealTypeLabels[meal.type] || meal.type}</Text>
                  <Text style={s.mealName} numberOfLines={1}>{meal.name}</Text>
                </View>
              ))}
              <View style={s.dayFooter}>
                <Text style={s.detailLink}>Detayları Gör</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary.main} />
              </View>
            </TouchableOpacity>
          )
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  )
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  overviewCard: {
    backgroundColor: colors.primary.main,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  overviewBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700' as any,
    color: '#FFF',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800' as any,
    color: '#FFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  dayCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8F0EC',
  },
  dayCardToday: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dayNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.main,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '700' as any,
    color: '#1A2E23',
  },
  dayNameToday: {
    color: colors.primary.main,
  },
  dayCalBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  dayCalText: {
    fontSize: 13,
    fontWeight: '700' as any,
    color: colors.primary.main,
  },
  mealRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: '#F5F7F6',
  },
  mealType: {
    fontSize: 13,
    fontWeight: '600' as any,
    color: '#1A2E23',
    width: 120,
  },
  mealName: {
    fontSize: 13,
    color: '#5A7264',
    flex: 1,
  },
  dayFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 4,
  },
  detailLink: {
    fontSize: 13,
    fontWeight: '600' as any,
    color: colors.primary.main,
  },
})
