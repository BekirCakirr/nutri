import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

interface FoodEntry {
  name: string
  calories: number
}

interface MealCardProps {
  mealType: MealType
  foods: FoodEntry[]
  totalCalories: number
  time?: string
  onPress?: () => void
  style?: ViewStyle
}

const mealLabels: Record<MealType, string> = {
  breakfast: 'Kahvalti',
  lunch: 'Ogle',
  dinner: 'Aksam',
  snack: 'Ara Ogun',
}

const mealIconNames: Record<MealType, keyof typeof Ionicons.glyphMap> = {
  breakfast: 'cafe-outline',
  lunch: 'restaurant-outline',
  dinner: 'moon-outline',
  snack: 'nutrition-outline',
}

const mealColors: Record<MealType, string> = {
  breakfast: '#FF9800',
  lunch: '#4CAF50',
  dinner: '#2196F3',
  snack: '#9C27B0',
}

export const MealCard: React.FC<MealCardProps> = ({
  mealType,
  foods,
  totalCalories,
  time,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.card, style]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[styles.iconContainer, { backgroundColor: mealColors[mealType] + '18' }]}
          >
            <Ionicons name={mealIconNames[mealType]} size={20} color={mealColors[mealType]} />
          </View>
          <View>
            <Text style={styles.mealType}>{mealLabels[mealType]}</Text>
            {time && <Text style={styles.time}>{time}</Text>}
          </View>
        </View>
        <Text style={styles.calories}>{totalCalories} kcal</Text>
      </View>
      {foods.length > 0 && (
        <View style={styles.foodList}>
          {foods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Text style={styles.foodName} numberOfLines={1}>
                {food.name}
              </Text>
              <Text style={styles.foodCalories}>{food.calories} kcal</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  mealType: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  time: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  calories: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  foodList: {
    marginTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  foodName: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  foodCalories: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
})
