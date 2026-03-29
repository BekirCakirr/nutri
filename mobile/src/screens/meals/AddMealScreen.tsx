import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { shadows } from '../../theme/shadows'
import { AnimatedPressable } from '../../components/ui/AnimatedPressable'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RouteProp } from '@react-navigation/native'
import type { MealsStackParamList } from '../../navigation/types'
import type { Food, MealType, MealItem } from '../../types'
import { useMealStore } from '../../stores/mealStore'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { MealTypeSelector } from '../../components/nutrition/MealTypeSelector'
import { MacroBar } from '../../components/nutrition/MacroBar'
import { FoodListItem } from '../../components/nutrition/FoodListItem'
import { SectionHeader } from '../../components/common/SectionHeader'
import { colors } from '../../theme/colors'
import { spacing, borderRadius } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<MealsStackParamList, 'AddMeal'>
type Route = RouteProp<MealsStackParamList, 'AddMeal'>

export default function AddMealScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const { addMeal } = useMealStore()

  const [mealType, setMealType] = useState<MealType>('breakfast')
  const [items, setItems] = useState<MealItem[]>([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // Handle returned food from FoodDetail
  useEffect(() => {
    const params = route.params
    if (params?.selectedFood) {
      const food = params.selectedFood
      const quantity = params.selectedQuantity ?? food.servingSize
      const unit = params.selectedUnit ?? food.servingUnit
      // Avoid adding duplicate
      setItems((prev) => {
        const exists = prev.some((i) => i.food.id === food.id)
        if (exists) return prev
        return [...prev, { food, quantity, unit }]
      })
      // Clear params
      navigation.setParams({ selectedFood: undefined, selectedQuantity: undefined, selectedUnit: undefined })
    }
    if (params?.aiFoods) {
      setItems((prev) => {
        const newItems = [...prev]
        params.aiFoods!.forEach((aiItem) => {
          if (!newItems.some((i) => i.food.id === aiItem.food.id)) {
            newItems.push(aiItem)
          }
        })
        return newItems
      })
      navigation.setParams({ aiFoods: undefined })
    }
  }, [route.params])

  const totals = useMemo(() => {
    let calories = 0, protein = 0, carbs = 0, fat = 0
    for (const item of items) {
      const mult = item.quantity / item.food.servingSize
      calories += item.food.nutrition.calories * mult
      protein += item.food.nutrition.protein * mult
      carbs += item.food.nutrition.carbs * mult
      fat += item.food.nutrition.fat * mult
    }
    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    }
  }, [items])

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (items.length === 0) return
    setSaving(true)
    try {
      const now = new Date()
      const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      await addMeal(mealType, items, date, time)
      navigation.goBack()
    } catch {
      // silently fail for now
    } finally {
      setSaving(false)
    }
  }

  return (
    <ScreenWrapper scrollable keyboardAvoiding>
      {/* Meal Type Selector */}
      <MealTypeSelector selected={mealType} onSelect={setMealType} style={styles.typeSelector} />

      {/* Items Section */}
      <SectionHeader title="Eklenen Yiyecekler" />

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="fast-food-outline" size={48} color={colors.text.disabled} />
          <Text style={styles.emptyText}>Henüz yiyecek eklenmedi</Text>
        </View>
      ) : (
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <FoodListItem
              key={`${item.food.id}-${index}`}
              name={item.food.name}
              brand={item.food.brand}
              calories={Math.round(item.food.nutrition.calories * (item.quantity / item.food.servingSize))}
              servingSize={`${item.quantity} ${item.unit}`}
              rightAction={
                <TouchableOpacity onPress={() => removeItem(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              }
            />
          ))}
        </View>
      )}

      {/* Add Food Button */}
      <AnimatedPressable
        style={styles.addFoodBtn}
        onPress={() => navigation.navigate('FoodSearch', { returnTo: 'AddMeal' })}
      >
        <Ionicons name="add-circle-outline" size={22} color={colors.primary.main} />
        <Text style={styles.addFoodText}>Yiyecek Ekle</Text>
      </AnimatedPressable>

      {/* Macro Summary */}
      {items.length > 0 && (
        <View style={styles.macroSection}>
          <Text style={styles.totalCalories}>{totals.calories} kcal</Text>
          <MacroBar protein={totals.protein} carbs={totals.carbs} fat={totals.fat} />
        </View>
      )}

      {/* Notes */}
      <TextInput
        style={styles.notesInput}
        placeholder="Notlar (isteğe bağlı)..."
        placeholderTextColor={colors.text.disabled}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      {/* Save Button */}
      <AnimatedPressable
        style={[styles.saveBtn, items.length === 0 && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={items.length === 0 || saving}
      >
        <Text style={styles.saveBtnText}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
      </AnimatedPressable>

      <View style={{ height: spacing.lg }} />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  typeSelector: {
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.text.disabled,
    marginTop: spacing.sm,
  },
  itemsList: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  addFoodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primary.main,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  addFoodText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.primary.main,
    marginLeft: spacing.sm,
  },
  macroSection: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  totalCalories: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  notesInput: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text.primary,
    minHeight: 80,
    marginBottom: spacing.md,
  },
  saveBtn: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.md,
  },
  saveBtnDisabled: {
    backgroundColor: colors.border,
  },
  saveBtnText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: '#FFFFFF',
  },
})
