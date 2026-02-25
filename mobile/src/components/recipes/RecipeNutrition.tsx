import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface NutritionInfo {
  label: string
  value: string
  color: string
}

interface RecipeNutritionProps {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  style?: ViewStyle
}

export const RecipeNutrition: React.FC<RecipeNutritionProps> = ({
  calories,
  protein,
  carbs,
  fat,
  fiber,
  style,
}) => {
  const items: NutritionInfo[] = [
    { label: 'Calories', value: `${calories} kcal`, color: colors.primary.main },
    { label: 'Protein', value: `${protein}g`, color: '#E53935' },
    { label: 'Carbs', value: `${carbs}g`, color: '#1E88E5' },
    { label: 'Fat', value: `${fat}g`, color: '#FDD835' },
  ]

  if (fiber !== undefined) {
    items.push({ label: 'Fiber', value: `${fiber}g`, color: '#66BB6A' })
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Nutrition per Serving</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.label} style={styles.item}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    width: '25%',
    marginBottom: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  label: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginTop: 1,
  },
})
