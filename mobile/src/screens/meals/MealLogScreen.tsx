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
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MealsStackParamList } from '@/navigation/types'
import type { Meal, MealType } from '@/types'
import { useMealStore } from '@/stores/mealStore'
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

type Nav = NativeStackNavigationProp<MealsStackParamList>

const turkishMonths = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
]

const CALORIE_TARGET = 2000
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
  return isToday ? `Bugün ${day} ${month} ${year}` : `${day} ${month} ${year}`
}

export default function MealLogScreen() {
  const navigation = useNavigation<Nav>()
  const { todayMeals, loadTodayMeals } = useMealStore()
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
    <ScreenWrapper scrollable>
      {/* Date Picker Row */}
      <View style={styles.dateRow}>
        <AnimatedPressable onPress={() => changeDate(-1)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </AnimatedPressable>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <AnimatedPressable onPress={() => changeDate(1)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-forward" size={24} color={colors.text.primary} />
        </AnimatedPressable>
      </View>

      {/* Calorie Ring */}
      <View style={styles.ringContainer}>
        <CalorieRing consumed={totals.calories} target={CALORIE_TARGET} />
      </View>

      {/* Macro Bar */}
      <MacroBar protein={totals.protein} carbs={totals.carbs} fat={totals.fat} style={styles.macroBar} />

      {/* Calorie Summary */}
      <CalorieSummary consumed={totals.calories} target={CALORIE_TARGET} style={styles.summary} />

      {/* Meals Section */}
      <SectionHeader title="Öğünler" />

      {MEAL_TYPES.map((type) => {
        const mealsForType = mealsByType[type]
        const config = mealTypeConfig[type]
        const color = nutritionColors.mealType[type]

        if (mealsForType.length === 0) {
          const idx = cardIndex++
          return (
            <Animated.View key={type} style={staggeredStyles[idx]}>
              <AnimatedPressable
                style={styles.emptyMealCard}
                onPress={() => navigation.navigate('AddMeal', {})}
              >
                <View style={styles.emptyMealLeft}>
                  <View style={[styles.emptyIcon, { backgroundColor: color + '18' }]}>
                    <Ionicons name={config.icon} size={20} color={color} />
                  </View>
                  <Text style={styles.emptyMealTitle}>{config.label}</Text>
                </View>
                <View style={styles.emptyMealRight}>
                  <Text style={styles.emptyCalories}>0 kcal</Text>
                  <View style={styles.addSmallBtn}>
                    <Ionicons name="add" size={18} color={colors.primary.main} />
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
              <MealCard
                mealType={meal.type}
                foods={(meal.items || []).map((i) => ({ name: i.food?.name || 'Bilinmeyen', calories: Math.round((i.food?.nutrition?.calories || 0) * (i.quantity || 1)) }))}
                totalCalories={Math.round(meal.totalNutrition?.calories || 0)}
                time={meal.time}
                onPress={() => navigation.navigate('MealDetail', { mealId: meal.id })}
                style={styles.mealCard}
              />
            </Animated.View>
          )
        })
      })}

      <View style={{ height: 80 }} />

      {/* FAB */}
      <FloatingActionButton
        icon={<Ionicons name="add" size={28} color="#FFFFFF" />}
        onPress={() => navigation.navigate('AddMeal', {})}
        position="bottom-right"
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  dateText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginHorizontal: spacing.md,
  },
  ringContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  macroBar: {
    marginVertical: spacing.sm,
  },
  summary: {
    marginBottom: spacing.md,
  },
  emptyMealCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  emptyMealLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  emptyMealTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  emptyMealRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyCalories: {
    fontSize: fontSizes.md,
    color: colors.text.disabled,
    marginRight: spacing.sm,
  },
  addSmallBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealCard: {
    marginBottom: spacing.sm,
  },
})
