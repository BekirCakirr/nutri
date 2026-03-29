import React from 'react'
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Animated,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { MealsStackParamList } from '../../navigation/types'
import type { Meal, MealType } from '../../types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { SectionHeader } from '../../components/common/SectionHeader'
import { FoodListItem } from '../../components/nutrition/FoodListItem'
import { NutritionLabel } from '../../components/nutrition/NutritionLabel'
import { MacroBar } from '../../components/nutrition/MacroBar'
import { useMealStore } from '../../stores/mealStore'
import * as mealApi from '../../services/api/meal'
import { colors, nutritionColors } from '../../theme/colors'
import { spacing, borderRadius } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { shadows } from '../../theme/shadows'
import { AnimatedPressable } from '../../components/ui/AnimatedPressable'
import { useFadeIn } from '../../components/ui/useFadeIn'

type Nav = StackNavigationProp<MealsStackParamList, 'MealDetail'>
type Route = RouteProp<MealsStackParamList, 'MealDetail'>

const mealTypeLabels: Record<MealType, string> = {
  breakfast: 'Kahvalti',
  lunch: 'Ogle Yemegi',
  dinner: 'Aksam Yemegi',
  snack: 'Ara Ogun',
}

const mealTypeColors = nutritionColors.mealType

const mealTypeIcons: Record<MealType, string> = {
  breakfast: 'sunny-outline',
  lunch: 'restaurant-outline',
  dinner: 'moon-outline',
  snack: 'cafe-outline',
}

export default function MealDetailScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const { mealId } = route.params

  const { todayMeals, mealHistory, removeMeal } = useMealStore()

  const meal: Meal | undefined =
    todayMeals.find((m) => m.id === mealId) ??
    mealHistory.find((m) => m.id === mealId)

  if (!meal) {
    return (
      <ScreenWrapper>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.text.disabled} />
          <Text style={styles.emptyText}>Ogun bulunamadi.</Text>
        </View>
      </ScreenWrapper>
    )
  }

  const fadeIn = useFadeIn(0)
  const typeColor = mealTypeColors[meal.type]
  const typeLabel = mealTypeLabels[meal.type]
  const typeIcon = mealTypeIcons[meal.type]

  const nutrients = [
    {
      name: 'Toplam Yag',
      amount: `${Math.round(meal.totalNutrition.fat * 10) / 10}g`,
      dailyValue: Math.round((meal.totalNutrition.fat / 78) * 100),
      bold: true,
    },
    {
      name: 'Toplam Karbonhidrat',
      amount: `${Math.round(meal.totalNutrition.carbs * 10) / 10}g`,
      dailyValue: Math.round((meal.totalNutrition.carbs / 275) * 100),
      bold: true,
    },
    ...(meal.totalNutrition.fiber !== undefined
      ? [{
          name: 'Lif',
          amount: `${Math.round(meal.totalNutrition.fiber * 10) / 10}g`,
          dailyValue: Math.round((meal.totalNutrition.fiber / 28) * 100),
          indent: true,
        }]
      : []),
    ...(meal.totalNutrition.sugar !== undefined
      ? [{
          name: 'Seker',
          amount: `${Math.round(meal.totalNutrition.sugar * 10) / 10}g`,
          indent: true,
        }]
      : []),
    {
      name: 'Protein',
      amount: `${Math.round(meal.totalNutrition.protein * 10) / 10}g`,
      dailyValue: Math.round((meal.totalNutrition.protein / 50) * 100),
      bold: true,
    },
    ...(meal.totalNutrition.sodium !== undefined
      ? [{
          name: 'Sodyum',
          amount: `${Math.round(meal.totalNutrition.sodium)}mg`,
          dailyValue: Math.round((meal.totalNutrition.sodium / 2300) * 100),
          bold: true,
        }]
      : []),
  ]

  const handleDelete = () => {
    Alert.alert(
      'Ogunu Sil',
      'Bu ogunu silmek istediginizden emin misiniz?',
      [
        { text: 'Iptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await removeMeal(mealId)
            navigation.goBack()
          },
        },
      ],
    )
  }

  return (
    <ScreenWrapper scrollable>
      {/* Meal Type Header */}
      <Animated.View style={[styles.header, fadeIn.style]}>
        <View style={[styles.typeIconCircle, { backgroundColor: typeColor + '20' }]}>
          <Ionicons name={typeIcon as any} size={28} color={typeColor} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.typeLabel}>{typeLabel}</Text>
          <Text style={styles.timeText}>{meal.time}</Text>
        </View>
      </Animated.View>

      {/* Foods Section */}
      <SectionHeader title="Yiyecekler" style={styles.sectionHeader} />

      <View style={styles.foodList}>
        {meal.items.map((item, index) => (
          <FoodListItem
            key={`${item.food.id}-${index}`}
            name={item.food.name}
            brand={item.food.brand}
            calories={Math.round(
              item.food.nutrition.calories * (item.quantity / item.food.servingSize),
            )}
            servingSize={`${item.quantity} ${item.unit}`}
          />
        ))}
      </View>

      {/* Nutrition Label */}
      <NutritionLabel
        servingSize={`${meal.items.length} yiyecek`}
        calories={Math.round(meal.totalNutrition.calories)}
        nutrients={nutrients}
        style={styles.nutritionLabel}
      />

      {/* Macro Bar */}
      <MacroBar
        protein={meal.totalNutrition.protein}
        carbs={meal.totalNutrition.carbs}
        fat={meal.totalNutrition.fat}
        style={styles.macroBar}
      />

      {/* Notes */}
      {meal.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notlar</Text>
          <Text style={styles.notesText}>{meal.notes}</Text>
        </View>
      )}

      {/* Delete Button */}
      <AnimatedPressable
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
        <Text style={styles.deleteButtonText}>Sil</Text>
      </AnimatedPressable>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    color: colors.text.disabled,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  typeIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  typeLabel: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  timeText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    marginTop: spacing.sm,
  },
  foodList: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  nutritionLabel: {
    marginTop: spacing.lg,
  },
  macroBar: {
    marginTop: spacing.lg,
  },
  notesSection: {
    marginTop: spacing.lg,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  notesTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  notesText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    lineHeight: fontSizes.md * 1.6,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBE9E7',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  deleteButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.error,
  },
})
