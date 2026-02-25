import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface TimelineMeal {
  id: string
  mealType: string
  time: string
  calories: number
  description: string
}

interface MealTimelineProps {
  meals: TimelineMeal[]
  style?: ViewStyle
}

const mealColors: Record<string, string> = {
  breakfast: '#FF9800',
  lunch: '#4CAF50',
  dinner: '#2196F3',
  snack: '#9C27B0',
}

export const MealTimeline: React.FC<MealTimelineProps> = ({
  meals,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {meals.map((meal, index) => {
        const dotColor = mealColors[meal.mealType] || colors.primary.main
        const isLast = index === meals.length - 1

        return (
          <View key={meal.id} style={styles.item}>
            <View style={styles.timeline}>
              <View style={[styles.dot, { backgroundColor: dotColor }]} />
              {!isLast && <View style={styles.line} />}
            </View>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.time}>{meal.time}</Text>
                <Text style={styles.calories}>{meal.calories} kcal</Text>
              </View>
              <Text style={styles.mealType}>{meal.mealType}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {meal.description}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  item: {
    flexDirection: 'row',
  },
  timeline: {
    alignItems: 'center',
    width: 24,
    marginRight: spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  calories: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  mealType: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    marginTop: 2,
  },
})
