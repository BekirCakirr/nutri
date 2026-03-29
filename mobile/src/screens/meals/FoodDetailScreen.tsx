import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { MealsStackParamList } from '../../navigation/types'
import type { Food, FoodCategory } from '../../types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { PortionSlider } from '../../components/nutrition/PortionSlider'
import { NutritionLabel } from '../../components/nutrition/NutritionLabel'
import { MacroBar } from '../../components/nutrition/MacroBar'
import { useFoodStore } from '../../stores/foodStore'
import * as foodApi from '../../services/api/food'
import { colors, nutritionColors } from '../../theme/colors'
import { spacing, borderRadius } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { shadows } from '../../theme/shadows'
import { AnimatedPressable } from '../../components/ui/AnimatedPressable'
import { useFadeIn } from '../../components/ui/useFadeIn'

type Nav = StackNavigationProp<MealsStackParamList, 'FoodDetail'>
type Route = RouteProp<MealsStackParamList, 'FoodDetail'>

const categoryIcons: Record<string, string> = {
  fruit: 'nutrition-outline',
  vegetable: 'leaf-outline',
  grain: 'fast-food-outline',
  protein: 'fish-outline',
  dairy: 'water-outline',
  fat: 'water-outline',
  snack: 'ice-cream-outline',
  beverage: 'cafe-outline',
  prepared: 'restaurant-outline',
  other: 'ellipse-outline',
}

const categoryColors: Record<FoodCategory, string> = nutritionColors.category as Record<FoodCategory, string>

export default function FoodDetailScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const { foodId } = route.params

  const { searchResults, recentFoods, favoriteFoods } = useFoodStore()

  const [food, setFood] = useState<Food | null>(null)
  const [loading, setLoading] = useState(false)
  const [servings, setServings] = useState(1)

  useEffect(() => {
    const found =
      searchResults.find((f) => f.id === foodId) ??
      recentFoods.find((f) => f.id === foodId) ??
      favoriteFoods.find((f) => f.id === foodId)

    if (found) {
      setFood(found)
    } else {
      setLoading(true)
      foodApi.getFoodById(foodId).then((result) => {
        setFood(result)
        setLoading(false)
      })
    }
  }, [foodId])

  if (loading || !food) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </ScreenWrapper>
    )
  }

  const adjustedCalories = Math.round(food.nutrition.calories * servings)
  const adjustedProtein = Math.round(food.nutrition.protein * servings * 10) / 10
  const adjustedCarbs = Math.round(food.nutrition.carbs * servings * 10) / 10
  const adjustedFat = Math.round(food.nutrition.fat * servings * 10) / 10
  const adjustedFiber = food.nutrition.fiber
    ? Math.round(food.nutrition.fiber * servings * 10) / 10
    : undefined
  const adjustedSugar = food.nutrition.sugar
    ? Math.round(food.nutrition.sugar * servings * 10) / 10
    : undefined
  const adjustedSodium = food.nutrition.sodium
    ? Math.round(food.nutrition.sodium * servings)
    : undefined

  const nutrients = [
    { name: 'Toplam Yag', amount: `${adjustedFat}g`, dailyValue: Math.round((adjustedFat / 78) * 100), bold: true },
    { name: 'Doymus Yag', amount: '-', indent: true },
    { name: 'Toplam Karbonhidrat', amount: `${adjustedCarbs}g`, dailyValue: Math.round((adjustedCarbs / 275) * 100), bold: true },
    ...(adjustedFiber !== undefined
      ? [{ name: 'Lif', amount: `${adjustedFiber}g`, dailyValue: Math.round((adjustedFiber / 28) * 100), indent: true }]
      : []),
    ...(adjustedSugar !== undefined
      ? [{ name: 'Seker', amount: `${adjustedSugar}g`, indent: true }]
      : []),
    { name: 'Protein', amount: `${adjustedProtein}g`, dailyValue: Math.round((adjustedProtein / 50) * 100), bold: true },
    ...(adjustedSodium !== undefined
      ? [{ name: 'Sodyum', amount: `${adjustedSodium}mg`, dailyValue: Math.round((adjustedSodium / 2300) * 100), bold: true }]
      : []),
  ]

  const handleAddToMeal = () => {
    navigation.navigate('AddMeal', {
      selectedFood: food,
      selectedQuantity: food.servingSize * servings,
      selectedUnit: food.servingUnit,
    })
  }

  const iconName = categoryIcons[food.category] || 'ellipse-outline'
  const iconColor = categoryColors[food.category] || '#7A8F84'
  const fadeIn = useFadeIn(0)

  return (
    <ScreenWrapper scrollable>
      {/* Food Image or Category Icon */}
      <Animated.View style={fadeIn.style}>
        {food.image ? (
          <Image source={{ uri: food.image }} style={styles.foodImage} />
        ) : (
          <View style={[styles.iconPlaceholder, { backgroundColor: iconColor + '20' }]}>
            <Ionicons name={iconName as any} size={56} color={iconColor} />
          </View>
        )}
      </Animated.View>

      {/* Food Name & Brand */}
      <Text style={styles.foodName}>{food.name}</Text>
      {food.brand && <Text style={styles.foodBrand}>{food.brand}</Text>}

      {/* Portion Slider */}
      <PortionSlider
        value={servings}
        onValueChange={setServings}
        minimumValue={0.5}
        maximumValue={5}
        step={0.5}
        label="Porsiyon"
        unit={food.servingUnit}
        style={styles.slider}
      />

      {/* Nutrition Label */}
      <NutritionLabel
        servingSize={`${Math.round(food.servingSize * servings)} ${food.servingUnit}`}
        calories={adjustedCalories}
        nutrients={nutrients}
        style={styles.nutritionLabel}
      />

      {/* Macro Bar */}
      <MacroBar
        protein={adjustedProtein}
        carbs={adjustedCarbs}
        fat={adjustedFat}
        style={styles.macroBar}
      />

      {/* Spacer for sticky button */}
      <View style={styles.bottomSpacer} />

      {/* Sticky Add Button */}
      <View style={styles.stickyButtonContainer}>
        <AnimatedPressable
          style={styles.addButton}
          onPress={handleAddToMeal}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Ogune Ekle</Text>
        </AnimatedPressable>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
  },
  foodImage: {
    width: '100%',
    height: 220,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.border,
  },
  iconPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  foodName: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  foodBrand: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  slider: {
    marginTop: spacing.lg,
  },
  nutritionLabel: {
    marginTop: spacing.lg,
  },
  macroBar: {
    marginTop: spacing.lg,
  },
  bottomSpacer: {
    height: spacing.xxl + spacing.xl,
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.background.default,
    ...shadows.xl,
    shadowOffset: { width: 0, height: -4 },
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    ...shadows.md,
  },
  addButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: '#FFFFFF',
  },
})
