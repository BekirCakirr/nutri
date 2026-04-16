import React, { useState, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  Animated,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { MealsStackParamList } from '../../navigation/types'
import type { Meal, MealType } from '../../types'
import { useMealStore } from '../../stores/mealStore'
import { useAuthStore } from '../../stores/authStore'
import { DEFAULT_CALORIE_TARGET } from '../../lib/constants'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { CalorieRing } from '../../components/nutrition/CalorieRing'
import { MacroBar } from '../../components/nutrition/MacroBar'
import { CalorieSummary } from '../../components/nutrition/CalorieSummary'
import { MealCard } from '../../components/nutrition/MealCard'
import { SectionHeader } from '../../components/common/SectionHeader'
import { FloatingActionButton } from '../../components/ui/FloatingActionButton'
import { AnimatedPressable } from '../../components/ui/AnimatedPressable'
import { useStaggeredList } from '../../components/ui/useStaggeredList'
import { colors, nutritionColors } from '../../theme/colors'
import { spacing, borderRadius } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { shadows } from '../../theme/shadows'
import { mealTypeConfig } from '../../theme/icons'

type Nav = StackNavigationProp<MealsStackParamList>

const turkishMonths = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
]

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

function formatDate(date: Date): string {
  const day = date.getDate()
  const month = turkishMonths[date.getMonth()]
  const year = date.getFullYear()
  const today = new Date()
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  return isToday ? `Bugün, ${day} ${month}` : `${day} ${month} ${year}`
}

export default function MealLogScreen() {
  const navigation = useNavigation<Nav>()
  const { todayMeals, loadTodayMeals } = useMealStore()
  const user = useAuthStore((s) => s.user)
  const CALORIE_TARGET = Number((user as any)?.profile?.daily_calorie_target || (user as any)?.daily_calorie_target) || DEFAULT_CALORIE_TARGET
  const [selectedDate, setSelectedDate] = useState(new Date())

  useFocusEffect(
    useCallback(() => {
      loadTodayMeals()
    }, [loadTodayMeals])
  )

  const mealsByType = useMemo(() => {
    const grouped: Record<MealType, Meal[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    }
    for (const meal of todayMeals || []) {
      if (meal?.type && grouped[meal.type]) {
        grouped[meal.type].push(meal)
      }
    }
    return grouped
  }, [todayMeals])

  const totals = useMemo(() => {
    let calories = 0, protein = 0, carbs = 0, fat = 0
    for (const meal of todayMeals || []) {
      calories += meal?.totalNutrition?.calories || 0
      protein += meal?.totalNutrition?.protein || 0
      carbs += meal?.totalNutrition?.carbs || 0
      fat += meal?.totalNutrition?.fat || 0
    }
    return { calories: Math.round(calories), protein: Math.round(protein), carbs: Math.round(carbs), fat: Math.round(fat) }
  }, [todayMeals])

  const changeDate = (offset: number) => {
    setSelectedDate((prev) => {
      const next = new Date(prev)
      next.setDate(next.getDate() + offset)
      return next
    })
  }

  const cardCount = MEAL_TYPES.reduce((sum, type) => {
    return sum + Math.max(mealsByType[type].length, 1)
  }, 0)
  const staggeredStyles = useStaggeredList(cardCount, 100)

  let cardIndex = 0

  return (
    <ScreenWrapper scrollable contentStyle={styles.containerStyle}>
      {/* Premium Glow Effect */}
      <View style={styles.glowTopRight} />

      {/* Date Picker Row */}
      <View style={styles.dateRow}>
        <AnimatedPressable style={styles.navBtn} onPress={() => changeDate(-1)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </AnimatedPressable>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <AnimatedPressable style={styles.navBtn} onPress={() => changeDate(1)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-forward" size={24} color={colors.text.primary} />
        </AnimatedPressable>
      </View>

      {/* Unified Daily Overview Card */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Günlük Alım</Text>
          <Ionicons name="pie-chart" size={24} color={colors.primary.main} />
        </View>

        <View style={styles.ringContainer}>
          <CalorieRing consumed={totals.calories} target={CALORIE_TARGET} size={180} strokeWidth={16} />
        </View>

        <View style={styles.macroCard}>
          <MacroBar protein={totals.protein} carbs={totals.carbs} fat={totals.fat} style={styles.macroBar} />
          <CalorieSummary consumed={totals.calories} target={CALORIE_TARGET} style={styles.summary} />
        </View>
      </View>

      {/* Diet Plan Quick Access */}
      <AnimatedPressable
        style={styles.planCard}
        onPress={() => navigation.navigate('MealPlanView')}
      >
        <View style={styles.planCardLeft}>
          <View style={styles.planIcon}>
            <Ionicons name="calendar" size={22} color="#FFF" />
          </View>
          <View>
            <Text style={styles.planTitle}>Diyet Planım</Text>
            <Text style={styles.planSub}>Haftalık beslenme planını görüntüle</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.primary.main} />
      </AnimatedPressable>

      {/* Meals Section */}
      <SectionHeader title="Öğünler" style={styles.sectionMargin} />

      <View style={styles.mealsListWrapper}>
        {MEAL_TYPES.map((type) => {
          const mealsForType = mealsByType[type]
          const config = mealTypeConfig[type]
          const color = nutritionColors.mealType[type]

          if (mealsForType.length === 0) {
            const idx = cardIndex++
            return (
              <Animated.View key={`empty-${type}`} style={staggeredStyles[idx]}>
                <AnimatedPressable
                  style={styles.emptyMealCard}
                  onPress={() => navigation.navigate('AddMeal', {})}
                >
                  <View style={styles.emptyMealLeft}>
                    <View style={[styles.emptyIcon, { backgroundColor: color + '15' }]}>
                      <Ionicons name={config.icon} size={24} color={color} />
                    </View>
                    <View>
                      <Text style={styles.emptyMealTitle}>{config.label}</Text>
                      <Text style={styles.emptyMealSub}>Önerilen: Yakala! 💪</Text>
                    </View>
                  </View>
                  <View style={styles.emptyMealRight}>
                    <Text style={styles.emptyCalories}>0 kcal</Text>
                    <View style={styles.addSmallBtn}>
                      <Ionicons name="add" size={20} color={colors.primary.main} />
                    </View>
                  </View>
                </AnimatedPressable>
              </Animated.View>
            )
          }

          return mealsForType.map((meal) => {
            const idx = cardIndex++
            return (
              <Animated.View key={meal.id} style={staggeredStyles[idx]}>
                <View style={styles.mealCardShadow}>
                  <MealCard
                    mealType={meal.type}
                    foods={(meal.items || []).map((i) => ({ name: i.food?.name || 'Bilinmeyen', calories: Math.round((i.food?.nutrition?.calories || 0) * (i.quantity || 1)) }))}
                    totalCalories={Math.round(meal.totalNutrition?.calories || 0)}
                    time={meal.time}
                    onPress={() => navigation.navigate('MealDetail', { mealId: meal.id })}
                    style={styles.mealCard}
                  />
                </View>
              </Animated.View>
            )
          })
        })}
      </View>

      <View style={{ height: 100 }} />

      {/* FAB */}
      <FloatingActionButton
        icon={<Ionicons name="add" size={32} color="#FFFFFF" />}
        onPress={() => navigation.navigate('AddMeal', {})}
        position="bottom-right"
        style={styles.fabShadow}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingBottom: 120,
    backgroundColor: '#F8F9FA',
  },
  glowTopRight: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: nutritionColors.macro.protein + '20', // Soft yellow/orange glow
    transform: [{ scale: 1.5 }],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.paper,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  overviewCard: {
    backgroundColor: colors.background.paper,
    borderRadius: 32,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  overviewTitle: {
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
  },
  ringContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  macroCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  macroBar: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  summary: {
    marginBottom: 0,
  },
  sectionMargin: {
    marginBottom: spacing.lg,
  },
  mealsListWrapper: {
    gap: spacing.md,
  },
  emptyMealCard: {
    backgroundColor: colors.background.paper,
    borderRadius: 24,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyMealLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emptyMealTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  emptyMealSub: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginTop: 2,
  },
  emptyMealRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyCalories: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.disabled,
    marginRight: spacing.md,
  },
  addSmallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealCardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  mealCard: {
    borderRadius: 24,
  },
  fabShadow: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.paper,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  planCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  planSub: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
})
