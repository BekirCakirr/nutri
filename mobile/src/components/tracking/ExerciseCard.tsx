import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface ExerciseCardProps {
  name: string
  duration: number // in minutes
  caloriesBurned: number
  type: string
  time?: string
  onPress?: () => void
  style?: ViewStyle
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  name,
  duration,
  caloriesBurned,
  type,
  time,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.container, style]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{type.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>
          {duration} min {time ? `\u2022 ${time}` : ''}
        </Text>
      </View>
      <View style={styles.caloriesContainer}>
        <Text style={styles.calories}>-{caloriesBurned}</Text>
        <Text style={styles.caloriesLabel}>kcal</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.secondary[700],
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  details: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  caloriesContainer: {
    alignItems: 'flex-end',
  },
  calories: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.secondary.main,
  },
  caloriesLabel: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
  },
})
