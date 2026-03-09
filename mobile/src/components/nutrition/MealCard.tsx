import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, nutritionColors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { shadows } from '../../theme/shadows'
import { mealTypeConfig } from '../../theme/icons'
import { AnimatedPressable } from '../ui/AnimatedPressable'

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

export const MealCard: React.FC<MealCardProps> = ({
  mealType,
  foods,
  totalCalories,
  time,
  onPress,
  style,
}) => {
  const config = mealTypeConfig[mealType]
  const color = nutritionColors.mealType[mealType]

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.card, style]}
    >
      <View style={[styles.accentBar, { backgroundColor: color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: color + '18' }]}>
              <Ionicons name={config.icon} size={20} color={color} />
            </View>
            <View>
              <Text style={styles.mealType}>{config.label}</Text>
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
      </View>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...shadows.sm,
  },
  accentBar: {
    width: 3,
  },
  content: {
    flex: 1,
    padding: spacing.md,
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
